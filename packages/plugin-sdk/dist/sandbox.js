"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopedStudioContext = exports.CapabilityDeniedError = void 0;
const child_process_1 = require("child_process");
class CapabilityDeniedError extends Error {
    pluginId;
    requiredPermission;
    constructor(pluginId, requiredPermission) {
        super(`[UNIFORGE Zero-Trust] Plugin "${pluginId}" attempted operation requiring undeclared permission "${requiredPermission}".`);
        this.name = 'CapabilityDeniedError';
        this.pluginId = pluginId;
        this.requiredPermission = requiredPermission;
    }
}
exports.CapabilityDeniedError = CapabilityDeniedError;
/**
 * Capability-enforced execution context handed to each plugin during activation.
 */
class ScopedStudioContext {
    pluginId;
    workspaceRoot;
    grantedPermissions;
    activeLanguage;
    logs = [];
    commandRegistry;
    constructor(manifest, workspaceRoot, commandRegistry) {
        this.pluginId = manifest.id;
        this.workspaceRoot = workspaceRoot;
        this.grantedPermissions = new Set(manifest.permissions);
        this.commandRegistry = commandRegistry;
    }
    assertPermission(perm) {
        if (!this.grantedPermissions.has(perm)) {
            throw new CapabilityDeniedError(this.pluginId, perm);
        }
    }
    log(message, level = 'info') {
        this.logs.push({
            timestamp: new Date().toISOString(),
            pluginId: this.pluginId,
            level,
            message,
        });
    }
    registerCommand(commandId, handler) {
        const qualifiedId = commandId.includes(':') ? commandId : `${this.pluginId}:${commandId}`;
        this.commandRegistry.set(qualifiedId, handler);
    }
    async executeCommand(command, args = []) {
        if (command === 'docker' && this.grantedPermissions.has('docker:control')) {
            // Allowed via explicit docker:control capability
        }
        else {
            this.assertPermission('process:exec');
        }
        const start = Date.now();
        return new Promise((resolve) => {
            const child = (0, child_process_1.spawn)(command, args, {
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
    async httpRequest(request) {
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
            const headers = {};
            res.headers.forEach((v, k) => {
                headers[k] = v;
            });
            const body = await res.text();
            return {
                status: res.status,
                headers,
                body,
            };
        }
        finally {
            clearTimeout(timeout);
        }
    }
    getSecret(key) {
        this.assertPermission('secrets:read');
        return process.env[key];
    }
}
exports.ScopedStudioContext = ScopedStudioContext;
//# sourceMappingURL=sandbox.js.map