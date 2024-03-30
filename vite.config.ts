import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      exclude: [
        ...configDefaults.exclude,
        '*.ts',
        'scripts/**/*',
        'src/core/infra/prisma/**/*',
        'src/core/presentation/contracts/**/*',
        'src/main/**/*',
        'src/modules/*/infra/repositories/**/*',
        'tests/**/*',
      ],
      reporter: ['lcov', 'text'],
    },
  },
})
