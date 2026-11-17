# UNIFORGE Cloud — Multi-Tenant Managed Platform

UNIFORGE Cloud deploys the Universal Engineering OS as a horizontally scalable, strictly isolated multi-tenant platform.

## Architecture Highlights
- **Edge Routing**: Traefik v3 (`cloud/traefik/dynamic.yml`) with TLS 1.3, security headers, per-tenant rate limits, and wildcard workspace subdomains (`*.workspaces.uniforge.io`).
- **Database Isolation**: PostgreSQL 16 + pgvector with **Row-Level Security (RLS)** policies (`cloud/db/multi_tenant_schema.sql`) guaranteeing zero cross-tenant data leakage.
- **Kubernetes Security**: Rootless pods (`UID 65534`), `readOnlyRootFilesystem: true`, `NetworkPolicy` isolation, and per-tenant `ResourceQuota` ceilings (`cloud/helm/uniforge-cloud/`).

## Quick Launch (Docker Compose)
```bash
docker compose -f cloud/docker-compose.cloud.yml up -d
```

## Quick Launch (Kubernetes Helm)
```bash
helm upgrade --install uniforge-cloud cloud/helm/uniforge-cloud --namespace uniforge-cloud --create-namespace
```

