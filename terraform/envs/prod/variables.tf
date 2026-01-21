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
