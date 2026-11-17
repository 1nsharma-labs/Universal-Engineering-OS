"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.springBootControllerPlugin = void 0;
const plugin_sdk_1 = require("@uniforge/plugin-sdk");
const uniforge_plugin_json_1 = __importDefault(require("../uniforge-plugin.json"));
const manifest = uniforge_plugin_json_1.default;
exports.springBootControllerPlugin = (0, plugin_sdk_1.definePlugin)({
    manifest,
    activate(ctx) {
        ctx.log('Spring Boot Controller plugin activated.');
        ctx.registerCommand('actuatorHealth', async (payload) => {
            const baseUrl = String(payload.baseUrl || 'http://localhost:8080').replace(/\/$/, '');
            try {
                const res = await ctx.httpRequest({
                    url: `${baseUrl}/actuator/health`,
                    method: 'GET',
                    timeoutMs: 5000,
                });
                let parsed = res.body;
                try {
                    parsed = JSON.parse(res.body);
                }
                catch {
                    // keep text
                }
                return { ok: res.status >= 200 && res.status < 300, status: res.status, data: parsed };
            }
            catch (err) {
                return {
                    ok: false,
                    status: 0,
                    error: err instanceof Error ? err.message : String(err),
                    hint: 'Start Spring Boot via `make java` or `mvn spring-boot:run`.',
                };
            }
        });
        ctx.registerCommand('mavenBuild', async (payload) => {
            const goal = String(payload.goal || 'test-compile');
            const allowed = new Set(['compile', 'test-compile', 'test', 'package', 'clean']);
            if (!allowed.has(goal)) {
                return { ok: false, error: `Disallowed Maven goal: ${goal}` };
            }
            const res = await ctx.executeCommand('mvn', [
                '-f',
                '02-frameworks-and-templates/java-ecosystem/pom.xml',
                goal,
            ]);
            return {
                ok: res.exitCode === 0,
                goal,
                exitCode: res.exitCode,
                stdout: res.stdout,
                stderr: res.stderr,
            };
        });
    },
});
exports.default = exports.springBootControllerPlugin;
