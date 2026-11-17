output "vpc_id" {
  value = aws_vpc.main.id
}

output "artifact_bucket_arn" {
  value = aws_s3_bucket.artifacts.arn
}
