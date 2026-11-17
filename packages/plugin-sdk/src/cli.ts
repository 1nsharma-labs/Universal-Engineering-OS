#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { validateManifest } from './validator';

function printHelp(): void {
  console.log(`@uniforge/plugin-sdk CLI (v1.0.0)
Usage:
  uniforge-plugin validate <path/to/uniforge-plugin.json>
  uniforge-plugin init <plugin-name>
`);
}

function main(): void {
  const [, , cmd, arg] = process.argv;

  if (!cmd || cmd === '--help' || cmd === '-h') {
    printHelp();
    process.exit(0);
  }

  if (cmd === 'validate') {
    const target = path.resolve(arg || 'uniforge-plugin.json');
    if (!fs.existsSync(target)) {
      console.error(`[ERROR] Manifest not found: ${target}`);
      process.exit(1);
    }
    const raw = JSON.parse(fs.readFileSync(target, 'utf-8'));
    const res = validateManifest(raw);
    if (res.warnings.length) {
      res.warnings.forEach((w) => console.warn(`[WARN] ${w}`));
    }
    if (!res.valid) {
      res.errors.forEach((e) => console.error(`[FAIL] ${e}`));
      process.exit(1);
    }
    console.log(`[OK] Manifest valid: ${raw.id}@${raw.version}`);
    process.exit(0);
  }

  if (cmd === 'init') {
    const name = arg || 'my-uniforge-plugin';
    const dir = path.resolve(name);
    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    const manifest = {
      schemaVersion: '1.0.0',
      id: `@uniforge/${name}`,
      name,
      version: '1.0.0',
      description: `UNIFORGE plugin: ${name}`,
      category: 'devops',
      author: { name: 'UNIFORGE Contributor' },
      license: 'Apache-2.0',
      permissions: ['storage:read'],
      engines: { uniforge: '>=1.0.0' },
      entrypoints: { backend: 'dist/index.js' },
    };
    fs.writeFileSync(path.join(dir, 'uniforge-plugin.json'), JSON.stringify(manifest, null, 2) + '\n');
    console.log(`[OK] Initialized UNIFORGE plugin scaffold at ${dir}`);
    process.exit(0);
  }

  console.error(`Unknown command: ${cmd}`);
  printHelp();
  process.exit(1);
}

main();

