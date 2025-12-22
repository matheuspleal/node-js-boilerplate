import { defineConfig, mergeConfig } from 'vitest/config'

import vitestConfig from './vitest.config'

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      exclude: ['**/*.spec.ts'],
      include: ['**/*.e2e.ts'],
      setupFiles: ['./test/setup-e2e.ts'],
      maxWorkers: 1,
    },
  }),
)
