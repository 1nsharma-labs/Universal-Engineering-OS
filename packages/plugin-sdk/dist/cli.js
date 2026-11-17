#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const validator_1 = require("./validator");
function printHelp() {
    console.log(`@uniforge/plugin-sdk CLI (v1.0.0)
Usage:
  uniforge-plugin validate <path/to/uniforge-plugin.json>
  uniforge-plugin init <plugin-name>
`);
}
function main() {
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
        const res = (0, validator_1.validateManifest)(raw);
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
//# sourceMappingURL=cli.js.map