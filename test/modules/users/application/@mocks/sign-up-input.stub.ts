import { faker } from '@faker-js/faker'

import { type SignUpUseCaseInput } from '@/modules/users/application/use-cases/sign-up.use-case'

import { plaintextPasswordStub } from '#/modules/users/application/@mocks/password.stub'
import { VALID_PROVIDERS } from '#/modules/users/application/@mocks/valid-providers'

export interface SignUpDTOStubProps {
  signUpInput?: Partial<SignUpUseCaseInput>
}

export function makeRequiredSignUpInputStub(
  props?: SignUpDTOStubProps,
): SignUpUseCaseInput {
  const { signUpInput } = props ?? {}
  const normalizedBirthdate = signUpInput?.birthdate ?? faker.date.birthdate()
  normalizedBirthdate.setUTCHours(0, 0, 0, 0)
  return {
    name: signUpInput?.name ?? faker.person.fullName(),
    email:
      signUpInput?.email ??
      faker.internet
        .email({
          provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
        })
        .toLowerCase(),
    password: signUpInput?.password ?? plaintextPasswordStub,
    birthdate: normalizedBirthdate,
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
