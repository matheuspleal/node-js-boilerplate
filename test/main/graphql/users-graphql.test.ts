import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { BcryptAdapter } from '@/core/infra/gateways/bcrypt-adapter'
import { appSetup } from '@/main/setup/app-setup'
import { UnauthorizedError } from '@/modules/persons/application/errors/unauthorized-error'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import { makeFakeRequiredInputSignInStub } from '#/modules/users/application/@mocks/input-sign-in-stub'
import {
  makeFakeAllInputSignUpStub,
  makeFakeRequiredInputSignUpStub,
} from '#/modules/users/application/@mocks/input-sign-up-stub'

const listOfSignUpFields = ['name', 'email', 'password', 'birthdate']
const listOfSignInFields = ['email', 'password']

describe('UsersGraphQL', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let signUpMutation: string
  let signInQuery: string

  beforeAll(async () => {
    prisma = new PrismaClient()
    app = await appSetup()
    await app.ready()
  })

  describe('Sign Up', async () => {
    beforeAll(() => {
      signUpMutation = `
        mutation SignUp($name: String!, $email: String!, $password: String!, $birthdate: Date!) {
          signUp(name: $name, email: $email, password: $password, birthdate: $birthdate) {
            user {
              id
              name
              email
              birthdate
              age
              createdAt
              updatedAt
            }
          }
        }
      `
    })

    test('sign up with missing all required fields', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signUpMutation,
          variables: {},
        })

      expect(statusCode).toEqual(400)
      expect(body.errors).toHaveLength(4)
      body.errors.forEach((error: any) => {
        expect(error).toMatchObject({
          message: expect.any(String),
          extensions: { code: 'BAD_USER_INPUT' },
          locations: expect.any(Array),
        })
      })
    })

    test.each(listOfSignUpFields)(
      'sign up with missing "%s" field',
      async (field) => {
        const fakeUser: any = makeFakeRequiredInputSignUpStub()
        fakeUser[field] = undefined

        const { statusCode, body } = await request(app.server)
          .post('/api/graphql')
          .send({
            query: signUpMutation,
            variables: { ...fakeUser },
          })

        expect(statusCode).toEqual(400)
        expect(body.errors).toHaveLength(1)
        const [error] = body.errors
        expect(error).toMatchObject({
          message: expect.any(String),
          extensions: { code: 'BAD_USER_INPUT' },
          locations: expect.any(Array),
        })
      },
    )

    test('sign up with invalid email', async () => {
      const { name, password, birthdate } = makeFakeRequiredInputSignUpStub()
      const invalidEmail = 'invalid-email@fake-domain.net'

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signUpMutation,
          variables: {
            name,
            email: invalidEmail,
            password,
            birthdate,
          },
        })

      expect(statusCode).toEqual(400)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        message: `Email "${invalidEmail}" is invalid!`,
        extensions: { code: 'DOMAIN_VALIDATION_ERROR' },
      })
    })

    test('sign up with invalid password', async () => {
      const { name, email, birthdate } = makeFakeRequiredInputSignUpStub()
      const invalidPassword = 'invalid-password'

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signUpMutation,
          variables: {
            name,
            email,
            password: invalidPassword,
            birthdate,
          },
        })

      expect(statusCode).toEqual(400)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        message:
          'The field "password" must contain between 8 and 20 characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character!',
        extensions: { code: 'DOMAIN_VALIDATION_ERROR' },
      })
    })

    test('sign up with invalid birthdate', async () => {
      const { name, email, password } = makeFakeRequiredInputSignUpStub()
      const invalidBirthdate = faker.date.future({ years: 1 })

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signUpMutation,
          variables: {
            name,
            email,
            password,
            birthdate: invalidBirthdate,
          },
        })

      expect(statusCode).toEqual(400)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        message: `Birthdate "${invalidBirthdate.toISOString()}" is invalid!`,
        extensions: { code: 'DOMAIN_VALIDATION_ERROR' },
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

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signUpMutation,
          variables: {
            name,
            email,
            password,
            birthdate,
          },
        })

      expect(statusCode).toEqual(409)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        message: `Email "${email}" already exists!`,
        extensions: { code: 'CONFLICT' },
      })
    })

    test('sign up successfully', async () => {
      const { name, email, password, birthdate } =
        makeFakeRequiredInputSignUpStub()
      const age = new BirthdateVO({ value: birthdate }).getCurrentAgeInYears()

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signUpMutation,
          variables: { name, email, password, birthdate },
        })

      expect(statusCode).toEqual(200)
      expect(body).toMatchObject({
        data: {
          signUp: {
            user: {
              id: expect.stringMatching(UUIDRegExp),
              name,
              email,
              age,
              createdAt: expect.stringMatching(ISODateRegExp),
              updatedAt: expect.stringMatching(ISODateRegExp),
            },
          },
        },
      })
    })
  })

  describe('Sign In', async () => {
    beforeAll(() => {
      signInQuery = `
        query SignIn($password: String!, $email: String!) {
          signIn(password: $password, email: $email) {
            accessToken
          }
        }
      `
    })

    test('sign in with missing all required fields', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signInQuery,
          variables: {},
        })

      expect(statusCode).toEqual(400)
      expect(body.errors).toHaveLength(2)
      body.errors.forEach((error: any) => {
        expect(error).toMatchObject({
          message: expect.any(String),
          extensions: { code: 'BAD_USER_INPUT' },
          locations: expect.any(Array),
        })
      })
    })

    test.each(listOfSignInFields)(
      'sign in with missing "%s" field',
      async (field) => {
        const fakeCredentials: any = makeFakeRequiredInputSignInStub()
        fakeCredentials[field] = undefined

        const { statusCode, body } = await request(app.server)
          .post('/api/graphql')
          .send({
            query: signInQuery,
            variables: { ...fakeCredentials },
          })

        expect(statusCode).toEqual(400)
        expect(body.errors).toHaveLength(1)
        const [error] = body.errors
        expect(error).toMatchObject({
          message: expect.any(String),
          extensions: { code: 'BAD_USER_INPUT' },
          locations: expect.any(Array),
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

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signInQuery,
          variables: {
            email: incorrectEmail,
            password,
          },
        })

      expect(statusCode).toEqual(401)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        message: new UnauthorizedError().message,
        extensions: { code: 'UNAUTHORIZED' },
      })
    })

    test('sign in with incorrect password', async () => {
      const { email } = await prisma.user.create({
        data: {
          ...makeFakeRequiredInputSignUpStub(),
        },
      })

      const incorrectPassword = 'incorrect-password'

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signInQuery,
          variables: {
            email,
            password: incorrectPassword,
          },
        })

      expect(statusCode).toEqual(401)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        message: new UnauthorizedError().message,
        extensions: { code: 'UNAUTHORIZED' },
      })
    })

    test('sign in successfully', async () => {
      const fakeUserData = makeFakeAllInputSignUpStub()
      const hashedPasswordStub = await new BcryptAdapter(8).hash({
        plaintext: fakeUserData.password,
      })
      await prisma.user.create({
        data: {
          ...fakeUserData,
          password: hashedPasswordStub,
        },
      })

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signInQuery,
          variables: {
            email: fakeUserData.email,
            password: fakeUserData.password,
          },
        })

      expect(statusCode).toEqual(200)
      expect(body).toMatchObject({})
    })
  })
})
