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
    name                   = "dualstack.${aws_lb.backend.dns_name}"
    zone_id                = aws_lb.backend.zone_id
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
  // resource_record_name が同じ検証CNAMEをまとめる（wildcardとapexが同一になることがある）
  acm_validation_records_grouped = {
    for option in aws_acm_certificate.runmates.domain_validation_options :
    option.resource_record_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }...
  }

  acm_validation_records = {
    for name, records in local.acm_validation_records_grouped :
    name => records[0]
  }
}

// ACMの検証CNAMEは再発行時に変わるため、domain_validation_options から動的生成する。
// for_each は plan 時に確定する resource_record_name をキーにし、重複は1件にまとめる。
resource "aws_route53_record" "acm_validation" {
  for_each = local.acm_validation_records

  zone_id = data.aws_route53_zone.runmates.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 300
  records = [each.value.record]
}

resource "aws_acm_certificate_validation" "runmates" {
  certificate_arn         = aws_acm_certificate.runmates.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_validation : record.fqdn]
}
