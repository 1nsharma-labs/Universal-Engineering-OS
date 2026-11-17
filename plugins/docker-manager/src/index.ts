import { definePlugin, PluginManifest } from '@uniforge/plugin-sdk';
import manifestJson from '../uniforge-plugin.json';

const manifest = manifestJson as unknown as PluginManifest;

export const dockerManagerPlugin = definePlugin({
  manifest,

  activate(ctx) {
    ctx.log('Docker Manager plugin activated.');

    ctx.registerCommand('listContainers', async (payload) => {
      const showAll = payload.all === true;
      const args = ['ps', '--format', '{{json .}}'];
      if (showAll) args.splice(1, 0, '-a');
      const res = await ctx.executeCommand('docker', args);
      if (res.exitCode !== 0) {
        return { ok: false, error: res.stderr.trim() || 'Docker daemon unavailable', containers: [] };
      }
      const containers = res.stdout
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return { raw: line };
          }
        });
      return { ok: true, count: containers.length, containers };
    });

    ctx.registerCommand('composeAction', async (payload) => {
      const stackFile = String(payload.stackFile || '04-connectors-and-apis/docker-compose.infra.yml');
      const action = String(payload.action || 'ps');
      const allowed = new Set(['ps', 'up', 'down', 'config']);
      if (!allowed.has(action)) {
        return { ok: false, error: `Unsupported compose action: ${action}` };
      }
      const args = ['compose', '-f', stackFile, action];
      if (action === 'up') args.push('-d');
      const res = await ctx.executeCommand('docker', args);
      return {
        ok: res.exitCode === 0,
        exitCode: res.exitCode,
        stdout: res.stdout,
        stderr: res.stderr,
      };
    });

    ctx.registerCommand('systemInfo', async () => {
      const res = await ctx.executeCommand('docker', ['version', '--format', '{{json .}}']);
      return {
        ok: res.exitCode === 0,
        version: res.exitCode === 0 ? res.stdout.trim() : null,
        stderr: res.stderr.trim(),
      };
    });
  },

  async healthCheck(ctx) {
    const res = await ctx.executeCommand('docker', ['--version']);
    return {
      pluginId: manifest.id,
      healthy: res.exitCode === 0,
      status: res.exitCode === 0 ? 'active' : 'degraded',
      details: {
        dockerCli: res.exitCode === 0 ? res.stdout.trim() : 'not detected',
      },
      checkedAt: new Date().toISOString(),
    };
  },
});

export default dockerManagerPlugin;

