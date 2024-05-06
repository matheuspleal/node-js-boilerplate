import { faker } from '@faker-js/faker'

import { type Optional } from '@/core/shared/types/optional'

export interface FakeProps {
  name?: string
  email: string
  password: string
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
    password: 'P@ssw0rd!123',
  }
}

export function makeFakeAllPropsStub(): FakeProps {
  return {
    name: faker.person.fullName(),
    ...makeFakeRequiredPropsStub(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }
}
