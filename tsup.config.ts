import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: ['src/main/server.ts'],
  format: ['esm'],
  outDir: 'dist',
  tsconfig: 'tsconfig.build.json',
  target: 'es2022',
  sourcemap: true,
  bundle: true,
  splitting: false,
  minify: false,
  treeshake: true,
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
  dts: false,
  metafile: true,
})
