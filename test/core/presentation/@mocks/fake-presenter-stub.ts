import { faker } from '@faker-js/faker'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export interface FakeDTO {
  name: string
  email: string
  birthdate: Date
}

export type FakeCollectionDTO = FakeDTO[]

export interface FakeOutput {
  full_name: string
  email: string
  age: number
}

export type FakeCollectionOutput = FakeOutput[]

export function makeFakeDTOStub(): FakeDTO {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    birthdate: faker.date.birthdate({ min: 1950, max: 2005 }),
  }
}

export function makeFakeCollectionDTOStub({
  length = 20,
}: CollectionStubProps): FakeCollectionDTO {
  return Array.from({ length }).map(makeFakeDTOStub)
}
