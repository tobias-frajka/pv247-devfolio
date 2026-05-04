import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Design handoff preview is reference-only HTML/JSX, not built code.
    'docs/design_handoff_devfolio/**',
    // Drizzle output and local SQLite WAL files.
    'drizzle/**',
    '*.db*'
  ])
]);

export default eslintConfig;
