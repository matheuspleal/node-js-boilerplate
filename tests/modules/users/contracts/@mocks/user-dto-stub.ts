import { faker } from '@faker-js/faker'

import { UserDTO } from '@/modules/users/contracts/dtos/user-dto'
import { Birthdate } from '@/modules/users/domain/value-objects/birthdate'

import { CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export function makeFakeUserDTOStub(): UserDTO {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: new Birthdate(faker.date.birthdate()).getCurrentAgeInYears(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}

export function makeFakeUserCollectionDTOStub({
  length,
}: CollectionStubProps): UserDTO[] {
  return Array.from({ length }).map(() => makeFakeUserDTOStub())
}
