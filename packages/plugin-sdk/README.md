# `@uniforge/plugin-sdk`

Official TypeScript & Node.js SDK for building **UNIFORGE (Universal Engineering OS)** plugins, operational studio views, and zero-trust MCP bridges.

## Installation

```bash
npm install @uniforge/plugin-sdk
```

## Quick Start

```ts
import { definePlugin, UniforgePluginHost } from '@uniforge/plugin-sdk';

export const myPlugin = definePlugin({
  manifest: {
    schemaVersion: '1.0.0',
    id: '@uniforge/plugin-example',
    name: 'Example Studio Plugin',
    version: '1.0.0',
    description: 'Custom engineering workflow extension',
    category: 'devops',
    author: { name: 'UNIFORGE Contributors' },
    license: 'Apache-2.0',
    permissions: ['storage:read', 'network:outbound'],
    engines: { uniforge: '>=1.0.0' },
  },
  activate(ctx) {
    ctx.registerCommand('status', () => ({ ready: true }));
  },
});
```

## CLI Commands

```bash
npx uniforge-plugin validate ./uniforge-plugin.json
npx uniforge-plugin init my-custom-studio
```

## Zero-Trust Permission Model
All runtime capabilities (`network:outbound`, `process:exec`, `docker:control`, `database:query`, `ai:inference`, `secrets:read`, `storage:read`, `storage:write`) must be declared explicitly in `uniforge-plugin.json`. Undeclared calls throw `CapabilityDeniedError`.

