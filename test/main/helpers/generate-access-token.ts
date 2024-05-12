import { type PrismaClient } from '@prisma/client'

import { makeJwtAdapterFactory } from '@/main/factories/core/infra/gateways/jwt-adapter-factory'

import { makeFakeUserPersistenceStub } from '#/modules/users/domain/@mocks/user-persistence-stub'

export async function generateAccessToken(prisma: PrismaClient) {
  const { id } = await prisma.user.create({
    data: {
      ...makeFakeUserPersistenceStub(),
    },
  })
  return makeJwtAdapterFactory().generate({
    payload: {
      sub: id.toString(),
    },
    expiresInMs: 60 * 1000 * 5,
  })
}
