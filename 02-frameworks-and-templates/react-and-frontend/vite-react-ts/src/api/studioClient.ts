/**
 * UNIFORGE React Console -> Studio API (:7000) Typed Client
 * Connects Console State directly to Control Plane, Identity/RBAC,
 * Universal Event Bus, Shared SQLite Data Layer, Secrets Vault,
 * Observability, 5-Layer Software Factory, RAG Brain, Execution & Marketplace.
 */

const API_BASE = import.meta.env.VITE_STUDIO_API_URL || '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export interface SystemStatus {
  platform: string;
  organization: string;
  version: string;
  mode: string;
  modules_count: number;
  domains_count: number;
  registered_technologies: number;
  wiki_profiles_count: number;
  official_plugins_count: number;
  cloud_tenants_count: number;
  services: Record<string, string>;
  status: string;
}

export interface OsProject {
  id: string;
  name: string;
  stack: string;
  repo_url: string;
  status: string;
  owner_role: string;
  created_at: number;
}

export interface OsEvent {
  id: string;
  topic: string;
  source: string;
  actor: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

export interface ObservabilityMetrics {
  status: string;
  uptime_seconds: number;
  requests_total: number;
  error_count: number;
  error_rate_percent: number;
  avg_latency_ms: number;
  p95_latency_ms: number;
  estimated_local_ai_cost_usd: number;
  cost_savings_note: string;
  shared_db_path: string;
  top_endpoints: Array<{ path: string; hits: number }>;
  subsystems: Array<{ id: string; name: string; status: string }>;
}

export interface RolePolicy {
  role: string;
  label: string;
  type: 'human' | 'ai-agent';
  permissions: string[];
  description: string;
}

export interface SecretItem {
  key: string;
  masked_preview: string;
  scope: string;
  updated_by: string;
  updated_at: number;
}

export const studioApi = {
  getStatus: () => request<SystemStatus>('/api/v1/status'),
  getObservability: () => request<ObservabilityMetrics>('/api/v1/observability/metrics'),

  // Shared Data Layer: Projects
  listProjects: () => request<{ count: number; projects: OsProject[] }>('/api/v1/projects'),
  createProject: (payload: { name: string; stack: string; repo_url?: string; owner_role: string }) =>
    request<{ ok: boolean; project?: OsProject; error?: string }>('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Universal Event Bus
  listEvents: (limit = 30) => request<{ count: number; events: OsEvent[] }>(`/api/v1/events?limit=${limit}`),
  publishEvent: (payload: { topic: string; source: string; actor: string; payload: Record<string, unknown> }) =>
    request<OsEvent>('/api/v1/events/publish', { method: 'POST', body: JSON.stringify(payload) }),

  // Identity & RBAC Engine
  getIdentityPolicies: () => request<{ engine: string; roles: RolePolicy[] }>('/api/v1/identity/policies'),
  checkPermission: (role: string, action: string) =>
    request<{ allowed: boolean; role: string; actor_type?: string; action: string; reason: string }>(
      '/api/v1/identity/check',
      { method: 'POST', body: JSON.stringify({ role, action }) }
    ),

  // Secrets Vault
  listSecrets: () => request<{ count: number; secrets: SecretItem[] }>('/api/v1/secrets'),
  setSecret: (payload: { key: string; value: string; scope: string; actor: string }) =>
    request<{ ok: boolean; key?: string; masked_preview?: string; error?: string }>('/api/v1/secrets', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteSecret: (key: string, actor: string) =>
    request<{ ok: boolean; key: string }>(`/api/v1/secrets/${encodeURIComponent(key)}?actor=${encodeURIComponent(actor)}`, {
      method: 'DELETE',
    }),

  // 5-Layer Software Factory
  assembleFactory: (prompt: string, target_cloud: string) =>
    request<Record<string, any>>('/api/v1/factory/assemble', {
      method: 'POST',
      body: JSON.stringify({ prompt, target_cloud, write_artifacts: false }),
    }),
  approveFactory: (job_id: string, approver: string) =>
    request<Record<string, any>>('/api/v1/factory/approve', {
      method: 'POST',
      body: JSON.stringify({ job_id, approver }),
    }),

  // AI Brain, Autonomous Team & Local RAG
  architect: (prompt: string) =>
    request<Record<string, any>>('/api/v1/orchestrate/architect', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),
  autonomousBuild: (prompt: string, stack: string) =>
    request<Record<string, any>>('/api/v1/agents/autonomous-build', {
      method: 'POST',
      body: JSON.stringify({ prompt, stack, write_to_disk: false }),
    }),
  queryRag: (query: string, top_k = 5) =>
    request<Record<string, any>>('/api/v1/rag/query', {
      method: 'POST',
      body: JSON.stringify({ query, top_k }),
    }),

  // Execution: PTY Terminal, LSP, API Studio
  execTerminal: (command: string, session_id = '') =>
    request<Record<string, any>>('/api/v1/terminal/exec', {
      method: 'POST',
      body: JSON.stringify({ command, session_id }),
    }),
  lspDiagnostics: (language: string, code: string) =>
    request<Record<string, any>>('/api/v1/lsp/diagnostics', {
      method: 'POST',
      body: JSON.stringify({ language, code }),
    }),
  executeApi: (payload: { url: string; method: string; headers?: Record<string, string>; body?: string | null }) =>
    request<Record<string, any>>('/api/v1/api-studio/execute', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Registry, Plugins, Marketplace & Deploy
  getRegistry: (q = '', domain = '') =>
    request<Record<string, any>>(`/api/v1/registry?q=${encodeURIComponent(q)}&domain=${encodeURIComponent(domain)}`),
  getPlugins: () => request<Record<string, any>>('/api/v1/plugins'),
  execPlugin: (plugin_id: string, command_id: string) =>
    request<Record<string, any>>('/api/v1/plugins/execute', {
      method: 'POST',
      body: JSON.stringify({ plugin_id, command_id, payload: {} }),
    }),
  getMarketplace: () => request<Record<string, any>>('/api/v1/marketplace/catalog'),
  deployPlan: (provider: string, service_name: string, region: string) =>
    request<Record<string, any>>('/api/v1/deploy/plan', {
      method: 'POST',
      body: JSON.stringify({ provider, service_name, region }),
    }),
};

