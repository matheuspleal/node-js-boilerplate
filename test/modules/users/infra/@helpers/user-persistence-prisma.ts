import { type PrismaClient } from '@prisma/client'

import { type PersonPersistence } from '@/modules/persons/application/repositories/persistence/person-persistence'
import { type UserPersistence } from '@/modules/users/application/repositories/persistence/user-persistence'

import { createPerson } from '#/modules/persons/infra/@helpers/person-persistance-prisma'
import { makeUserPersistenceStub } from '#/modules/users/infra/@mocks/user-persistence-stub'

export interface UserDTOStubProps {
  prisma: PrismaClient
  userPersistence?: Partial<UserPersistence>
  personPersistence?: Partial<PersonPersistence>
}

export async function createUser({
  prisma,
  personPersistence,
  userPersistence,
}: UserDTOStubProps): Promise<UserPersistence> {
  const userPersistenceData = makeUserPersistenceStub({ userPersistence })
  const { id: personId } = await createPerson({
    prisma,
    personPersistence,
  })
  const createdUser = await prisma.user.create({
    data: {
      ...userPersistenceData,
      personId,
    },
  })
  return createdUser
}
