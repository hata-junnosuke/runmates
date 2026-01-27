data "aws_route53_zone" "runmates" {
  name         = "runmates.net."
  private_zone = false
}

resource "aws_route53_record" "runmates_apex_a" {
  zone_id = data.aws_route53_zone.runmates.zone_id
  name    = "runmates.net"
  type    = "A"
  ttl     = 300

  records = ["76.76.21.21"]
}

resource "aws_route53_record" "backend_alias_a" {
  zone_id = data.aws_route53_zone.runmates.zone_id
  name    = "backend.runmates.net"
  type    = "A"

  alias {
    name                   = "dualstack.runmates-alb-backend-653256300.ap-northeast-1.elb.amazonaws.com."
    zone_id                = "Z14GRHDCWA56QT"
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "dmarc_txt" {
  zone_id = data.aws_route53_zone.runmates.zone_id
  name    = "_dmarc.runmates.net"
  type    = "TXT"
  ttl     = 300

  records = ["v=DMARC1; p=none;"]
}

resource "aws_route53_record" "ses_dkim_1" {
  zone_id = data.aws_route53_zone.runmates.zone_id
  name    = "clhu3amxs6v6at6avp7sm2ygja6ifr4i._domainkey.runmates.net"
  type    = "CNAME"
  ttl     = 1800

  records = ["clhu3amxs6v6at6avp7sm2ygja6ifr4i.dkim.amazonses.com"]
}

resource "aws_route53_record" "ses_dkim_2" {
  zone_id = data.aws_route53_zone.runmates.zone_id
  name    = "csl3csfhgybfq4o3enw6oeins3lmvdp6._domainkey.runmates.net"
  type    = "CNAME"
  ttl     = 1800

  records = ["csl3csfhgybfq4o3enw6oeins3lmvdp6.dkim.amazonses.com"]
}

resource "aws_route53_record" "ses_dkim_3" {
  zone_id = data.aws_route53_zone.runmates.zone_id
  name    = "d6p6xajgsnkpap7qiy4iuwlwwg3bzkdu._domainkey.runmates.net"
  type    = "CNAME"
  ttl     = 1800

  records = ["d6p6xajgsnkpap7qiy4iuwlwwg3bzkdu.dkim.amazonses.com"]
}

resource "aws_acm_certificate" "runmates" {
  domain_name               = "runmates.net"
  subject_alternative_names = ["*.runmates.net"]
  validation_method         = "DNS"
}

// locals は「このファイル内だけで使う定数/変数」をまとめる領域。
// for を使う理由: SANの数に応じて検証レコードが増減するため、
// 手書きではなく自動で配列/マップを作って差分や漏れを防ぐ。
// 固定のCNAMEにしてしまうと、証明書の再作成やSAN変更で検証に失敗する。
locals {
  acm_domain_names = toset(concat(
    [aws_acm_certificate.runmates.domain_name],
    tolist(aws_acm_certificate.runmates.subject_alternative_names)
  ))

  // wildcard は apex と同一の検証CNAMEになることが多いため重複を避ける
  acm_validation_domains = toset([
    for name in local.acm_domain_names :
    name if name != "*.${aws_acm_certificate.runmates.domain_name}"
  ])
}

// ACMの検証CNAMEは再発行時に変わるため、domain_validation_options から動的生成する。
// for_each は plan 時に確定する domain_name をキーにする（record_name は作成後に確定）。
// wildcardとapexで同名CNAMEになる場合があるため、上書きを許容する。
resource "aws_route53_record" "acm_validation" {
  for_each = local.acm_validation_domains

  zone_id = data.aws_route53_zone.runmates.zone_id
  // 各ドメインに対応する検証レコード名
  name = one([
    for option in aws_acm_certificate.runmates.domain_validation_options :
    option.resource_record_name
    if option.domain_name == each.key
  ])
  // 各ドメインに対応する検証レコード種別
  type = one([
    for option in aws_acm_certificate.runmates.domain_validation_options :
    option.resource_record_type
    if option.domain_name == each.key
  ])
  ttl     = 300
  // レコード値（通常は1つ）。重複があれば distinct で1件にまとめる。
  records = distinct([for option in aws_acm_certificate.runmates.domain_validation_options : option.resource_record_value if option.domain_name == each.key])

  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "runmates" {
  certificate_arn         = aws_acm_certificate.runmates.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_validation : record.fqdn]
}
