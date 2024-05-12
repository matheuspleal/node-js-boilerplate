import { PrismaClient } from '@prisma/client'

export class PrismaConnectionManager {
  private static client: PrismaClient

  static getInstance(): PrismaClient {
    if (!PrismaConnectionManager.client) {
      PrismaConnectionManager.client = new PrismaClient({
        log: ['query'],
      })
    }
    return PrismaConnectionManager.client
  }
}
