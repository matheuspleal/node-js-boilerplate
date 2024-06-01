import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { BcryptAdapter } from '@/core/infra/gateways/bcrypt-adapter'
import { type ValidationComposite } from '@/core/presentation/validators/errors/validation-composite-error'
import { appSetup } from '@/main/setup/app-setup'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidBirthdateError } from '@/modules/users/application/errors/invalid-birthdate-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import { UnauthorizedError } from '@/modules/users/application/errors/unauthorized-error'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate-vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import { makeFakeRequiredInputSignInStub } from '#/modules/users/application/@mocks/input-sign-in-stub'
import {
  makeFakeAllInputSignUpStub,
  makeFakeRequiredInputSignUpStub,
} from '#/modules/users/application/@mocks/input-sign-up-stub'

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

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/signup')
        .send(fakeUser)

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
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

        const fakeUser: any = makeFakeRequiredInputSignUpStub()
        fakeUser[field] = undefined

        const { statusCode, body } = await request(app.server)
          .post('/api/v1/signup')
          .send(fakeUser)

        expect(statusCode).toEqual(400)
        expect(body).toMatchObject({
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
      const { name, password, birthdate } = makeFakeRequiredInputSignUpStub()
      const invalidEmail = 'invalid-email@fake-domain.net'

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/signup')
        .send({
          name,
          email: invalidEmail,
          password,
          birthdate,
        })

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
        error: new InvalidEmailError(invalidEmail).message,
      })
    })

    test('sign up with invalid password', async () => {
      const { name, email, birthdate } = makeFakeRequiredInputSignUpStub()
      const invalidPassword = 'invalid-password'

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/signup')
        .send({
          name,
          email,
          password: invalidPassword,
          birthdate,
        })

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
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
      const { name, email, password } = makeFakeRequiredInputSignUpStub()
      const invalidBirthdate = faker.date.future({ years: 1 })

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/signup')
        .send({
          name,
          email,
          password,
          birthdate: invalidBirthdate,
        })

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
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

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/signup')
        .send({
          name,
          email,
          password,
          birthdate,
        })

      expect(statusCode).toEqual(409)
      expect(body).toMatchObject({
        error: new EmailAlreadyExistsError(email).message,
      })
    })

    test('sign up successfully', async () => {
      const { name, email, password, birthdate } =
        makeFakeRequiredInputSignUpStub()
      const age = new BirthdateVO(birthdate).getCurrentAgeInYears()

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/signup')
        .send({
          name,
          email,
          password,
          birthdate,
        })

      expect(statusCode).toEqual(201)
      expect(body).toMatchObject({
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

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/signin')
        .send(fakeCredentials)

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
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
        const fakeCredentials: any = makeFakeRequiredInputSignInStub()
        fakeCredentials[field] = undefined

        const { statusCode, body } = await request(app.server)
          .post('/api/v1/signin')
          .send(fakeCredentials)

        expect(statusCode).toEqual(400)
        expect(body).toMatchObject({
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
      const { password } = await prisma.user.create({
        data: {
          ...makeFakeRequiredInputSignUpStub(),
        },
      })

      const incorrectEmail = 'incorrect-email'

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/signin')
        .send({
          email: incorrectEmail,
          password,
        })

      expect(statusCode).toEqual(401)
      expect(body).toMatchObject({
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

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/signin')
        .send({
          email,
          password: incorrectPassword,
        })

      expect(statusCode).toEqual(401)
      expect(body).toMatchObject({
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

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/signin')
        .send({
          email: userData.email,
          password: userData.password,
        })

      expect(statusCode).toEqual(200)
      expect(body).toMatchObject({
        accessToken: expect.any(String),
      })
    })
  })
})
