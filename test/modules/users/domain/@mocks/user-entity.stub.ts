import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import {
  UserEntity,
  type UserInput,
  type UserProps,
} from '@/modules/users/domain/entities/user.entity'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'

import { type CollectionStubProps } from '#/@types/collection-stub-props.type'
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
      EmailVO.reconstitute(
        faker.internet.email({
          provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
        }),
      ),
    password: userInput?.password ?? plaintextPasswordStub,
    createdAt: userInput?.createdAt ?? faker.date.recent(),
    updatedAt: userInput?.updatedAt ?? faker.date.recent(),
  }
}

export function makeUserEntityStub(props?: UserEntityProps): UserEntity {
  const { id, ...rest } = makeUserInputStub({ ...props?.userInput })
  const userProps: UserProps = {
    personId: rest.personId,
    email: rest.email,
    password: rest.password,
    createdAt: rest.createdAt ?? new Date(),
    updatedAt: rest.updatedAt ?? new Date(),
  }
  return UserEntity.reconstitute(userProps, new UniqueEntityId(id))
}

export function makeUserEntityCollectionStub({
  userInput,
  length = 20,
}: UserEntityProps & CollectionStubProps): UserEntity[] {
  return Array.from({ length }).map(() => makeUserEntityStub({ userInput }))
}
