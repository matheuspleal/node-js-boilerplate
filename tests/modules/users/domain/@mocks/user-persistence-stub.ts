import { faker } from '@faker-js/faker'

import { UserPersistence } from '@/modules/users/application/repositories/persistence/user-persistence'

import { CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export function makeFakeUserPersistenceStub(): UserPersistence {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    birthdate: faker.date.birthdate(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}

export function makeFakeUserCollectionPersistenceStub({
  length,
}: CollectionStubProps): UserPersistence[] {
  return Array.from({ length }).map(() => makeFakeUserPersistenceStub())
}
