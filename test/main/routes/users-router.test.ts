import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { InvalidUUIDError } from '@/core/presentation/validators/errors/invalid-uuid-error'
import { appSetup } from '@/main/setup/app-setup'
import { UserNotFoundError } from '@/modules/users/application/errors/user-not-found-error'
import { Birthdate } from '@/modules/users/domain/value-objects/birthdate'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { emailRegExp } from '#/modules/users/domain/@helpers/email-regexp'
import { makeFakeRequiredInputSignUpStub } from '#/modules/users/domain/@mocks/input-sign-up-stub'
import { makeFakeUserCollectionPersistenceStub } from '#/modules/users/domain/@mocks/user-persistence-stub'

describe('UsersRouter', () => {
  let app: FastifyInstance
  let prisma: PrismaClient

  beforeAll(async () => {
    prisma = new PrismaClient()
    app = await appSetup()
    await app.ready()
  })

  describe('[GET] /users', async () => {
    beforeAll(async () => {
      const listOfUsers = makeFakeUserCollectionPersistenceStub({
        length: 100,
      })
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
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
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
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
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
})
