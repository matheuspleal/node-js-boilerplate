import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import { type FastifyInstance } from 'fastify'

import { api } from '@/main/config/env'
import { getCurrentDirname } from '@/main/config/get-current-dirname'

export async function routesSetup(app: FastifyInstance): Promise<void> {
  const routesPath = resolve(getCurrentDirname(), '../routes')
  const files = await readdir(routesPath)
  for (const file of files) {
    if (!file.endsWith('.map')) {
      const route = (await import(resolve(routesPath, file))).default
      app.register(route, { prefix: api.currentVersion })
    }
  }
}
