output "aws_region" {
  description = "AWS region used by the provider."
  value       = var.aws_region
}

output "aws_profile" {
  description = "AWS shared config profile name."
  value       = var.aws_profile
}

output "ecs_cluster_name" {
  description = "ECS cluster name."
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name."
  value       = aws_ecs_service.backend.name
}

# ECSタスク定義のDATABASE_URL等で接続先を参照する際に使用
output "rds_endpoint" {
  description = "RDS endpoint address."
  value       = aws_db_instance.main.endpoint
}
