import { faker } from '@faker-js/faker'

import { UserEntity } from '@/modules/users/domain/entities/user-entity'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export function makeFakeUserEntityStub(): UserEntity {
  return UserEntity.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    birthdate: faker.date.birthdate(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  })
}

export function makeFakeUserCollectionEntityStub({
  length,
}: CollectionStubProps): UserEntity[] {
  return Array.from({ length }).map(() => makeFakeUserEntityStub())
}
