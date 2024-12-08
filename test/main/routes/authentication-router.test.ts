import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { BcryptAdapter } from '@/core/infra/gateways/bcrypt-adapter'
import { StatusCode } from '@/core/presentation/helpers/http-helpers'
import { type ValidationComposite } from '@/core/presentation/validators/errors/validation-composite-error'
import { appSetup } from '@/main/setup/app-setup'
import { EmailAlreadyExistsError } from '@/modules/persons/application/errors/email-already-exists-error'
import { InvalidBirthdateError } from '@/modules/persons/application/errors/invalid-birthdate-error'
import { InvalidEmailError } from '@/modules/persons/application/errors/invalid-email-error'
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

describe('AuthenticationRouter', () => {
  let prisma: PrismaClient
  let app: FastifyInstance

  beforeAll(async () => {
    prisma = new PrismaClient()
    app = await appSetup()
    await app.ready()
  })

  describe('[POST] /sign-up', async () => {
    test('sign up with missing all required fields', async () => {
      const fakeUser = {}

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/sign-up')
        .send(fakeUser)

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body).toEqual({
        errors: [
          {
            field: 'name',
            reasons: [
              {
                name: 'RequiredError',
                message: 'The field "name" is required!',
              },
            ],
          },
          {
            field: 'email',
            reasons: [
              {
                name: 'RequiredError',
                message: 'The field "email" is required!',
              },
            ],
          },
          {
            field: 'password',
            reasons: [
              {
                name: 'RequiredError',
                message: 'The field "password" is required!',
              },
              {
                name: 'InvalidPasswordError',
                message:
                  'The field "password" must contain between 8 and 20 characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character!',
              },
            ],
          },
          {
            field: 'birthdate',
            reasons: [
              {
                name: 'RequiredError',
                message: 'The field "birthdate" is required!',
              },
            ],
          },
        ],
      })
    })

    test.each(listOfSignUpFields)(
      'sign up with missing "%s" field',
      async (field) => {
        const reasons: ValidationComposite.Reason[] = [
          {
            name: 'RequiredError',
            message: `The field "${field}" is required!`,
          },
        ]
        if (field === 'password') {
          reasons.push({
            name: 'InvalidPasswordError',
            message: `The field "${field}" must contain between 8 and 20 characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character!`,
          })
        }

        const fakeUser: any = makeRequiredSignUpInputStub()
        fakeUser[field] = undefined

        const { statusCode, body } = await request(app.server)
          .post('/api/v1/sign-up')
          .send(fakeUser)

        expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
        expect(body).toEqual({
          errors: [
            {
              field,
              reasons,
            },
          ],
        })
      },
    )

    test('sign up with invalid email', async () => {
      const { name, password, birthdate } = makeRequiredSignUpInputStub()
      const invalidEmail = 'invalid-email@fake-domain.net'

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/sign-up')
        .send({
          name,
          email: invalidEmail,
          password,
          birthdate,
        })

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body).toEqual({
        error: new InvalidEmailError(invalidEmail).message,
      })
    })

    test('sign up with invalid password', async () => {
      const { name, email, birthdate } = makeRequiredSignUpInputStub()
      const invalidPassword = 'invalid-password'

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/sign-up')
        .send({
          name,
          email,
          password: invalidPassword,
          birthdate,
        })

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body).toEqual({
        errors: [
          {
            field: 'password',
            reasons: [
              {
                name: 'InvalidPasswordError',
                message:
                  'The field "password" must contain between 8 and 20 characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character!',
              },
            ],
          },
        ],
      })
    })

    test('sign up with invalid birthdate', async () => {
      const { name, email, password } = makeRequiredSignUpInputStub()
      const invalidBirthdate = faker.date.future({ years: 1 })

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/sign-up')
        .send({
          name,
          email,
          password,
          birthdate: invalidBirthdate,
        })

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body).toEqual({
        error: new InvalidBirthdateError(invalidBirthdate).message,
      })
    })

    test('sign up with the existent email', async () => {
      const { name, password, birthdate } = makeRequiredSignUpInputStub()
      const { email } = await createUser({ prisma })

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/sign-up')
        .send({
          name,
          email,
          password,
          birthdate,
        })

      expect(statusCode).toEqual(StatusCode.CONFLICT)
      expect(body).toEqual({
        error: new EmailAlreadyExistsError(email).message,
      })
    })

    test('sign up successfully', async () => {
      const { name, email, password, birthdate } = makeRequiredSignUpInputStub()

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/sign-up')
        .send({
          name,
          email,
          password,
          birthdate,
        })

      expect(statusCode).toEqual(StatusCode.CREATED)
      expect(body.user).toEqual({
        id: expect.stringMatching(UUIDRegExp),
        name,
        email,
        birthdate: new BirthdateVO({ value: birthdate }).toString(),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })
  })

  describe('[POST] /sign-in', async () => {
    test('sign in with missing all required fields', async () => {
      const fakeCredentials = {}

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/sign-in')
        .send(fakeCredentials)

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body).toEqual({
        errors: [
          {
            field: 'email',
            reasons: [
              {
                name: 'RequiredError',
                message: 'The field "email" is required!',
              },
            ],
          },
          {
            field: 'password',
            reasons: [
              {
                name: 'RequiredError',
                message: 'The field "password" is required!',
              },
            ],
          },
        ],
      })
    })

    test.each(listOfSignInFields)(
      'sign in with missing "%s" field',
      async (field) => {
        const fakeCredentials: any = makeRequiredSignUpInputStub()
        fakeCredentials[field] = undefined

        const { statusCode, body } = await request(app.server)
          .post('/api/v1/sign-in')
          .send(fakeCredentials)

        expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
        expect(body).toEqual({
          errors: [
            {
              field,
              reasons: [
                {
                  name: 'RequiredError',
                  message: `The field "${field}" is required!`,
                },
              ],
            },
          ],
        })
      },
    )

    test('sign in with incorrect email', async () => {
      const { password } = await createUser({ prisma })
      const incorrectEmail = 'incorrect-email'

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/sign-in')
        .send({
          email: incorrectEmail,
          password,
        })

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('sign in with incorrect password', async () => {
      const { email } = await createUser({ prisma })
      const incorrectPassword = 'incorrect-password'

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/sign-in')
        .send({
          email,
          password: incorrectPassword,
        })

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
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
        .post('/api/v1/sign-in')
        .send({
          email: fakeUserData.email,
          password: fakeUserData.password,
        })

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body).toEqual({
        accessToken: expect.any(String),
      })
    })
  })
})
