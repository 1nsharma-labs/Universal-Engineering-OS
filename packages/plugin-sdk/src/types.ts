/**
 * UNIFORGE Plugin SDK v1.0.0 — Core Type Contracts
 * Defines manifest structures, zero-trust capability permissions, studio views,
 * commands, MCP tool bridges, and marketplace monetization metadata.
 */

export const VALID_PLUGIN_PERMISSIONS = [
  'network:outbound',
  'network:inbound',
  'process:exec',
  'storage:read',
  'storage:write',
  'secrets:read',
  'docker:control',
  'database:query',
  'ai:inference',
] as const;

export type PluginPermission = (typeof VALID_PLUGIN_PERMISSIONS)[number];

export type PricingTier = 'free' | 'freemium' | 'paid_monthly' | 'enterprise';

export interface MarketplacePricing {
  tier: PricingTier;
  priceUsdMonthly?: number;
  revenueShare?: {
    developerPercent: number;
    platformPercent: number;
  };
  requiresLicenseKey?: boolean;
}

export interface PluginCommandSpec {
  id: string;
  title: string;
  description: string;
  parametersSchema?: Record<string, unknown>;
}

export interface StudioViewSpec {
  id: string;
  title: string;
  icon?: string;
  slot: 'sidebar' | 'main-tab' | 'bottom-panel' | 'modal';
}

export interface PluginManifest {
  schemaVersion: '1.0.0';
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'infrastructure' | 'database' | 'creative' | 'backend' | 'ai' | 'security' | 'devops';
  author: {
    name: string;
    url?: string;
    email?: string;
  };
  license: string;
  permissions: PluginPermission[];
  engines: {
    uniforge: string;
  };
  entrypoints?: {
    ui?: string;
    backend?: string;
    mcp?: string;
  };
  commands?: PluginCommandSpec[];
  views?: StudioViewSpec[];
  pricing?: MarketplacePricing;
  tags?: string[];
}

export interface CommandExecutionResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs?: number;
}

export interface HttpFetchRequest {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
}

export interface HttpFetchResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface PluginHealthStatus {
  pluginId: string;
  healthy: boolean;
  status: 'active' | 'degraded' | 'inactive' | 'error';
  details: Record<string, unknown>;
  checkedAt: string;
}

export type PluginCommandHandler = (
  payload: Record<string, unknown>,
  context: UniforgeStudioContext
) => Promise<unknown> | unknown;

export interface UniforgeStudioContext {
  readonly pluginId: string;
  readonly workspaceRoot: string;
  readonly grantedPermissions: ReadonlySet<PluginPermission>;
  activeLanguage?: string;
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
  registerCommand: (commandId: string, handler: PluginCommandHandler) => void;
  executeCommand: (command: string, args?: string[]) => Promise<CommandExecutionResult>;
  httpRequest: (request: HttpFetchRequest) => Promise<HttpFetchResponse>;
  getSecret: (key: string) => string | undefined;
}

export interface UniforgePlugin {
  manifest: PluginManifest;
  activate(context: UniforgeStudioContext): Promise<void> | void;
  deactivate?(): Promise<void> | void;
  healthCheck?(context: UniforgeStudioContext): Promise<PluginHealthStatus> | PluginHealthStatus;
}

