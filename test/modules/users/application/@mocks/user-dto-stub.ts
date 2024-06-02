import { faker } from '@faker-js/faker'

import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user-dto'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate-vo'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export function makeFakeUserDTOStub(): UserDTO {
  const birthdate = faker.date.birthdate()
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    birthdate,
    age: new BirthdateVO({ value: birthdate }).getCurrentAgeInYears(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}

export function makeFakeUserCollectionDTOStub({
  length,
}: CollectionStubProps): UserDTO[] {
  return Array.from({ length }).map(makeFakeUserDTOStub)
}
