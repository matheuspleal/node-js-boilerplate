import { faker } from '@faker-js/faker'

import {
  type PersonDTO,
  type PersonCollectionDTO,
} from '@/modules/persons/application/use-cases/dtos/person-dto'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export function makeFakePersonDTOStub(): PersonDTO {
  const birthdate = faker.date.birthdate()
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    birthdate,
    age: new BirthdateVO({ value: birthdate }).getCurrentAgeInYears(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}

export function makeFakeUserCollectionDTOStub({
  length,
}: CollectionStubProps): PersonCollectionDTO {
  return Array.from({ length }).map(makeFakePersonDTOStub)
}
