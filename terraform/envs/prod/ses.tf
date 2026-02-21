# ==============================================================================
# SES (Simple Email Service) - ドメイン認証 & メール送信設定
# ==============================================================================

# SESドメインID: runmates.net のメール送信元ドメインを登録
resource "aws_ses_domain_identity" "runmates" {
  domain = "runmates.net"
}

# DKIM設定: メールの送信元ドメインを電子署名で検証
resource "aws_ses_domain_dkim" "runmates" {
  domain = aws_ses_domain_identity.runmates.domain
}

# DKIM検証用Route53 CNAMEレコード
# DKIMトークンはSESドメイン登録時に固定されるため、localsで定義
locals {
  ses_dkim_tokens = toset([
    "clhu3amxs6v6at6avp7sm2ygja6ifr4i",
    "csl3csfhgybfq4o3enw6oeins3lmvdp6",
    "d6p6xajgsnkpap7qiy4iuwlwwg3bzkdu",
  ])
}

resource "aws_route53_record" "ses_dkim" {
  for_each = local.ses_dkim_tokens

  zone_id = data.aws_route53_zone.runmates.zone_id
  name    = "${each.value}._domainkey.runmates.net"
  type    = "CNAME"
  ttl     = 1800

  records = ["${each.value}.dkim.amazonses.com"]
}

# DMARCレコード: なりすましメール対策ポリシー
resource "aws_route53_record" "dmarc_txt" {
  zone_id = data.aws_route53_zone.runmates.zone_id
  name    = "_dmarc.runmates.net"
  type    = "TXT"
  ttl     = 300

  records = ["v=DMARC1; p=none;"]
}

# ECSタスクからSES経由でメール送信するためのインラインポリシー
resource "aws_iam_role_policy" "ecs_ses_send_email" {
  name = "ECS-SES-SendEmail-Policy"
  role = aws_iam_role.ecs_task_execution.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Statement1"
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      }
    ]
  })
}
