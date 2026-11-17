import { definePlugin, PluginManifest } from '@uniforge/plugin-sdk';
import manifestJson from '../uniforge-plugin.json';

const manifest = manifestJson as unknown as PluginManifest;

export const springBootControllerPlugin = definePlugin({
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
        let parsed: unknown = res.body;
        try {
          parsed = JSON.parse(res.body);
        } catch {
          // keep text
        }
        return { ok: res.status >= 200 && res.status < 300, status: res.status, data: parsed };
      } catch (err) {
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

export default springBootControllerPlugin;

