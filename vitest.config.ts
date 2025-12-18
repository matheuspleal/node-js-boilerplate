import path from 'node:path'

import * as dotenv from 'dotenv'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig, configDefaults } from 'vitest/config'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
  override: true,
})

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    dir: 'test',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        ...configDefaults.exclude,
        '**/contracts/**/*',
        'scripts/**/*',
        'src/core/application/gateways/**/*',
        'src/core/application/use-cases/**/*',
        'src/core/infra/**/*',
        'src/core/presentation/presenters/presenter.ts',
        'src/core/presentation/protocols/http.protocol.ts',
        'src/core/presentation/validators/errors/validation.error.ts',
        'src/core/shared/config/env/env.ts',
        'src/core/shared/config/errors/config.error.ts',
        'src/core/shared/types/**/*',
        'src/main/**/*',
        'src/modules/*/application/repositories/**/*',
        'src/modules/*/application/use-cases/dtos/**/*',
        'src/modules/*/infra/repositories/**/*',
        'test/**/*',
      ],
      reporter: ['lcov', 'text'],
    },
    include: ['**/*.spec.ts'],
  },
})
