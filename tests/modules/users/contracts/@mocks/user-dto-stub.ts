import { faker } from '@faker-js/faker'

import { type UserDTO } from '@/modules/users/contracts/dtos/user-dto'
import { Birthdate } from '@/modules/users/domain/value-objects/birthdate'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export function makeFakeUserDTOStub(): UserDTO {
  const birthdate = faker.date.birthdate()
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    birthdate,
    age: new Birthdate(birthdate).getCurrentAgeInYears(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}

export function makeFakeUserCollectionDTOStub({
  length,
}: CollectionStubProps): UserDTO[] {
  return Array.from({ length }).map(() => makeFakeUserDTOStub())
}
