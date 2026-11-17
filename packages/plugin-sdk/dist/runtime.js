"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniforgePluginHost = void 0;
exports.definePlugin = definePlugin;
const sandbox_1 = require("./sandbox");
const validator_1 = require("./validator");
/**
 * UNIFORGE Plugin Host & Lifecycle Runtime
 * Manages registration, validation, capability isolation, command routing, and health checks.
 */
class UniforgePluginHost {
    workspaceRoot;
    plugins = new Map();
    commands = new Map();
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    register(plugin) {
        const check = (0, validator_1.validateManifest)(plugin.manifest);
        if (!check.valid) {
            throw new Error(`Cannot register plugin "${plugin.manifest?.id ?? 'unknown'}": ${check.errors.join('; ')}`);
        }
        if (this.plugins.has(plugin.manifest.id)) {
            throw new Error(`Plugin "${plugin.manifest.id}" is already registered.`);
        }
        const context = new sandbox_1.ScopedStudioContext(plugin.manifest, this.workspaceRoot, this.commands);
        this.plugins.set(plugin.manifest.id, {
            plugin,
            context,
            active: false,
        });
    }
    async activate(pluginId) {
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
    async activateAll() {
        for (const id of this.plugins.keys()) {
            await this.activate(id);
        }
    }
    async deactivate(pluginId) {
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
    async invokeCommand(commandId, payload = {}) {
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
    listPlugins() {
        return Array.from(this.plugins.values()).map((r) => ({
            manifest: r.plugin.manifest,
            active: r.active,
            activatedAt: r.activatedAt,
        }));
    }
    listCommands() {
        return Array.from(this.commands.keys());
    }
    async healthCheckAll() {
        const results = [];
        for (const record of this.plugins.values()) {
            if (record.plugin.healthCheck) {
                results.push(await record.plugin.healthCheck(record.context));
            }
            else {
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
exports.UniforgePluginHost = UniforgePluginHost;
function definePlugin(plugin) {
    const result = (0, validator_1.validateManifest)(plugin.manifest);
    if (!result.valid) {
        throw new Error(`Invalid plugin definition: ${result.errors.join('; ')}`);
    }
    return plugin;
}
//# sourceMappingURL=runtime.js.map