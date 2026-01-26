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

resource "aws_route53_record" "acm_validation_cname" {
  zone_id = data.aws_route53_zone.runmates.zone_id
  name    = "_2c8b097020a71fca9d7456f184ba651f.runmates.net"
  type    = "CNAME"
  ttl     = 300

  records = ["_d1041f7481df3899e0b361c7055d14fa.mhbtsbpdnt.acm-validations.aws."]
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
