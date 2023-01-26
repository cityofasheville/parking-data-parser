terraform {
  backend "s3" {
    bucket = "avl-tfstate-store"
    key    = "terraform/acumen/lambda_functions/parking-data-interface/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

resource "aws_lambda_function" "parking-data-interface" {
  filename         = "function.zip"
  function_name    = "parking-data-interface"
  role             = "arn:aws:iam::518970837364:role/parking-data-interface-role"
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("function.zip")
  timeout          = 900
  memory_size      = 256
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
}

resource "aws_lambda_function_url" "acumen_payroll_function_url" {
  function_name = aws_lambda_function.parking-data-interface.function_name
  authorization_type = "NONE"

}

output "parking-data-interface_arn" {
  value = aws_lambda_function.parking-data-interface.arn
}

output "parking-data-interface_url" {
  value = aws_lambda_function_url.acumen_payroll_function_url.function_url
}