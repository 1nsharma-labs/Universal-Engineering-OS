import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateManifest,
  UniforgePluginHost,
  definePlugin,
  CapabilityDeniedError,
} from '../dist/index.js';

const validManifest = {
  schemaVersion: '1.0.0',
  id: '@uniforge/test-plugin',
  name: 'Test Plugin',
  version: '1.0.0',
  description: 'Verifies SDK contracts and zero-trust capability isolation.',
  category: 'devops',
  author: { name: 'UNIFORGE QA' },
  license: 'Apache-2.0',
  permissions: ['storage:read'],
  engines: { uniforge: '>=1.0.0' },
};

test('validateManifest accepts valid manifest', () => {
  const res = validateManifest(validManifest);
  assert.equal(res.valid, true);
  assert.equal(res.errors.length, 0);
});

test('validateManifest rejects invalid permissions and schemaVersion', () => {
  const res = validateManifest({
    ...validManifest,
    schemaVersion: '2.0.0',
    permissions: ['root:all'],
  });
  assert.equal(res.valid, false);
  assert.ok(res.errors.length >= 2);
});

test('UniforgePluginHost activates plugin, routes commands, and blocks undeclared capabilities', async () => {
  const host = new UniforgePluginHost(process.cwd());
  const plugin = definePlugin({
    manifest: validManifest,
    activate(ctx) {
      ctx.registerCommand('ping', (payload) => ({ pong: true, echo: payload.msg }));
      ctx.registerCommand('illegal-secret', (_payload, c) => c.getSecret('AWS_SECRET_ACCESS_KEY'));
    },
  });

  host.register(plugin);
  await host.activate('@uniforge/test-plugin');

  const res = await host.invokeCommand('@uniforge/test-plugin:ping', { msg: 'hello' });
  assert.deepEqual(res, { pong: true, echo: 'hello' });

  await assert.rejects(
    async () => host.invokeCommand('@uniforge/test-plugin:illegal-secret', {}),
    CapabilityDeniedError
  );

  const health = await host.healthCheckAll();
  assert.equal(health.length, 1);
  assert.equal(health[0].healthy, true);

  await host.deactivate('@uniforge/test-plugin');
});

