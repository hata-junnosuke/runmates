#!/bin/bash
# エラー即停止(-e)、未定義変数エラー(-u)、パイプ途中のエラー検知(pipefail)
set -euo pipefail

# ==============================================================================
# Runmates インフラ起動・停止スクリプト
#
# 使い方:
#   ./scripts/service-ctl.sh start   # ECS + RDS を起動
#   ./scripts/service-ctl.sh stop    # ECS + RDS を停止
#   ./scripts/service-ctl.sh status  # 現在の状態を確認
# ==============================================================================

AWS_REGION="ap-northeast-1"
AWS_PROFILE="terraform"
ECS_CLUSTER="runmates-cluster"
ECS_SERVICE="runmates-task-definition-backend-service"
RDS_INSTANCE="runmates-db"

# 共通のAWS CLIラッパー関数
# "$@" で渡された引数をすべてそのまま aws コマンドに転送する
aws_cmd() {
  aws --region "$AWS_REGION" --profile "$AWS_PROFILE" "$@"
}

# ---------- status ----------
cmd_status() {
  echo "=== RDS: $RDS_INSTANCE ==="
  # RDSの現在の状態を取得し、--query でステータスだけ抜き出す
  rds_status=$(aws_cmd rds describe-db-instances \
    --db-instance-identifier "$RDS_INSTANCE" \
    --query 'DBInstances[0].DBInstanceStatus' --output text)
  echo "  Status: $rds_status"

  echo ""
  echo "=== ECS: $ECS_SERVICE ==="
  # ECSサービスの desired/running カウントをJSON形式で取得
  ecs_info=$(aws_cmd ecs describe-services \
    --cluster "$ECS_CLUSTER" \
    --services "$ECS_SERVICE" \
    --query 'services[0].{desired:desiredCount,running:runningCount}' --output json)
  # jq でJSONからそれぞれの値を取り出す
  desired=$(echo "$ecs_info" | jq -r '.desired')
  running=$(echo "$ecs_info" | jq -r '.running')
  echo "  Desired: $desired / Running: $running"
}

# ---------- start ----------
# 起動順序: RDS先 → ECS後（RailsがDB接続できるように）
cmd_start() {
  echo "=== RDS を起動します ==="
  # まず現在の状態を確認
  rds_status=$(aws_cmd rds describe-db-instances \
    --db-instance-identifier "$RDS_INSTANCE" \
    --query 'DBInstances[0].DBInstanceStatus' --output text)

  if [ "$rds_status" = "available" ]; then
    echo "  RDS は既に起動しています"
  else
    # RDS起動リクエスト送信（> /dev/null で大量のJSON出力を捨てる）
    aws_cmd rds start-db-instance --db-instance-identifier "$RDS_INSTANCE" > /dev/null
    echo "  起動リクエスト送信。available になるまで待機します..."
    # available になるまでポーリングして待つ
    aws_cmd rds wait db-instance-available --db-instance-identifier "$RDS_INSTANCE"
    echo "  RDS が起動しました"
  fi

  echo ""
  echo "=== ECS を起動します (desired_count=1) ==="
  # タスク数を1に設定して起動（> /dev/null でJSON出力を捨てる）
  aws_cmd ecs update-service \
    --cluster "$ECS_CLUSTER" \
    --service "$ECS_SERVICE" \
    --desired-count 1 > /dev/null
  echo "  サービスが安定するまで待機します..."
  # タスクが起動して安定状態になるまで待つ
  aws_cmd ecs wait services-stable \
    --cluster "$ECS_CLUSTER" \
    --services "$ECS_SERVICE"
  echo "  ECS が起動しました"

  echo ""
  echo "=== 起動完了 ==="
}

# ---------- stop ----------
# 停止順序: ECS先 → RDS後（接続エラーを防ぐ）
cmd_stop() {
  echo "=== ECS を停止します (desired_count=0) ==="
  # タスク数を0に設定して停止（> /dev/null でJSON出力を捨てる）
  aws_cmd ecs update-service \
    --cluster "$ECS_CLUSTER" \
    --service "$ECS_SERVICE" \
    --desired-count 0 > /dev/null
  echo "  タスクが停止するまで待機します..."
  # タスクが停止して安定状態になるまで待つ
  aws_cmd ecs wait services-stable \
    --cluster "$ECS_CLUSTER" \
    --services "$ECS_SERVICE"
  echo "  ECS が停止しました"

  echo ""
  echo "=== RDS を停止します ==="
  # まず現在の状態を確認
  rds_status=$(aws_cmd rds describe-db-instances \
    --db-instance-identifier "$RDS_INSTANCE" \
    --query 'DBInstances[0].DBInstanceStatus' --output text)

  if [ "$rds_status" = "stopped" ]; then
    echo "  RDS は既に停止しています"
  else
    # RDS停止リクエスト送信（> /dev/null でJSON出力を捨てる）
    aws_cmd rds stop-db-instance --db-instance-identifier "$RDS_INSTANCE" > /dev/null
    echo "  停止リクエスト送信しました"
  fi

  echo ""
  echo "=== 停止完了 ==="
}

# ---------- main ----------
# 第1引数（${1:-} は未指定でも空文字になりエラーにならない書き方）で分岐
case "${1:-}" in
  start)  cmd_start ;;
  stop)   cmd_stop ;;
  status) cmd_status ;;
  *)
    echo "使い方: $0 {start|stop|status}"
    exit 1
    ;;
esac
