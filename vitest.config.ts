import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    dir: 'test',
    coverage: {
      provider: 'v8',
      exclude: [
        ...configDefaults.exclude,
        '*.ts',
        'scripts/**/*',
        'src/core/infra/**/*',
        'src/core/contracts/**/*',
        'src/main/**/*',
        'src/modules/*/infra/repositories/**/*',
        'test/**/*',
      ],
      reporter: ['lcov', 'text'],
    },
    include: ['**/*.spec.ts'],
  },
})
