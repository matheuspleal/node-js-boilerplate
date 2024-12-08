import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { BcryptAdapter } from '@/core/infra/gateways/bcrypt-adapter'
import { StatusCode } from '@/core/presentation/helpers/http-helpers'
import { appSetup } from '@/main/setup/app-setup'
import { UnauthorizedError } from '@/modules/persons/application/errors/unauthorized-error'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import {
  makeRequiredSignUpInputStub,
  makeSignUpInputStub,
} from '#/modules/users/application/@mocks/sign-up-input-stub'
import { createUser } from '#/modules/users/infra/@helpers/user-persistence-prisma'

const listOfSignUpFields = ['name', 'email', 'password', 'birthdate']
const listOfSignInFields = ['email', 'password']

describe('AuthenticationGraphQL', () => {
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

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body.errors).toHaveLength(4)
      body.errors.forEach((error: any) => {
        expect(error).toMatchObject({
          extensions: {
            code: 'BAD_USER_INPUT',
          },
          locations: expect.any(Array),
          message: expect.any(String),
        })
      })
    })

    test.each(listOfSignUpFields)(
      'sign up with missing "%s" field',
      async (field) => {
        const fakeUser: any = makeRequiredSignUpInputStub()
        fakeUser[field] = undefined

        const { statusCode, body } = await request(app.server)
          .post('/api/graphql')
          .send({
            query: signUpMutation,
            variables: { ...fakeUser },
          })

        expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
        expect(body.errors).toHaveLength(1)
        const [error] = body.errors
        expect(error).toMatchObject({
          extensions: {
            code: 'BAD_USER_INPUT',
          },
          locations: expect.any(Array),
          message: expect.any(String),
        })
      },
    )

    test('sign up with invalid email', async () => {
      const { name, password, birthdate } = makeRequiredSignUpInputStub()
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

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'DOMAIN_VALIDATION_ERROR',
        },
        locations: expect.any(Array),
        message: `Email "${invalidEmail}" is invalid!`,
        path: ['signUp'],
      })
    })

    test('sign up with invalid password', async () => {
      const { name, email, birthdate } = makeRequiredSignUpInputStub()
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

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'DOMAIN_VALIDATION_ERROR',
        },
        message:
          'The field "password" must contain between 8 and 20 characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character!',
      })
    })

    test('sign up with invalid birthdate', async () => {
      const { name, email, password } = makeRequiredSignUpInputStub()
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

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'DOMAIN_VALIDATION_ERROR',
        },
        locations: expect.any(Array),
        message: `Birthdate "${invalidBirthdate.toISOString()}" is invalid!`,
        path: ['signUp'],
      })
    })

    test('sign up with the existent email', async () => {
      const { name, password, birthdate } = makeRequiredSignUpInputStub()
      const { email } = await createUser({ prisma })

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

      expect(statusCode).toEqual(StatusCode.CONFLICT)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'CONFLICT',
        },
        locations: expect.any(Array),
        message: `Email "${email}" already exists!`,
        path: ['signUp'],
      })
    })

    test('sign up successfully', async () => {
      const { name, email, password, birthdate } = makeRequiredSignUpInputStub()

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: signUpMutation,
          variables: { name, email, password, birthdate },
        })

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body).toEqual({
        data: {
          signUp: {
            user: {
              id: expect.stringMatching(UUIDRegExp),
              name,
              email,
              birthdate: new BirthdateVO({ value: birthdate }).toString(),
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

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body.errors).toHaveLength(2)
      body.errors.forEach((error: any) => {
        expect(error).toMatchObject({
          extensions: {
            code: 'BAD_USER_INPUT',
          },
          locations: expect.any(Array),
          message: expect.any(String),
        })
      })
    })

    test.each(listOfSignInFields)(
      'sign in with missing "%s" field',
      async (field) => {
        const fakeCredentials: any = makeRequiredSignUpInputStub()
        fakeCredentials[field] = undefined

        const { statusCode, body } = await request(app.server)
          .post('/api/graphql')
          .send({
            query: signInQuery,
            variables: { ...fakeCredentials },
          })

        expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
        expect(body.errors).toHaveLength(1)
        const [error] = body.errors
        expect(error).toMatchObject({
          extensions: {
            code: 'BAD_USER_INPUT',
          },
          locations: expect.any(Array),
          message: expect.any(String),
        })
      },
    )

    test('sign in with incorrect email', async () => {
      const { password } = await createUser({ prisma })

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

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'UNAUTHORIZED',
        },
        locations: expect.any(Array),
        message: new UnauthorizedError().message,
        path: ['signIn'],
      })
    })

    test('sign in with incorrect password', async () => {
      const { email } = await createUser({ prisma })
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

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'UNAUTHORIZED',
        },
        locations: expect.any(Array),
        message: new UnauthorizedError().message,
        path: ['signIn'],
      })
    })

    test('sign in successfully', async () => {
      const fakeUserData = makeSignUpInputStub()
      const hashedPasswordStub = await new BcryptAdapter(8).hash({
        plaintext: fakeUserData.password,
      })

      await createUser({
        prisma,
        userPersistence: {
          email: fakeUserData.email,
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

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body).toEqual({
        data: {
          signIn: {
            accessToken: expect.any(String),
          },
        },
      })
    })
  })
})
