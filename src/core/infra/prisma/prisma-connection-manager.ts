import { PrismaClient } from '@prisma/client'

export class PrismaConnectionManager {
  private static prismaConnectionManager: PrismaClient

  private constructor() {}

  static getInstance(): PrismaClient {
    if (!this.prismaConnectionManager) {
      this.prismaConnectionManager = new PrismaClient({
        log: ['query'],
      })
    }
    return this.prismaConnectionManager
  }
}
