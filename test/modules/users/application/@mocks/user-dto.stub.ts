import { faker } from '@faker-js/faker'

import {
  type UserDTO,
  type UserCollectionDTO,
} from '@/modules/users/application/use-cases/dtos/user.dto'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate.vo'

import { type CollectionStubProps } from '#/@types/collection-stub-props.type'
import { VALID_PROVIDERS } from '#/modules/users/application/@mocks/valid-providers'

export interface UserDTOStubProps {
  userDTO?: Partial<UserDTO>
}

export function makeUserDTOStub(props?: UserDTOStubProps): UserDTO {
  const { userDTO } = props ?? {}
  const birthdate = userDTO?.birthdate ?? faker.date.birthdate()
  const age =
    userDTO?.age ?? BirthdateVO.reconstitute(birthdate).getCurrentAgeInYears()
  return {
    id: userDTO?.id ?? faker.string.uuid(),
    name: userDTO?.name ?? faker.person.fullName(),
    birthdate,
    age,
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
