# VPCの作成
resource "aws_vpc" "runmates" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = false
  enable_dns_support   = true

  tags = {
    Name = "runmates-vpc"
  }
}

resource "aws_internet_gateway" "runmates" {
  vpc_id = aws_vpc.runmates.id

  tags = {
    Name = "runmates-internet-gateway"
  }
}

resource "aws_subnet" "public_1a" {
  vpc_id                  = aws_vpc.runmates.id
  cidr_block              = "10.0.0.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = false

  tags = {
    Name = "runmates-public-subnet1"
  }
}

resource "aws_subnet" "public_1c" {
  vpc_id                  = aws_vpc.runmates.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = false

  tags = {
    Name = "runmates-public-subnet2"
  }
}

resource "aws_subnet" "private_1a" {
  vpc_id                  = aws_vpc.runmates.id
  cidr_block              = "10.0.10.0/24"
  availability_zone       = "ap-northeast-1a"
  map_public_ip_on_launch = false

  tags = {
    Name = "runmates-private-subnet1"
  }
}

resource "aws_subnet" "private_1c" {
  vpc_id                  = aws_vpc.runmates.id
  cidr_block              = "10.0.11.0/24"
  availability_zone       = "ap-northeast-1c"
  map_public_ip_on_launch = false

  tags = {
    Name = "runmates-private-subnet2"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.runmates.id

  tags = {
    Name = "runmates-route-table"
  }
}

resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.runmates.id
}

resource "aws_route_table_association" "public_1a" {
  subnet_id      = aws_subnet.public_1a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_1c" {
  subnet_id      = aws_subnet.public_1c.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.runmates.id
}


resource "aws_security_group" "alb" {
  name        = "runmates-alb-backend-security-group"
  description = "runmates-alb-backend-security-group"
  vpc_id      = aws_vpc.runmates.id
}

resource "aws_security_group" "ecs" {
  name        = "runmates-ecs-backend-security-group"
  description = "backend-sg"
  vpc_id      = aws_vpc.runmates.id
}

resource "aws_security_group_rule" "alb_from_ecs_tcp0" {
  type                     = "ingress"
  from_port                = 0
  to_port                  = 0
  protocol                 = "tcp"
  security_group_id        = aws_security_group.alb.id
  source_security_group_id = aws_security_group.ecs.id
}

resource "aws_security_group_rule" "alb_to_ecs_tcp80" {
  type                     = "egress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  security_group_id        = aws_security_group.alb.id
  source_security_group_id = aws_security_group.ecs.id
}

resource "aws_security_group_rule" "ecs_from_alb_tcp0" {
  type                     = "ingress"
  from_port                = 0
  to_port                  = 0
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ecs.id
  source_security_group_id = aws_security_group.alb.id
}

resource "aws_security_group_rule" "alb_ingress_http_ipv4" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  security_group_id = aws_security_group.alb.id
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "alb_ingress_http_ipv6" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  security_group_id = aws_security_group.alb.id
  ipv6_cidr_blocks  = ["::/0"]
}

resource "aws_security_group_rule" "alb_ingress_https_ipv4" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.alb.id
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "alb_ingress_https_ipv6" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.alb.id
  ipv6_cidr_blocks  = ["::/0"]
}

resource "aws_security_group_rule" "ecs_ingress_http_ipv4" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  security_group_id = aws_security_group.ecs.id
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ecs_ingress_http_ipv6" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  security_group_id = aws_security_group.ecs.id
  ipv6_cidr_blocks  = ["::/0"]
}

resource "aws_security_group_rule" "ecs_ingress_https_ipv4" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.ecs.id
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "ecs_ingress_https_ipv6" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  security_group_id = aws_security_group.ecs.id
  ipv6_cidr_blocks  = ["::/0"]
}

resource "aws_security_group_rule" "ecs_egress_all_ipv4" {
  # -1 は「全て」を表す（プロトコル・ポートともに全許可）。
  type              = "egress"
  from_port         = -1
  to_port           = -1
  protocol          = "-1"
  security_group_id = aws_security_group.ecs.id
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "rds_ingress_mysql_from_ecs" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds.id
  source_security_group_id = aws_security_group.ecs.id
}

resource "aws_security_group_rule" "rds_egress_all_ipv4" {
  # -1 は「全て」を表す（プロトコル・ポートともに全許可）。
  type              = "egress"
  from_port         = -1
  to_port           = -1
  protocol          = "-1"
  security_group_id = aws_security_group.rds.id
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group" "rds" {
  name        = "runmates-rds-security-group"
  description = "rds-sg"
  vpc_id      = aws_vpc.runmates.id
}
