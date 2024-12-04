import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { appSetup } from '@/main/setup/app-setup'
import { UnauthorizedError } from '@/modules/persons/application/errors/unauthorized-error'
import { UserNotFoundError } from '@/modules/persons/application/errors/user-not-found-error'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { generateAccessToken } from '#/main/helpers/generate-access-token'
import { makeFakeRequiredInputSignUpStub } from '#/modules/users/application/@mocks/input-sign-up-stub'
import { makeFakeUserCollectionPersistenceStub } from '#/modules/users/application/@mocks/user-persistence-stub'
import { emailRegExp } from '#/modules/users/domain/@helpers/email-regexp'

describe('UsersRouter', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let accessToken: string

  beforeAll(async () => {
    prisma = new PrismaClient()
    app = await appSetup()
    await app.ready()
    accessToken = await generateAccessToken(prisma)
  })

  describe('[GET] /users', async () => {
    beforeAll(async () => {
      const listOfUsers = makeFakeUserCollectionPersistenceStub({
        length: 99,
      })
      await prisma.user.createMany({
        data: [...listOfUsers],
      })
    })

    test('fetch users without token', async () => {
      const { statusCode, body } = await request(app.server).get(
        '/api/v1/users',
      )

      expect(statusCode).toEqual(401)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('fetch users with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/users')
        .set('Authorization', 'Bearer fake-invalid-token')

      expect(statusCode).toEqual(401)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('fetch users with invalid page[offset] and page[limit]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          'page[offset]': '-2',
          'page[limit]': '99',
        })

      const [anyUser] = body.users

      expect(statusCode).toEqual(200)
      expect(body.count).toEqual(100)
      expect(body.users).toHaveLength(20)
      expect(anyUser).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.stringMatching(emailRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })

    test('fetch users with custom page[offset] and page[limit]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          'page[offset]': '2',
          'page[limit]': '10',
        })

      const [anyUser] = body.users

      expect(statusCode).toEqual(200)
      expect(body.count).toEqual(100)
      expect(body.users).toHaveLength(10)
      expect(anyUser).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.stringMatching(emailRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })

    test('fetch users without page[offset] and page[limit]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${accessToken}`)
      const [anyUser] = body.users

      expect(statusCode).toEqual(200)
      expect(body.count).toEqual(100)
      expect(body.users).toHaveLength(20)
      expect(anyUser).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.stringMatching(emailRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })
  })

  describe('[GET] /users/:id', async () => {
    beforeAll(async () => {
      const listOfUsers = makeFakeUserCollectionPersistenceStub({
        length: 100,
      })
      await prisma.user.createMany({
        data: [...listOfUsers],
      })
    })

    test('get user without token', async () => {
      const { statusCode, body } = await request(app.server).get(
        `/api/v1/users/${faker.string.uuid()}`,
      )

      expect(statusCode).toEqual(401)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('get user with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/users/${faker.string.uuid()}`)
        .set('Authorization', 'Bearer fake-invalid-token')

      expect(statusCode).toEqual(401)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('get user by invalid id', async () => {
      const invalidId = 'invalid-id'

      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/users/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(statusCode).toEqual(400)
      expect(body).toEqual({
        errors: [
          {
            field: 'id',
            value: 'invalid-id',
            reasons: [
              {
                name: 'InvalidUUIDError',
                message:
                  'The field "id" with value "invalid-id" is invalid id!',
              },
            ],
          },
        ],
      })
    })

    test('get user by non existent id', async () => {
      const nonExistentId = randomUUID()

      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(statusCode).toEqual(404)
      expect(body).toEqual({
        error: new UserNotFoundError(nonExistentId).message,
      })
    })

    test('get user by id', async () => {
      const { name, email, password, birthdate } =
        makeFakeRequiredInputSignUpStub()
      const { id, createdAt, updatedAt } = await prisma.user.create({
        data: {
          name,
          email,
          password,
          birthdate,
        },
      })

      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(statusCode).toEqual(200)
      expect(body).toEqual({
        user: {
          id,
          name,
          email,
          age: new BirthdateVO({ value: birthdate }).getCurrentAgeInYears(),
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        },
      })
    })
  })
})
