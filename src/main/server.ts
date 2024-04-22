import { server } from '@/main/config/env'
import { appSetup } from '@/main/setup/app-setup'

const app = await appSetup()

try {
  const address = await app.listen({ port: server.port, host: server.host })
  app.log.info(`🐙 Server listening at ${address}`)
} catch (err) {
  app.log.error(err)
  process.exit()
}
