import { $ } from 'zx/core'

import { PrismaConnectionManager } from '@/core/infra/repositories/prisma/prisma-connection-manager'

beforeAll(async () => {
  await $`npx prisma migrate deploy`
})

const prisma = PrismaConnectionManager.getInstance()

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS test CASCADE`)
  await prisma.$disconnect()
})
