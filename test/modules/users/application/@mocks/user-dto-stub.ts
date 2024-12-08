import { faker } from '@faker-js/faker'

import {
  type UserDTO,
  type UserCollectionDTO,
} from '@/modules/users/application/use-cases/dtos/user-dto'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'
import { VALID_PROVIDERS } from '#/modules/users/application/@mocks/valid-providers'

export interface UserDTOStubProps {
  userDTO?: Partial<UserDTO>
}

export function makeUserDTOStub(props?: UserDTOStubProps): UserDTO {
  const { userDTO } = props ?? {}
  return {
    id: userDTO?.id ?? faker.string.uuid(),
    email:
      userDTO?.email ??
      faker.internet.email({
        provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
      }),
    createdAt: userDTO?.createdAt ?? faker.date.recent(),
    updatedAt: userDTO?.updatedAt ?? faker.date.recent(),
  }
}
export function makeUserCollectionDTOStub({
  userDTO,
  length = 20,
}: UserDTOStubProps & CollectionStubProps): UserCollectionDTO {
  return Array.from({ length }).map(() => makeUserDTOStub({ userDTO }))
}
