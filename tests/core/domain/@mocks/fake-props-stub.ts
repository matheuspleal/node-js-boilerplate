import { faker } from '@faker-js/faker'

import { Optional } from '@/core/shared/types/optional'

export interface FakeProps {
  name?: string
  email: string
  birthdate: Date
  createdAt: Date
  updatedAt: Date
}

export function makeFakeRequiredPropsStub(): Optional<
  FakeProps,
  'createdAt' | 'updatedAt'
> {
  return {
    email: faker.internet.email(),
    birthdate: faker.date.birthdate({ min: 1950, max: 2005 }),
  }
}

export function makeFakeAllPropsStub(): FakeProps {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    birthdate: faker.date.birthdate({ min: 1950, max: 2005 }),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}
