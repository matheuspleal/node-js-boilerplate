import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '@/core/infra/repositories/prisma/generated/client'
import { database } from '@/core/shared/config/env'

export class PrismaConnectionManager {
  private static client: PrismaClient

  static getInstance(): PrismaClient {
    if (!PrismaConnectionManager.client) {
      PrismaConnectionManager.client = new PrismaClient({
        adapter: new PrismaPg(
          {
            host: database.host,
            port: database.port,
            user: database.user,
            password: database.password,
            database: database.name,
            max: database.pool,
            idleTimeoutMillis: database.idleTimeout,
            connectionTimeoutMillis: database.connectionTimeout,
          },
          {
            schema: database.schema,
          },
        ),
        log: ['info', 'query', 'warn', 'error'],
      })
    }
    return PrismaConnectionManager.client
  }
}
