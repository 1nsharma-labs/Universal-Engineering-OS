import { spawn } from 'child_process';
import {
  CommandExecutionResult,
  HttpFetchRequest,
  HttpFetchResponse,
  PluginCommandHandler,
  PluginManifest,
  PluginPermission,
  UniforgeStudioContext,
} from './types';

export class CapabilityDeniedError extends Error {
  public readonly pluginId: string;
  public readonly requiredPermission: PluginPermission;

  constructor(pluginId: string, requiredPermission: PluginPermission) {
    super(
      `[UNIFORGE Zero-Trust] Plugin "${pluginId}" attempted operation requiring undeclared permission "${requiredPermission}".`
    );
    this.name = 'CapabilityDeniedError';
    this.pluginId = pluginId;
    this.requiredPermission = requiredPermission;
  }
}

export interface LogEntry {
  timestamp: string;
  pluginId: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

/**
 * Capability-enforced execution context handed to each plugin during activation.
 */
export class ScopedStudioContext implements UniforgeStudioContext {
  public readonly pluginId: string;
  public readonly workspaceRoot: string;
  public readonly grantedPermissions: ReadonlySet<PluginPermission>;
  public activeLanguage?: string;
  public readonly logs: LogEntry[] = [];
  private readonly commandRegistry: Map<string, PluginCommandHandler>;

  constructor(
    manifest: PluginManifest,
    workspaceRoot: string,
    commandRegistry: Map<string, PluginCommandHandler>
  ) {
    this.pluginId = manifest.id;
    this.workspaceRoot = workspaceRoot;
    this.grantedPermissions = new Set<PluginPermission>(manifest.permissions);
    this.commandRegistry = commandRegistry;
  }

  private assertPermission(perm: PluginPermission): void {
    if (!this.grantedPermissions.has(perm)) {
      throw new CapabilityDeniedError(this.pluginId, perm);
    }
  }

  public log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    this.logs.push({
      timestamp: new Date().toISOString(),
      pluginId: this.pluginId,
      level,
      message,
    });
  }

  public registerCommand(commandId: string, handler: PluginCommandHandler): void {
    const qualifiedId = commandId.includes(':') ? commandId : `${this.pluginId}:${commandId}`;
    this.commandRegistry.set(qualifiedId, handler);
  }

  public async executeCommand(command: string, args: string[] = []): Promise<CommandExecutionResult> {
    if (command === 'docker' && this.grantedPermissions.has('docker:control')) {
      // Allowed via explicit docker:control capability
    } else {
      this.assertPermission('process:exec');
    }

    const start = Date.now();
    return new Promise<CommandExecutionResult>((resolve) => {
      const child = spawn(command, args, {
        cwd: this.workspaceRoot,
        shell: false,
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (chunk) => {
        stdout += chunk.toString();
      });
      child.stderr?.on('data', (chunk) => {
        stderr += chunk.toString();
      });
      child.on('error', (err) => {
        resolve({
          exitCode: 1,
          stdout,
          stderr: stderr || err.message,
          durationMs: Date.now() - start,
        });
      });
      child.on('close', (code) => {
        resolve({
          exitCode: code ?? 1,
          stdout,
          stderr,
          durationMs: Date.now() - start,
        });
      });
    });
  }

  public async httpRequest(request: HttpFetchRequest): Promise<HttpFetchResponse> {
    this.assertPermission('network:outbound');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), request.timeoutMs ?? 15000);
    try {
      const res = await fetch(request.url, {
        method: request.method ?? 'GET',
        headers: request.headers,
        body: request.body,
        signal: controller.signal,
      });
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headers[k] = v;
      });
      const body = await res.text();
      return {
        status: res.status,
        headers,
        body,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  public getSecret(key: string): string | undefined {
    this.assertPermission('secrets:read');
    return process.env[key];
  }
}

