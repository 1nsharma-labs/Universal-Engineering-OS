export interface ManifestValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
/**
 * Strictly validates a UNIFORGE plugin manifest against Schema v1.0.0.
 */
export declare function validateManifest(input: unknown): ManifestValidationResult;
