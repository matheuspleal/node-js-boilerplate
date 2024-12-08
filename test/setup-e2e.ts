import { randomUUID } from 'node:crypto'
import path from 'node:path'

import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import { $ } from 'zx/core'

dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
  override: true,
})

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not provided')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL
  await $`npx prisma migrate deploy`
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
