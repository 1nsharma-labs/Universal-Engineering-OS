variable "cloudflare_api_token" {
  type      = string
  sensitive = true
  default   = "placeholder-token"
}

variable "zone_id" {
  type    = string
  default = "placeholder-zone-id"
}
