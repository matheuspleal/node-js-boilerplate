import { defineConfig, mergeConfig } from 'vitest/config'

import vitestConfig from './vitest.config'

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      include: ['**/*.test.ts'],
      setupFiles: ['./tests/setup-e2e.ts'],
    },
  }),
)
