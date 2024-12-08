import { faker } from '@faker-js/faker'

import { type UserPersistence } from '@/modules/users/application/repositories/persistence/user-persistence'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'
import { hashedPasswordStub } from '#/modules/users/application/@mocks/password-stub'
import { VALID_PROVIDERS } from '#/modules/users/application/@mocks/valid-providers'

export interface UserPersistenceStubProps {
  userPersistence?: Partial<UserPersistence>
}

export function makeUserPersistenceStub(
  props?: UserPersistenceStubProps,
): UserPersistence {
  const { userPersistence } = props ?? {}
  return {
    id: userPersistence?.id ?? faker.string.uuid(),
    personId: userPersistence?.personId ?? faker.string.uuid(),
    email:
      userPersistence?.email ??
      faker.internet.email({
        provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
      }),
    password: userPersistence?.password ?? hashedPasswordStub,
    createdAt: userPersistence?.createdAt ?? faker.date.recent(),
    updatedAt: userPersistence?.updatedAt ?? faker.date.recent(),
  }
}

export function makeUserCollectionPersistenceStub({
  length = 20,
  userPersistence,
}: UserPersistenceStubProps & CollectionStubProps): UserPersistence[] {
  return Array.from({ length }).map(() =>
    makeUserPersistenceStub({ userPersistence }),
  )
}
