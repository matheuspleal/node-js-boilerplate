import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import {
  UserEntity,
  type UserInput,
} from '@/modules/users/domain/entities/user.entity'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props.contract'
import { plaintextPasswordStub } from '#/modules/users/application/@mocks/password.stub'
import { VALID_PROVIDERS } from '#/modules/users/application/@mocks/valid-providers'

export type UserInputProps = UserInput & { id?: string }

export interface UserEntityProps {
  userInput?: Partial<UserInputProps>
}

export function makeUserInputStub(
  userInput?: Partial<UserInputProps>,
): UserInputProps {
  return {
    id: userInput?.id ?? faker.string.uuid(),
    personId: userInput?.personId ?? new UniqueEntityId(faker.string.uuid()),
    email:
      userInput?.email ??
      (EmailVO.create({
        value: faker.internet.email({
          provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
        }),
      }).value as EmailVO),
    password: userInput?.password ?? plaintextPasswordStub,
    createdAt: userInput?.createdAt ?? faker.date.recent(),
    updatedAt: userInput?.updatedAt ?? faker.date.recent(),
  }
}

export function makeUserEntityStub(props?: UserEntityProps): UserEntity {
  const { id, ...userInput } = makeUserInputStub({ ...props?.userInput })
  return UserEntity.create(userInput, id ? new UniqueEntityId(id) : undefined)
    .value as UserEntity
}

export function makeUserEntityCollectionStub({
  userInput,
  length = 20,
}: UserEntityProps & CollectionStubProps): UserEntity[] {
  return Array.from({ length }).map(() => makeUserEntityStub({ userInput }))
}
