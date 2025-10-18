import { defineConfig } from 'tsup'

export default defineConfig({
  // Build configuration
  clean: true,
  entry: ['src/**/*.ts'],
  format: ['esm'],
  outDir: 'dist',
  // TypeScript configuration
  tsconfig: 'tsconfig.build.json',
  target: 'es2022',
  // Source maps for debugging
  sourcemap: true,
  // Bundle configuration
  bundle: false, // Keep files separate for better tree-shaking
  splitting: false, // Single file per entry
  // Performance optimizations
  minify: false, // Let Node.js handle optimization
  treeshake: true, // Remove unused code
  // Node.js specific
  platform: 'node',
  external: [
    // Keep these as external dependencies
    '@prisma/client',
    'prisma',
    'bcryptjs',
    'jsonwebtoken',
    'pg',
    'fastify',
    '@apollo/server',
    '@as-integrations/fastify',
    '@fastify/cors',
    '@scalar/fastify-api-reference',
    '@scalar/themes',
    'graphql',
    'zx',
  ],
  // Skip certain files
  ignoreWatch: ['**/*.spec.ts', '**/*.test.ts', '**/test/**'],
  // Output configuration
  dts: false, // Don't generate .d.ts files (not needed for runtime)
  metafile: true, // Generate build metadata
})
