import { faker } from '@faker-js/faker'

import { PersonEntity } from '@/modules/persons/domain/entities/person-entity'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export function makeFakePersonEntityStub(): PersonEntity {
  return PersonEntity.create({
    name: faker.person.fullName(),
    birthdate: faker.date.birthdate(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  })
}

export function makeFakePersonCollectionEntityStub({
  length,
}: CollectionStubProps): PersonEntity[] {
  return Array.from({ length }).map(makeFakePersonEntityStub)
}
