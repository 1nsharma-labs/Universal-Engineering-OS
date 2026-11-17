import { CommandExecutionResult, HttpFetchRequest, HttpFetchResponse, PluginCommandHandler, PluginManifest, PluginPermission, UniforgeStudioContext } from './types';
export declare class CapabilityDeniedError extends Error {
    readonly pluginId: string;
    readonly requiredPermission: PluginPermission;
    constructor(pluginId: string, requiredPermission: PluginPermission);
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
export declare class ScopedStudioContext implements UniforgeStudioContext {
    readonly pluginId: string;
    readonly workspaceRoot: string;
    readonly grantedPermissions: ReadonlySet<PluginPermission>;
    activeLanguage?: string;
    readonly logs: LogEntry[];
    private readonly commandRegistry;
    constructor(manifest: PluginManifest, workspaceRoot: string, commandRegistry: Map<string, PluginCommandHandler>);
    private assertPermission;
    log(message: string, level?: 'info' | 'warn' | 'error'): void;
    registerCommand(commandId: string, handler: PluginCommandHandler): void;
    executeCommand(command: string, args?: string[]): Promise<CommandExecutionResult>;
    httpRequest(request: HttpFetchRequest): Promise<HttpFetchResponse>;
    getSecret(key: string): string | undefined;
}
