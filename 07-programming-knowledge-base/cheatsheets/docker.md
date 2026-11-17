# Docker & Compose Cheatsheet

## Multi-Stage Minimal Alpine Build
```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o server .

FROM scratch
COPY --from=builder /app/server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
```

## Essential Diagnostic Commands
```bash
docker system df
docker stats --no-stream
docker compose -f docker-compose.infra.yml logs -f --tail=100
```
