import { ScopedStudioContext } from './sandbox';
import {
  PluginCommandHandler,
  PluginHealthStatus,
  PluginManifest,
  UniforgePlugin,
} from './types';
import { validateManifest } from './validator';

export interface RegisteredPluginRecord {
  plugin: UniforgePlugin;
  context: ScopedStudioContext;
  active: boolean;
  activatedAt?: string;
}

/**
 * UNIFORGE Plugin Host & Lifecycle Runtime
 * Manages registration, validation, capability isolation, command routing, and health checks.
 */
export class UniforgePluginHost {
  private readonly workspaceRoot: string;
  private readonly plugins = new Map<string, RegisteredPluginRecord>();
  private readonly commands = new Map<string, PluginCommandHandler>();

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  public register(plugin: UniforgePlugin): void {
    const check = validateManifest(plugin.manifest);
    if (!check.valid) {
      throw new Error(
        `Cannot register plugin "${plugin.manifest?.id ?? 'unknown'}": ${check.errors.join('; ')}`
      );
    }

    if (this.plugins.has(plugin.manifest.id)) {
      throw new Error(`Plugin "${plugin.manifest.id}" is already registered.`);
    }

    const context = new ScopedStudioContext(plugin.manifest, this.workspaceRoot, this.commands);
    this.plugins.set(plugin.manifest.id, {
      plugin,
      context,
      active: false,
    });
  }

  public async activate(pluginId: string): Promise<void> {
    const record = this.plugins.get(pluginId);
    if (!record) {
      throw new Error(`Plugin "${pluginId}" is not registered.`);
    }
    if (record.active) {
      return;
    }
    await record.plugin.activate(record.context);
    record.active = true;
    record.activatedAt = new Date().toISOString();
    record.context.log(`Activated plugin ${pluginId}@${record.plugin.manifest.version}`);
  }

  public async activateAll(): Promise<void> {
    for (const id of this.plugins.keys()) {
      await this.activate(id);
    }
  }

  public async deactivate(pluginId: string): Promise<void> {
    const record = this.plugins.get(pluginId);
    if (!record || !record.active) {
      return;
    }
    if (record.plugin.deactivate) {
      await record.plugin.deactivate();
    }
    record.active = false;
    record.context.log(`Deactivated plugin ${pluginId}`);
  }

  public async invokeCommand(
    commandId: string,
    payload: Record<string, unknown> = {}
  ): Promise<unknown> {
    const handler = this.commands.get(commandId);
    if (!handler) {
      throw new Error(`Unknown plugin command "${commandId}". Registered: ${Array.from(this.commands.keys()).join(', ')}`);
    }

    const ownerPrefix = commandId.split(':')[0];
    const owner = this.plugins.get(ownerPrefix);
    const ctx = owner?.context;
    if (!ctx) {
      throw new Error(`No active context found for command "${commandId}".`);
    }
    return handler(payload, ctx);
  }

  public listPlugins(): Array<{ manifest: PluginManifest; active: boolean; activatedAt?: string }> {
    return Array.from(this.plugins.values()).map((r) => ({
      manifest: r.plugin.manifest,
      active: r.active,
      activatedAt: r.activatedAt,
    }));
  }

  public listCommands(): string[] {
    return Array.from(this.commands.keys());
  }

  public async healthCheckAll(): Promise<PluginHealthStatus[]> {
    const results: PluginHealthStatus[] = [];
    for (const record of this.plugins.values()) {
      if (record.plugin.healthCheck) {
        results.push(await record.plugin.healthCheck(record.context));
      } else {
        results.push({
          pluginId: record.plugin.manifest.id,
          healthy: record.active,
          status: record.active ? 'active' : 'inactive',
          details: { version: record.plugin.manifest.version },
          checkedAt: new Date().toISOString(),
        });
      }
    }
    return results;
  }
}

export function definePlugin(plugin: UniforgePlugin): UniforgePlugin {
  const result = validateManifest(plugin.manifest);
  if (!result.valid) {
    throw new Error(`Invalid plugin definition: ${result.errors.join('; ')}`);
  }
  return plugin;
}

