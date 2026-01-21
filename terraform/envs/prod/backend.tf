terraform {
  backend "s3" {
    bucket  = "runmates-tfstate-bucket"
    key     = "prod/terraform.tfstate"
    region  = "ap-northeast-1"
    profile = "terraform"
  }
}
