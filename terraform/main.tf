terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.10.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ==========================================
# 1. MongoDB Atlas Production Cluster
# ==========================================
provider "mongodbatlas" {
  public_key  = var.mongodbatlas_public_key
  private_key = var.mongodbatlas_private_key
}

resource "mongodbatlas_cluster" "tn_mbnr_cluster" {
  project_id   = var.atlas_project_id
  name         = "tn-mbnr-prod-cluster"
  cluster_type = "REPLICASET"
  
  provider_name               = "TENANT"
  backing_provider_name       = "AWS"
  provider_region_name        = var.atlas_region # AP_SOUTH_1 (Mumbai) enforces Data Localisation (IT Act)
  provider_instance_size_name = "M10" # Production Tier

  mongo_db_major_version = "6.0"
  auto_scaling_disk_gb_enabled = true

  # Section 9: Disaster Recovery (Backups & RPO targets)
  provider_backup_enabled = true
}

resource "mongodbatlas_cloud_backup_schedule" "dr_backup" {
  project_id   = var.atlas_project_id
  cluster_name = mongodbatlas_cluster.tn_mbnr_cluster.name
  
  reference_hour_of_day    = 2  # 2 AM IST
  reference_minute_of_hour = 0
  restore_window_days      = 7  # 7-day RPO rollback capability

  policy_item_daily {
    frequency_interval = 1
    retention_unit     = "days"
    retention_value    = 7
  }
}

# ==========================================
# 2. AWS Elastic Container Registry (ECR)
# ==========================================
resource "aws_ecr_repository" "tn_mbnr_repo" {
  name                 = "tn-mbnr-registry"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true # Hardened security check on push
  }
}

# ==========================================
# 3. AWS AppRunner for Node.js Application
# ==========================================
resource "aws_iam_role" "apprunner_role" {
  name = "tn-mbnr-apprunner-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = { Service = "build.apprunner.amazonaws.com" }
      }
    ]
  })
}

resource "aws_apprunner_service" "tn_mbnr_service" {
  service_name = "tn-mbnr-production"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_role.arn
    }
    image_repository {
      image_configuration {
        port = "3001"
        runtime_environment_variables = {
          NODE_ENV             = "production"
          MONGODB_URI          = mongodbatlas_cluster.tn_mbnr_cluster.connection_strings[0].standard_srv
          VITE_GEMINI_API_KEY  = var.gemini_api_key
        }
      }
      image_identifier      = "${aws_ecr_repository.tn_mbnr_repo.repository_url}:latest"
      image_repository_type = "ECR"
    }
    auto_deployments_enabled = true
  }

  instance_configuration {
    cpu    = "1024" # 1 vCPU
    memory = "2048" # 2 GB RAM
  }
}

# ==========================================
# 4. S3 Bucket for Static Assets / Uploads
# ==========================================
resource "aws_s3_bucket" "tn_mbnr_assets" {
  bucket = "tn-mbnr-production-assets"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets_encryption" {
  bucket = aws_s3_bucket.tn_mbnr_assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

output "app_url" {
  value = aws_apprunner_service.tn_mbnr_service.service_url
}
