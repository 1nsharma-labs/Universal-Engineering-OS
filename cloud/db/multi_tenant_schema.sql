-- ==============================================================================
-- UNIFORGE Cloud Multi-Tenant PostgreSQL Schema with Row-Level Security (RLS)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    organization_name VARCHAR(128) NOT NULL,
    plan_tier VARCHAR(32) NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'team', 'enterprise')),
    sso_provider VARCHAR(32) DEFAULT NULL,
    max_workspaces INT NOT NULL DEFAULT 3,
    max_cpu_millicores INT NOT NULL DEFAULT 2000,
    max_memory_mb INT NOT NULL DEFAULT 4096,
    stripe_customer_id VARCHAR(128),
    status VARCHAR(24) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(96) NOT NULL,
    subdomain VARCHAR(128) UNIQUE NOT NULL,
    stack_profile VARCHAR(64) NOT NULL DEFAULT 'polyglot-core',
    region VARCHAR(32) NOT NULL DEFAULT 'us-central1',
    status VARCHAR(24) NOT NULL DEFAULT 'running',
    cpu_millicores INT NOT NULL DEFAULT 1000,
    memory_mb INT NOT NULL DEFAULT 2048,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    plugin_id VARCHAR(128) NOT NULL,
    license_key_hash VARCHAR(128) NOT NULL,
    tier VARCHAR(32) NOT NULL,
    monthly_price_cents INT NOT NULL DEFAULT 0,
    developer_share_cents INT NOT NULL DEFAULT 0,
    platform_share_cents INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor VARCHAR(128) NOT NULL,
    action VARCHAR(96) NOT NULL,
    resource VARCHAR(128) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enforce Row-Level Security (RLS) for strict tenant isolation
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_workspaces ON workspaces
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_licenses ON marketplace_licenses
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY tenant_isolation_audit_logs ON audit_logs
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

