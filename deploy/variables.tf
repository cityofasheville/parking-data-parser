variable "region" {
  type          = string
  description   = "Region in which to create resources"
}

# Name of Lambda
variable "production_name" {
  type          = string
  description   = "Name of Program"
}
variable "development_name" {
  type          = string
  description   = "Name of Program"
}