variable "aws_region" {
  type        = string
  description = "AWS region for the provider."
  default     = "ap-northeast-1"
}

variable "aws_profile" {
  type        = string
  description = "AWS shared config profile name."
  default     = "terraform"
}

variable "rails_image" {
  type        = string
  description = "Rails ECRイメージURI"
  default     = "905418297788.dkr.ecr.ap-northeast-1.amazonaws.com/runmates-rails:latest"
}

variable "nginx_image" {
  type        = string
  description = "Nginx ECRイメージURI"
  default     = "905418297788.dkr.ecr.ap-northeast-1.amazonaws.com/runmates-nginx:latest"
}
