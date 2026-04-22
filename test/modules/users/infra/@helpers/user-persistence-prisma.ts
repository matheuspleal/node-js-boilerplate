import { type PrismaClient } from '@/core/infra/repositories/prisma/generated/client'
import { type UserPersistence } from '@/modules/users/infra/repositories/persistence/user.persistence'

import { makeUserPersistenceStub } from '#/modules/users/infra/@mocks/user-persistence.stub'

export interface UserDTOStubProps {
  prisma: PrismaClient
  userPersistence?: Partial<UserPersistence>
}

export async function createUser({
  prisma,
  userPersistence,
}: UserDTOStubProps): Promise<UserPersistence> {
  const userPersistenceData = makeUserPersistenceStub({ userPersistence })
  const createdUser = await prisma.user.create({
    data: userPersistenceData,
  })
  return createdUser
}
