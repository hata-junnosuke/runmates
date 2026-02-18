################################################################################
# DB Subnet Group
# RDSを配置するプライベートサブネット（1a, 1c）をグループ化。
# network.tf で定義済みのサブネットを参照。
################################################################################
resource "aws_db_subnet_group" "main" {
  name        = "runmates-rds-subnet-group"
  description = "runmates-rds-subnet-group" # 既存リソースの実態に合わせて明示指定（省略すると "Managed by Terraform" になり差分が出る）
  subnet_ids  = [aws_subnet.private_1a.id, aws_subnet.private_1c.id]
}

################################################################################
# RDS Instance
# 既存のAWSコンソールで作成済みRDSを terraform import で取り込んだもの。
# パスワードはTerraformで管理せず、既存の値をそのまま維持する設計。
################################################################################
resource "aws_db_instance" "main" {
  identifier     = "runmates-db"
  engine         = "mysql"
  engine_version = "8.0.42"
  instance_class = "db.t4g.micro" # Graviton2ベースの最小インスタンス

  # ストレージ: 初期20GB、オートスケーリングで最大1000GBまで自動拡張
  allocated_storage     = 20
  max_allocated_storage = 1000
  storage_type          = "gp2"
  storage_encrypted     = true
  kms_key_id            = "arn:aws:kms:ap-northeast-1:905418297788:key/9f29d714-0cc8-4b1b-b665-eeb6bbe5eea2"

  # 認証: パスワードはTerraformに書かず、既存値を維持（lifecycle.ignore_changesと組み合わせ）
  username                    = "admin"
  manage_master_user_password = false

  # ネットワーク: プライベートサブネットに配置し、ECSからの3306のみ許可（SGはnetwork.tfで定義済み）
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = false
  availability_zone      = "ap-northeast-1a"

  # AWSデフォルトのパラメータ/オプショングループを使用（カスタム定義不要）
  parameter_group_name = "default.mysql8.0"
  option_group_name    = "default:mysql-8-0"

  # バックアップ・メンテナンス（時刻はUTC。JST深夜帯に設定済み）
  backup_retention_period    = 1
  backup_window              = "18:57-19:27"         # JST 03:57-04:27
  maintenance_window         = "tue:18:17-tue:18:47" # JST 火曜 03:17-03:47
  auto_minor_version_upgrade = true

  # 保護・スナップショット
  deletion_protection   = false
  skip_final_snapshot   = true # terraform destroy時に最終スナップショットを要求しない
  copy_tags_to_snapshot = true

  ca_cert_identifier = "rds-ca-rsa2048-g1"

  # password: Terraformにパスワードを持たせないため変更検知を無視
  # engine_version: auto_minor_version_upgradeによる自動更新との競合を防止
  lifecycle {
    ignore_changes = [password, engine_version]
  }
}
