terraform {
  backend "s3" {
    bucket = "avl-tfstate-store"
    key    = "terraform/wheres_parking/lambda_functions/parking-data-parser/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

resource "aws_lambda_function" "parking-data-parser" {
  filename         = "function.zip"
  description      = "Where's Parking data loaded from vendor Parking Logix" 
  function_name    = "parking-data-parser"
  role             = "arn:aws:iam::518970837364:role/parking-data-parser-role"
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("function.zip")
  timeout          = 900
  memory_size      = 256

}

output "parking-data-parser_arn" {
  value = aws_lambda_function.parking-data-parser.arn
}
