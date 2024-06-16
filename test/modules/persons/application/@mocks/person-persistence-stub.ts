import { faker } from '@faker-js/faker'

import { type PersonPersistence } from '@/modules/persons/application/repositories/persistence/person-persistence'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export function makeFakePersonPersistenceStub(): PersonPersistence {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    birthdate: faker.date.birthdate(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}

export function makeFakePersonCollectionPersistenceStub({
  length,
}: CollectionStubProps): PersonPersistence[] {
  return Array.from({ length }).map(makeFakePersonPersistenceStub)
}
