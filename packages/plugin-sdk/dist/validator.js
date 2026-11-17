"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateManifest = validateManifest;
const types_1 = require("./types");
const SEMVER_RE = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
const PLUGIN_ID_RE = /^(@[a-z0-9-]+\/)?[a-z0-9][a-z0-9-]*$/;
/**
 * Strictly validates a UNIFORGE plugin manifest against Schema v1.0.0.
 */
function validateManifest(input) {
    const errors = [];
    const warnings = [];
    if (!input || typeof input !== 'object') {
        return { valid: false, errors: ['Manifest must be a non-null JSON object.'], warnings };
    }
    const m = input;
    if (m.schemaVersion !== '1.0.0') {
        errors.push(`Invalid schemaVersion "${String(m.schemaVersion)}". Expected "1.0.0".`);
    }
    if (!m.id || typeof m.id !== 'string' || !PLUGIN_ID_RE.test(m.id)) {
        errors.push(`Invalid plugin id "${String(m.id)}". Must match npm-style identifier.`);
    }
    if (!m.name || typeof m.name !== 'string' || m.name.trim().length < 2) {
        errors.push('Manifest "name" must be a non-empty string.');
    }
    if (!m.version || typeof m.version !== 'string' || !SEMVER_RE.test(m.version)) {
        errors.push(`Invalid semver version "${String(m.version)}".`);
    }
    if (!m.description || typeof m.description !== 'string') {
        errors.push('Manifest "description" is required.');
    }
    if (!m.author || typeof m.author !== 'object' || !m.author.name) {
        errors.push('Manifest "author.name" is required.');
    }
    if (!m.license || typeof m.license !== 'string') {
        errors.push('Manifest "license" is required.');
    }
    if (!m.engines || typeof m.engines !== 'object' || !m.engines.uniforge) {
        errors.push('Manifest "engines.uniforge" compatibility range is required.');
    }
    if (!Array.isArray(m.permissions)) {
        errors.push('Manifest "permissions" must be an array of capability strings.');
    }
    else {
        const validSet = new Set(types_1.VALID_PLUGIN_PERMISSIONS);
        for (const perm of m.permissions) {
            if (!validSet.has(perm)) {
                errors.push(`Unknown permission capability: "${String(perm)}".`);
            }
        }
        if (m.permissions.includes('secrets:read')) {
            warnings.push('Plugin requests "secrets:read" — requires explicit user approval in Studio.');
        }
    }
    if (m.pricing) {
        if (m.pricing.tier === 'paid_monthly' && (!m.pricing.priceUsdMonthly || m.pricing.priceUsdMonthly <= 0)) {
            errors.push('Paid monthly plugins must specify a positive "pricing.priceUsdMonthly".');
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
//# sourceMappingURL=validator.js.map