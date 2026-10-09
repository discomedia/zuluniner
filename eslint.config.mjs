import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config({ ignores: ['dist/**', '.astro/**', '.next/**', 'worker-configuration.d.ts', 'temp_backup/**'] }, eslint.configs.recommended, ...tseslint.configs.recommended, { files: ['**/*.ts','**/*.tsx'], rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }] } });
