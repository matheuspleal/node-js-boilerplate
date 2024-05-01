import { defineConfig, mergeConfig } from 'vitest/config'

import vitestConfig from './vitest.config'

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      include: ['**/*.{spec,test}.ts'],
      setupFiles: ['./test/setup-e2e.ts'],
    },
  }),
)
