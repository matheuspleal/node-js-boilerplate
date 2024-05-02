import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { BcryptAdapter } from '@/core/infra/gateways/bcrypt-adapter'
import { InvalidPasswordError } from '@/core/presentation/validators/errors/invalid-password-error'
import { RequiredError } from '@/core/presentation/validators/errors/required-error'
import { appSetup } from '@/main/setup/app-setup'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidBirthdateError } from '@/modules/users/application/errors/invalid-birthdate-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import { UnauthorizedError } from '@/modules/users/application/errors/unauthorized-error'
import { Birthdate } from '@/modules/users/domain/value-objects/birthdate'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import { makeFakeInputSignInStub } from '#/modules/users/domain/@mocks/input-sign-in-stub'
import {
  makeFakeAllInputSignUpStub,
  makeFakeRequiredInputSignUpStub,
} from '#/modules/users/domain/@mocks/input-sign-up-stub'

const listOfSignUpFields = ['name', 'email', 'password', 'birthdate']
const listOfSignInFields = ['email', 'password']

describe('AuthenticationRouter', () => {
  let app: FastifyInstance
  let prisma: PrismaClient

  beforeAll(async () => {
    prisma = new PrismaClient()
    app = await appSetup()
    await app.ready()
  })

  describe('[POST] /signup', async () => {
    test('sign up with missing all required fields', async () => {
      const fakeUser = {}

      const { statusCode, data } = await request(app.server)
        .post('/api/v1/signup')
        .send(fakeUser)

      expect(statusCode).toEqual(400)
      expect(data).toMatchObject({
        error: new RequiredError(listOfSignUpFields).message,
      })
    })

    test.each(listOfSignUpFields)(
      'sign up with missing "%s" field',
      async (field) => {
        const fakeUser: any = makeFakeRequiredInputSignUpStub()
        fakeUser[field] = undefined

        const { statusCode, data } = await request(app.server)
          .post('/api/v1/signup')
          .send(fakeUser)

        expect(statusCode).toEqual(400)
        expect(data).toMatchObject({
          error: new RequiredError([field]).message,
        })
      },
    )

    test('sign up with invalid email', async () => {
      const { name, password, birthdate } = makeFakeRequiredInputSignUpStub()
      const invalidEmail = 'invalid-email@fake-domain.net'

      const { statusCode, data } = await request(app.server)
        .post('/api/v1/signup')
        .send({
          name,
          email: invalidEmail,
          password,
          birthdate,
        })

      expect(statusCode).toEqual(400)
      expect(data).toMatchObject({
        error: new InvalidEmailError(invalidEmail).message,
      })
    })

    test('sign up with invalid password', async () => {
      const { name, email, birthdate } = makeFakeRequiredInputSignUpStub()
      const invalidPassword = 'invalid-password'

      const { statusCode, data } = await request(app.server)
        .post('/api/v1/signup')
        .send({
          name,
          email,
          password: invalidPassword,
          birthdate,
        })

      expect(statusCode).toEqual(400)
      expect(data).toMatchObject({
        error: new InvalidPasswordError(['password']).message,
      })
    })

    test('sign up with invalid birthdate', async () => {
      const { name, email, password } = makeFakeRequiredInputSignUpStub()
      const invalidBirthdate = faker.date.future({ years: 1 })

      const { statusCode, data } = await request(app.server)
        .post('/api/v1/signup')
        .send({
          name,
          email,
          password,
          birthdate: invalidBirthdate,
        })

      expect(statusCode).toEqual(400)
      expect(data).toMatchObject({
        error: new InvalidBirthdateError(invalidBirthdate).message,
      })
    })

    test('sign up with the existent email', async () => {
      const { name, email, password, birthdate } =
        makeFakeRequiredInputSignUpStub()
      await prisma.user.create({
        data: {
          name,
          email,
          password,
          birthdate,
        },
      })

      const { statusCode, data } = await request(app.server)
        .post('/api/v1/signup')
        .send({
          name,
          email,
          password,
          birthdate,
        })

      expect(statusCode).toEqual(400)
      expect(data).toMatchObject({
        error: new EmailAlreadyExistsError(email).message,
      })
    })

    test('sign up successfully', async () => {
      const { name, email, password, birthdate } =
        makeFakeRequiredInputSignUpStub()
      const age = new Birthdate(birthdate).getCurrentAgeInYears()

      const { statusCode, data } = await request(app.server)
        .post('/api/v1/signup')
        .send({
          name,
          email,
          password,
          birthdate,
        })

      expect(statusCode).toEqual(201)
      expect(data).toMatchObject({
        user: {
          id: expect.stringMatching(UUIDRegExp),
          name,
          email,
          age,
          createdAt: expect.stringMatching(ISODateRegExp),
          updatedAt: expect.stringMatching(ISODateRegExp),
        },
      })
    })
  })

  describe('[POST] /signin', async () => {
    test('sign in with missing all required fields', async () => {
      const fakeCredentials = {}

      const { statusCode, data } = await request(app.server)
        .post('/api/v1/signin')
        .send(fakeCredentials)

      expect(statusCode).toEqual(400)
      expect(data).toMatchObject({
        error: new RequiredError(listOfSignInFields).message,
      })
    })

    test.each(listOfSignInFields)(
      'sign in with missing "%s" field',
      async (field) => {
        const fakeCredentials: any = makeFakeInputSignInStub()
        fakeCredentials[field] = undefined

        const { statusCode, data } = await request(app.server)
          .post('/api/v1/signin')
          .send(fakeCredentials)

        expect(statusCode).toEqual(400)
        expect(data).toMatchObject({
          error: new RequiredError([field]).message,
        })
      },
    )

    test('sign in with incorrect email', async () => {
      const { password } = await prisma.user.create({
        data: {
          ...makeFakeRequiredInputSignUpStub(),
        },
      })

      const incorrectEmail = 'incorrect-email'

      const { statusCode, data } = await request(app.server)
        .post('/api/v1/signin')
        .send({
          email: incorrectEmail,
          password,
        })

      expect(statusCode).toEqual(401)
      expect(data).toMatchObject({
        error: new UnauthorizedError().message,
      })
    })

    test('sign in with incorrect password', async () => {
      const { email } = await prisma.user.create({
        data: {
          ...makeFakeRequiredInputSignUpStub(),
        },
      })

      const incorrectPassword = 'incorrect-password'

      const { statusCode, data } = await request(app.server)
        .post('/api/v1/signin')
        .send({
          email,
          password: incorrectPassword,
        })

      expect(statusCode).toEqual(401)
      expect(data).toMatchObject({
        error: new UnauthorizedError().message,
      })
    })

    test('sign in successfully', async () => {
      const userData = makeFakeAllInputSignUpStub()
      const hashedPasswordStub = await new BcryptAdapter(8).hash({
        plaintext: userData.password,
      })
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPasswordStub,
        },
      })

      const { statusCode, data } = await request(app.server)
        .post('/api/v1/signin')
        .send({
          email: userData.email,
          password: userData.password,
        })

      expect(statusCode).toEqual(201)
      expect(data).toMatchObject({
        token: expect.any(String),
      })
    })
  })
})
