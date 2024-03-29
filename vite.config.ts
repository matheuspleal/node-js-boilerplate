import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      exclude: [...configDefaults.exclude, '*.ts', 'scripts/**/*'],
      reporter: ['lcov', 'text'],
    },
  },
})
