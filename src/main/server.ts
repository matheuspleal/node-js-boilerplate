import { PrismaConnectionManager } from '@/core/infra/repositories/prisma/prisma-connection-manager'
import { server } from '@/core/shared/config/env'
import { createGracefulShutdown } from '@/main/helpers/graceful-shutdown.helper'
import { appSetup } from '@/main/setup/app.setup'

const app = await appSetup()

try {
  const address = await app.listen({ port: server.port, host: server.host })
  app.log.info(`🐙 Server listening at ${address}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

const gracefulShutdown = createGracefulShutdown({
  logger: {
    info: (message) => app.log.info(message),
    error: (err) => app.log.error(err),
  },
  close: () => app.close(),
  disconnect: () => PrismaConnectionManager.disconnect(),
  timeoutMs: server.shutdownTimeoutInMs,
})

process.on('SIGTERM', () => {
  void gracefulShutdown('SIGTERM')
})
process.on('SIGINT', () => {
  void gracefulShutdown('SIGINT')
})
