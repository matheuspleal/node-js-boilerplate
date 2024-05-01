import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'
import { $ } from 'zx/core'

import { authenticationStub } from '#/modules/users/domain/@mocks/authentication-stub'
import { makeFakeUserPersistenceStub } from '#/modules/users/domain/@mocks/user-persistence-stub'

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

async function createUserToMakeSignIn() {
  await prisma.user.create({
    data: {
      ...makeFakeUserPersistenceStub(),
      ...authenticationStub,
    },
  })
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL
  await $`npx prisma migrate deploy`
  await createUserToMakeSignIn()
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
