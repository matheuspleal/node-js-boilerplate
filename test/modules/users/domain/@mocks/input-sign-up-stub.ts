import { faker } from '@faker-js/faker'

import { plaintextPassword } from '#/modules/users/domain/@mocks/password-stub'

const VALID_PROVIDERS = ['fake-domain.com', 'fake-domain.org']

export function makeFakeRequiredInputSignUpStub() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email({
      provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
    }),
    password: plaintextPassword,
    birthdate: faker.date.birthdate(),
  }
}

export function makeFakeAllInputSignUpStub() {
  return {
    id: faker.string.uuid(),
    ...makeFakeRequiredInputSignUpStub(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}
