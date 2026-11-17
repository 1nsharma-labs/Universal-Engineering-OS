import { ScopedStudioContext } from './sandbox';
import { PluginHealthStatus, PluginManifest, UniforgePlugin } from './types';
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
export declare class UniforgePluginHost {
    private readonly workspaceRoot;
    private readonly plugins;
    private readonly commands;
    constructor(workspaceRoot: string);
    register(plugin: UniforgePlugin): void;
    activate(pluginId: string): Promise<void>;
    activateAll(): Promise<void>;
    deactivate(pluginId: string): Promise<void>;
    invokeCommand(commandId: string, payload?: Record<string, unknown>): Promise<unknown>;
    listPlugins(): Array<{
        manifest: PluginManifest;
        active: boolean;
        activatedAt?: string;
    }>;
    listCommands(): string[];
    healthCheckAll(): Promise<PluginHealthStatus[]>;
}
export declare function definePlugin(plugin: UniforgePlugin): UniforgePlugin;
