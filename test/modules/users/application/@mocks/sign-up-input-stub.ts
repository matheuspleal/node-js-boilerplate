import { faker } from '@faker-js/faker'

import { type SignUpUseCaseInput } from '@/modules/users/application/use-cases/sign-up-use-case'

import { plaintextPasswordStub } from '#/modules/users/application/@mocks/password-stub'
import { VALID_PROVIDERS } from '#/modules/users/application/@mocks/valid-providers'

export interface SignUpDTOStubProps {
  signUpInput?: Partial<SignUpUseCaseInput>
}

export function makeRequiredSignUpInputStub(
  props?: SignUpDTOStubProps,
): SignUpUseCaseInput {
  const { signUpInput } = props ?? {}
  return {
    name: signUpInput?.name ?? faker.person.fullName(),
    email:
      signUpInput?.email ??
      faker.internet.email({
        provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
      }),
    password: signUpInput?.password ?? plaintextPasswordStub,
    birthdate: signUpInput?.birthdate ?? faker.date.birthdate(),
  }
}

export function makeSignUpInputStub(props?: SignUpDTOStubProps) {
  return {
    id: faker.string.uuid(),
    ...makeRequiredSignUpInputStub(props),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}
