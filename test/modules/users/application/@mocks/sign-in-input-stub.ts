import { faker } from '@faker-js/faker'

import { VALID_PROVIDERS } from '#/modules/users/application/@mocks/valid-providers'

export function makeSignInInputStub() {
  return {
    email: faker.internet.email({
      provider: faker.helpers.arrayElement([...VALID_PROVIDERS]),
    }),
    password: 'P@ssw0rd!123',
  }
}
