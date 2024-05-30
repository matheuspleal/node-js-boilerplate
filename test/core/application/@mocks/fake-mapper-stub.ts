import { faker } from '@faker-js/faker'

import { plaintextPasswordStub } from '#/modules/users/domain/@mocks/password-stub'

export interface FakeDTO {
  name: string
  email: string
  password: string
  age: number
}

export interface FakeEntity {
  id: string
  name: string
  email: string
  password: string
  birthdate: Date
}

export interface FakePersistence {
  id: string
  email: string
  password: string
  full_name: string
  birthdate: Date
}

const id = faker.string.uuid()
const name = faker.person.fullName()
const email = faker.internet.email()
const password = plaintextPasswordStub
const birthdate = faker.date.birthdate({ min: 1950, max: 2005 })
const age = new Date().getFullYear() - birthdate.getFullYear()

export function makeFakeDTOStub(): FakeDTO {
  return {
    name,
    email,
    password,
    age,
  }
}

export function makeFakeEntityStub(): FakeEntity {
  return {
    id,
    name,
    email,
    password,
    birthdate,
  }
}

export function makeFakePersistenceStub(): FakePersistence {
  return {
    id,
    full_name: name,
    email,
    password,
    birthdate,
  }
}
