/**
 * Wexts Vercel Builder — re-exports from the main wexts package.
 *
 * The actual Build Output API logic lives in packages/src/vercel-builder/
 * and is built as part of the wexts package via tsup.
 *
 * This standalone package exists for standalone usage scenarios but
 * simply re-exports the core implementation.
 */

export { buildVercelOutput, validateOutput } from './build';
export type { VercelBuildOptions, VercelBuildResult, ValidationResult } from './build';
