-- PostgreSQL + pgvector Schema for Universal Technology Registry
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS tech_domains (
    id VARCHAR(64) PRIMARY KEY,
    domain_number VARCHAR(8) NOT NULL,
    name VARCHAR(128) NOT NULL,
    summary TEXT
);

CREATE TABLE IF NOT EXISTS technology_registry (
    id VARCHAR(128) PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    tech_type VARCHAR(128) NOT NULL,
    domain_id VARCHAR(64) REFERENCES tech_domains(id),
    language VARCHAR(128) NOT NULL,
    dependencies JSONB DEFAULT '[]'::jsonb,
    documentation_url TEXT,
    version VARCHAR(64),
    license VARCHAR(128),
    runtime VARCHAR(128),
    security_status VARCHAR(64) DEFAULT 'verified',
    alternatives JSONB DEFAULT '[]'::jsonb,
    integrations JSONB DEFAULT '[]'::jsonb,
    package_source VARCHAR(128),
    hub_module TEXT,
    embedding vector(768),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tech_registry_domain ON technology_registry(domain_id);
CREATE INDEX IF NOT EXISTS idx_tech_registry_name_trgm ON technology_registry USING gin (name gin_trgm_ops);
