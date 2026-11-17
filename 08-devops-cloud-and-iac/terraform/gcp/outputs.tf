output "network_name" {
  value = google_compute_network.vpc_network.name
}

output "storage_bucket_url" {
  value = google_storage_bucket.model_cache.url
}
