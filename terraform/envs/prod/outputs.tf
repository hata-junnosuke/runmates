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
