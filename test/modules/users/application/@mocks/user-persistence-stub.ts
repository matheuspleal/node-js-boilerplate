import { faker } from '@faker-js/faker'

import { type UserPersistence } from '@/modules/users/application/repositories/persistence/user-persistence'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'
import { hashedPasswordStub } from '#/modules/users/application/@mocks/password-stub'

export function makeFakeUserPersistenceStub(): UserPersistence {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPasswordStub,
    birthdate: faker.date.birthdate(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}

export function makeFakeUserCollectionPersistenceStub({
  length,
}: CollectionStubProps): UserPersistence[] {
  return Array.from({ length }).map(makeFakeUserPersistenceStub)
}
