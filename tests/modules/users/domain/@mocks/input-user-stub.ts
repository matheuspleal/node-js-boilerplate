import { faker } from '@faker-js/faker'

const VALID_PROVIDERS = ['fake-domain.com', 'fake-domain.org']

export function makeFakeRequiredInputUserStub() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email({
      provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
    }),
    birthdate: faker.date.birthdate(),
  }
}

export function makeFakeAllInputUserStub() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email({
      provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
    }),
    birthdate: faker.date.birthdate(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}
