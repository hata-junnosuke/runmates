# =============================================================================
# ECS Resources for Runmates Backend
#
# Runmatesバックエンド（Rails + Nginx）をECS Fargateで動かすためのリソース定義。
# 既存のAWSコンソールで手動作成されたリソースを terraform import でstate管理に取り込み済み。
#
# 構成図:
#   ALB → [ECS Service] → [Task: nginx(port80) + rails(port3000)]
#                              ↓
#                        CloudWatch Logs
# =============================================================================

# -----------------------------------------------------------------------------
# CloudWatch Log Group
# ECSタスク（railsコンテナ）のログ出力先。
# retention_in_days = 0 は「ログを無期限に保持する」設定。
# -----------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/runmates-task-definition-backend"
  retention_in_days = 0
}

# -----------------------------------------------------------------------------
# IAM Role for ECS Task Execution
#
# ECSタスクがAWSサービスにアクセスするためのIAMロール。
# 「信頼ポリシー（assume_role_policy）」で、ECSタスクサービスのみがこのロールを
# 引き受けられるように制限している。
# -----------------------------------------------------------------------------

# 信頼ポリシー: 「誰がこのロールを使えるか」を定義
# → ecs-tasks.amazonaws.com（ECSのタスク実行サービス）のみ許可
data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_task_execution" {
  name               = "ecsTaskExecutionRole"
  description        = "Allows ECS tasks to call AWS services on your behalf."
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

# ロールに付与するAWS管理ポリシー（3つ）:
# - AmazonECS_FullAccess:      ECSリソースの操作権限
# - CloudWatchFullAccess:       ログの書き込み権限
# - AmazonEC2ContainerRegistryReadOnly: ECRからDockerイメージをpullする権限
resource "aws_iam_role_policy_attachment" "ecs_full_access" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonECS_FullAccess"
}

resource "aws_iam_role_policy_attachment" "cloudwatch_full_access" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchFullAccess"
}

resource "aws_iam_role_policy_attachment" "ecr_read_only" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# -----------------------------------------------------------------------------
# ECS Cluster
# ECSサービスやタスクをまとめて管理する論理グループ。
# 1つのクラスターに複数のサービスを配置できる。
# -----------------------------------------------------------------------------
resource "aws_ecs_cluster" "main" {
  name = "runmates-cluster"
}

# -----------------------------------------------------------------------------
# ECS Task Definition
#
# 「どのコンテナをどう動かすか」の設計図。
# 1つのタスクに2つのコンテナ（rails + nginx）を定義している。
#
# 処理の流れ:
#   1. railsコンテナが起動し、Pumaがport3000とUnixソケットで待ち受け
#   2. railsのヘルスチェックが通ると「HEALTHY」状態になる
#   3. nginxコンテナが起動（railsがHEALTHYになるまで待機）
#   4. nginxがport80でリクエストを受け、railsに転送（リバースプロキシ）
#
# cpu/memoryの単位:
#   cpu = "256"  → 0.25 vCPU
#   memory = "512" → 512 MB
# -----------------------------------------------------------------------------
resource "aws_ecs_task_definition" "backend" {
  family                   = "runmates-task-definition-backend"
  network_mode             = "awsvpc" # Fargate必須。各タスクに固有のENI（ネットワークIF）が割り当てられる
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn # ECRからのイメージpull、CloudWatch Logsへの書き込みに使用
  task_role_arn            = aws_iam_role.ecs_task_execution.arn # コンテナ内のアプリがAWSサービスを呼ぶ際に使用

  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  # コンテナ定義（JSON形式）
  # jsonencode()でHCLのマップ/リストをJSON文字列に変換している
  container_definitions = jsonencode([
    # --- railsコンテナ ---
    {
      name      = "rails"
      image     = var.rails_image # ECRのイメージURI（変数で管理）
      cpu       = 0               # 0 = タスク全体のCPUを共有
      essential = true            # このコンテナが停止するとタスク全体が停止

      portMappings = [
        {
          name          = "rails-3000-tcp"
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]

      environment = [
        {
          name  = "RAILS_LOG_TO_STDOUT"
          value = "true" # ログをファイルではなく標準出力に → CloudWatch Logsに転送される
        }
      ]

      # CloudWatch Logsへのログ転送設定
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
          "mode"                  = "non-blocking" # ログ送信がブロッキングしない（アプリ性能に影響しない）
          "max-buffer-size"       = "25m"
          "awslogs-create-group"  = "true"
        }
      }

      # PumaのUnixソケット経由でヘルスチェック
      healthCheck = {
        command     = ["CMD-SHELL", "curl --unix-socket /myapp/tmp/sockets/puma.sock localhost/api/v1/health_check || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 0
      }
    },

    # --- nginxコンテナ ---
    {
      name      = "nginx"
      image     = var.nginx_image
      cpu       = 0
      essential = true

      portMappings = [
        {
          name          = "nginx-80-tcp"
          containerPort = 80 # ALBからのトラフィックはこのポートで受ける
          hostPort      = 80
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]

      environment = []

      # railsコンテナのボリューム（Unixソケットファイル等）を共有
      volumesFrom = [
        {
          sourceContainer = "rails"
          readOnly        = false
        }
      ]

      # railsコンテナが「HEALTHY」になるまで起動を待機
      dependsOn = [
        {
          containerName = "rails"
          condition     = "HEALTHY"
        }
      ]

      # HTTP経由でnginxのヘルスチェック
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost/api/v1/health_check || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 0
      }
    }
  ])

  # CDパイプライン（cd.yml）がデプロイ時にコンテナ定義（イメージタグ等）を
  # 動的に更新するため、Terraformでは変更を無視する
  lifecycle {
    ignore_changes = [container_definitions]
  }
}

# -----------------------------------------------------------------------------
# ECS Service
#
# Task Definitionの「実行管理者」。
# 指定した数のタスクを常に維持し、ALBと連携してトラフィックを振り分ける。
#
# トラフィックの流れ:
#   インターネット → ALB → Target Group → ECS Service → nginx(port80) → rails
# -----------------------------------------------------------------------------
resource "aws_ecs_service" "backend" {
  name                    = "runmates-task-definition-backend-service"
  cluster                 = aws_ecs_cluster.main.id
  task_definition         = aws_ecs_task_definition.backend.arn
  desired_count           = 0 # 現在停止中。CDパイプラインがデプロイ時に1以上に設定する
  launch_type             = "FARGATE"
  enable_ecs_managed_tags = true # ECSがタスクにクラスター名等のタグを自動付与
  enable_execute_command  = true # ECS ExecでコンテナにSSHライクに接続可能にする

  # デプロイ失敗時にサーキットブレーカーが発動し、自動で前バージョンにロールバック
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  # タスクを配置するネットワーク設定
  network_configuration {
    subnets = [
      aws_subnet.public_1a.id, # パブリックサブネット（NAT Gatewayなしの構成のため）
      aws_subnet.public_1c.id,
    ]
    security_groups  = [aws_security_group.ecs.id] # ALBからのport80のみ許可（network.tfで定義）
    assign_public_ip = true                        # FargateタスクにパブリックIPを付与（ECRからのイメージpullに必要）
  }

  # ALBターゲットグループとの紐付け
  # nginxコンテナのport80にALBがヘルスチェック＆トラフィック転送する
  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn # alb.tfで定義
    container_name   = "nginx"
    container_port   = 80
  }

  # CDパイプライン（cd.yml）が動的に更新するフィールドはTerraformで管理しない
  # - task_definition: デプロイ時に新しいリビジョンに差し替えられる
  # - desired_count:   デプロイ時に0→1等に変更される
  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}
