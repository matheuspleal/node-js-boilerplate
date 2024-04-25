import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { InvalidUUIDError } from '@/core/presentation/validators/errors/invalid-uuid-error'
import { RequiredError } from '@/core/presentation/validators/errors/required-error'
import { appSetup } from '@/main/setup/app-setup'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidBirthdateError } from '@/modules/users/application/errors/invalid-birthdate-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import { UserNotFoundError } from '@/modules/users/application/errors/user-not-found-error'
import { Birthdate } from '@/modules/users/domain/value-objects/birthdate'

import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import { makeFakeRequiredInputUserStub } from '#/modules/users/domain/@mocks/input-user-stub'
import { makeFakeUserCollectionPersistenceStub } from '#/modules/users/domain/@mocks/user-persistence-stub'

const emailRegExp = /^\S+@\S+\.\S+$/
const ISOStringRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

const listOfFields = ['name', 'email', 'birthdate']

describe('UsersRouter', () => {
  let app: FastifyInstance
  let prisma: PrismaClient

  beforeAll(async () => {
    app = await appSetup()
    await app.ready()
  })

  describe('[GET] /users', async () => {
    beforeAll(async () => {
      const listOfUsers = makeFakeUserCollectionPersistenceStub({ length: 100 })
      prisma = new PrismaClient()
      await prisma.user.createMany({
        data: [...listOfUsers],
      })
    })

    test('fetch all users with invalid page[offset] and page[limit]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/users')
        .query({
          'page[offset]': '-2',
          'page[limit]': '50',
        })

      const [anyUser] = body.users

      expect(statusCode).toEqual(200)
      expect(body.count).toEqual(100)
      expect(body.users).toHaveLength(20)
      expect(anyUser).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.stringMatching(emailRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISOStringRegExp),
        updatedAt: expect.stringMatching(ISOStringRegExp),
      })
    })

    test('fetch all users with custom page[offset] and page[limit]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/users')
        .query({
          'page[offset]': '2',
          'page[limit]': '10',
        })

      const [anyUser] = body.users

      expect(statusCode).toEqual(200)
      expect(body.count).toEqual(100)
      expect(body.users).toHaveLength(10)
      expect(anyUser).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.stringMatching(emailRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISOStringRegExp),
        updatedAt: expect.stringMatching(ISOStringRegExp),
      })
    })

    test('fetch all users without page[offset] and page[limit]', async () => {
      const { statusCode, body } = await request(app.server).get(
        '/api/v1/users',
      )
      const [anyUser] = body.users

      expect(statusCode).toEqual(200)
      expect(body.count).toEqual(100)
      expect(body.users).toHaveLength(20)
      expect(anyUser).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.stringMatching(emailRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISOStringRegExp),
        updatedAt: expect.stringMatching(ISOStringRegExp),
      })
    })
  })

  describe('[GET] /users/:id', async () => {
    beforeAll(async () => {
      const listOfUsers = makeFakeUserCollectionPersistenceStub({ length: 100 })
      prisma = new PrismaClient()
      await prisma.user.createMany({
        data: [...listOfUsers],
      })
    })

    test('get user by invalid id', async () => {
      const invalidId = 'invalid-id'

      const { statusCode, body } = await request(app.server).get(
        `/api/v1/users/${invalidId}`,
      )

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
        error: new InvalidUUIDError(['id']).message,
      })
    })

    test('get user by non existent id', async () => {
      const nonExistentId = randomUUID()

      const { statusCode, body } = await request(app.server).get(
        `/api/v1/users/${nonExistentId}`,
      )

      expect(statusCode).toEqual(404)
      expect(body).toMatchObject({
        error: new UserNotFoundError(nonExistentId).message,
      })
    })

    test('get user by id', async () => {
      const { name, email, birthdate } = makeFakeRequiredInputUserStub()
      const { id, createdAt, updatedAt } = await prisma.user.create({
        data: {
          name,
          email,
          birthdate,
        },
      })

      const { statusCode, body } = await request(app.server).get(
        `/api/v1/users/${id}`,
      )

      expect(statusCode).toEqual(200)
      expect(body).toMatchObject({
        user: {
          id,
          name,
          email,
          age: new Birthdate(birthdate).getCurrentAgeInYears(),
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        },
      })
    })
  })

  describe('[POST] /users', async () => {
    test('create a new user with missing all required fields', async () => {
      const fakeUser = {}

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/users')
        .send(fakeUser)

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
        error: new RequiredError(listOfFields).message,
      })
    })

    test.each(listOfFields)(
      'create a new user with missing "%s" field',
      async (field) => {
        const fakeUser: any = makeFakeRequiredInputUserStub()
        fakeUser[field] = undefined

        const { statusCode, body } = await request(app.server)
          .post('/api/v1/users')
          .send(fakeUser)

        expect(statusCode).toEqual(400)
        expect(body).toMatchObject({
          error: new RequiredError([field]).message,
        })
      },
    )

    test('create a new user with invalid email', async () => {
      const { name, birthdate } = makeFakeRequiredInputUserStub()
      const invalidEmail = 'invalid-email@fake-domain.net'

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/users')
        .send({
          name,
          email: invalidEmail,
          birthdate,
        })

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
        error: new InvalidEmailError(invalidEmail).message,
      })
    })

    test('create a new user with invalid birthdate', async () => {
      const { name, email } = makeFakeRequiredInputUserStub()
      const invalidBirthdate = faker.date.future({ years: 1 })

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/users')
        .send({
          name,
          email,
          birthdate: invalidBirthdate,
        })

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
        error: new InvalidBirthdateError(invalidBirthdate).message,
      })
    })

    test('create a new user with the existent email', async () => {
      const { name, email, birthdate } = makeFakeRequiredInputUserStub()
      await prisma.user.create({
        data: {
          name,
          email,
          birthdate,
        },
      })

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/users')
        .send({
          name,
          email,
          birthdate,
        })

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
        error: new EmailAlreadyExistsError(email).message,
      })
    })

    test('create a new user successfully', async () => {
      const { name, email, birthdate } = makeFakeRequiredInputUserStub()
      const age = new Birthdate(birthdate).getCurrentAgeInYears()

      const { statusCode, body } = await request(app.server)
        .post('/api/v1/users')
        .send({
          name,
          email,
          birthdate,
        })

      expect(statusCode).toEqual(201)
      expect(body).toMatchObject({
        user: {
          id: expect.stringMatching(UUIDRegExp),
          name,
          email,
          age,
          createdAt: expect.stringMatching(ISOStringRegExp),
          updatedAt: expect.stringMatching(ISOStringRegExp),
        },
      })
    })
  })
})
