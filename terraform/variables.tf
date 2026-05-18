variable "aws_region" {
  description = "AWS region for deployment"
  default     = "ap-south-1" # Mumbai region for TN e-Governance
}

variable "atlas_project_id" {
  description = "MongoDB Atlas Project ID"
  type        = string
}

variable "mongodbatlas_public_key" {
  description = "Public API key for MongoDB Atlas"
  type        = string
  sensitive   = true
}

variable "mongodbatlas_private_key" {
  description = "Private API key for MongoDB Atlas"
  type        = string
  sensitive   = true
}

variable "atlas_region" {
  description = "MongoDB Atlas region"
  default     = "AP_SOUTH_1"
}

variable "gemini_api_key" {
  description = "Google Gemini API Key for image analysis"
  type        = string
  sensitive   = true
}
