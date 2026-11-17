terraform {
  required_version = ">= 1.5.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.26"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_record" "api" {
  zone_id = var.zone_id
  name    = "api"
  value   = "192.0.2.1"
  type    = "A"
  proxied = true
}
