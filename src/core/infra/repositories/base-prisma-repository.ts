import { type PrismaClient } from '@prisma/client'

import { PrismaConnectionManager } from '@/core/infra/repositories/prisma/prisma-connection-manager'

export abstract class BasePrismaRepository {
  protected prisma: PrismaClient

  constructor() {
    this.prisma = PrismaConnectionManager.getInstance()
  }
}
