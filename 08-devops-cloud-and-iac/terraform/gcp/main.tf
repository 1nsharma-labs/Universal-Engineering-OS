terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.20"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

resource "google_compute_network" "vpc_network" {
  name                    = "universal-dev-network"
  auto_create_subnetworks = true
}

resource "google_storage_bucket" "model_cache" {
  name          = "${var.gcp_project_id}-model-cache"
  location      = var.gcp_region
  force_destroy = true
}
