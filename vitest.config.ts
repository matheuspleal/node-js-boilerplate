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
        'src/core/application/use-cases/mappers/mapper.ts',
        'src/core/contracts/**/*',
        'src/core/infra/**/*',
        'src/core/shared/config/env/env.ts',
        'src/main/**/*',
        'src/modules/*/infra/repositories/**/*',
        'test/**/*',
      ],
      reporter: ['lcov', 'text'],
    },
    include: ['**/*.spec.ts'],
  },
})
