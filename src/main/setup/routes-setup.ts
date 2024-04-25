import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import { type FastifyInstance } from 'fastify'

import { api } from '@/core/shared/config/env/env'
import { getCurrentDirname } from '@/core/shared/config/env/get-current-dirname'

export async function routesSetup(app: FastifyInstance): Promise<void> {
  const routesPath = resolve(getCurrentDirname(), '../routes')
  const files = await readdir(routesPath)
  for (const file of files) {
    if (!file.endsWith('.map')) {
      const route = (await import(resolve(routesPath, file))).default
      app.register(route, { prefix: `api/${api.currentVersion}` })
    }
  }
}
