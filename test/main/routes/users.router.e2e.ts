import { faker } from '@faker-js/faker'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { UnauthorizedError } from '@/core/application/errors/unauthorized.error'
import { PrismaClient } from '@/core/infra/repositories/prisma/generated/client'
import { PrismaConnectionManager } from '@/core/infra/repositories/prisma/prisma-connection-manager'
import { StatusCode } from '@/core/presentation/helpers/http.helper'
import { appSetup } from '@/main/setup/app.setup'
import { UserNotFoundError } from '@/modules/users/application/errors/user-not-found.error'
import { type UserCollectionDTO } from '@/modules/users/application/use-cases/dtos/user.dto'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate.vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import { generateAccessToken } from '#/main/helpers/generate-access-token.helper'
import { makeRequiredSignUpInputStub } from '#/modules/users/application/@mocks/sign-up-input.stub'
import { createUser } from '#/modules/users/infra/@helpers/user-persistence-prisma'
import { makeUserCollectionPersistenceStub } from '#/modules/users/infra/@mocks/user-persistence.stub'

describe('UsersRouter', () => {
  let prisma: PrismaClient
  let app: FastifyInstance
  let accessToken: string

  beforeAll(async () => {
    prisma = PrismaConnectionManager.getInstance()
    await prisma.user.deleteMany()
    app = await appSetup()
    await app.ready()
    accessToken = await generateAccessToken()
  })

  describe('[GET] /users', async () => {
    beforeAll(async () => {
      await prisma.user.deleteMany()
      const listOfUsers = makeUserCollectionPersistenceStub({
        length: 100,
      })
      await prisma.user.createMany({
        data: [...listOfUsers],
      })
    })

    test('fetch users without token', async () => {
      const { statusCode, body } = await request(app.server).get(
        '/api/v1/users',
      )

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('fetch users with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/users')
        .set('Authorization', 'Bearer fake-invalid-token')

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('fetch users with invalid page[number] and page[size]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          'page[number]': '-2',
          'page[size]': '99',
        })

      const [anyUser] = body.users as UserCollectionDTO

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body.count).toEqual(100)
      expect(body.users).toHaveLength(20)
      expect(anyUser).toEqual({
        id: expect.stringMatching(UUIDRegExp),
        name: expect.any(String),
        birthdate: expect.stringMatching(ISODateRegExp),
        age: expect.any(Number),
        email: expect.any(String),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })

    test('fetch users with custom page[number] and page[size]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          'page[number]': '2',
          'page[size]': '10',
        })

      const [anyUser] = body.users as UserCollectionDTO

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body.count).toEqual(100)
      expect(body.users).toHaveLength(10)
      expect(anyUser).toEqual({
        id: expect.stringMatching(UUIDRegExp),
        name: expect.any(String),
        birthdate: expect.stringMatching(ISODateRegExp),
        age: expect.any(Number),
        email: expect.any(String),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })

    test('fetch users without page[number] and page[size]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${accessToken}`)

      const [anyUser] = body.users as UserCollectionDTO

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body.count).toEqual(100)
      expect(body.users).toHaveLength(20)
      expect(anyUser).toEqual({
        id: expect.stringMatching(UUIDRegExp),
        name: expect.any(String),
        birthdate: expect.stringMatching(ISODateRegExp),
        age: expect.any(Number),
        email: expect.any(String),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })
  })

  describe('[GET] /users/:id', async () => {
    test('get user without token', async () => {
      const { statusCode, body } = await request(app.server).get(
        `/api/v1/users/${faker.string.uuid()}`,
      )

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('get user with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/users/${faker.string.uuid()}`)
        .set('Authorization', 'Bearer fake-invalid-token')

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('get user by invalid id', async () => {
      const invalidId = 'invalid-id'

      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/users/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
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
      const nonExistentId = faker.string.uuid()

      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(statusCode).toEqual(StatusCode.NOT_FOUND)
      expect(body).toEqual({
        error: new UserNotFoundError(nonExistentId).message,
      })
    })

    test('get user by id', async () => {
      const { name, email, password, birthdate } = makeRequiredSignUpInputStub()
      const birthdateVO = BirthdateVO.reconstitute(birthdate)
      const createdUser = await createUser({
        prisma,
        userPersistence: {
          name,
          birthdate,
          email,
          password,
        },
      })

      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/users/${createdUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body.user).toEqual({
        id: createdUser.id,
        name,
        birthdate: birthdateVO.toString(),
        age: birthdateVO.getCurrentAgeInYears(),
        email,
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })
  })
})
