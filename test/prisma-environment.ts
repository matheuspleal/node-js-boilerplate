import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import path from 'node:path'

import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
  override: true,
})

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

export default {
  name: 'prisma',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateUniqueDatabaseURL(schema)
    process.env.DATABASE_URL = databaseURL
    execSync('npx prisma migrate deploy')
    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
