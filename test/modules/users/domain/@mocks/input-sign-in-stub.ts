import { faker } from '@faker-js/faker'

const VALID_PROVIDERS = ['fake-domain.com', 'fake-domain.org']

export function makeFakeInputSignInStub() {
  return {
    email: faker.internet.email({
      provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
    }),
    password: 'P@ssw0rd!123',
  }
}
