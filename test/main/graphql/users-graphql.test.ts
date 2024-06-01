import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { appSetup } from '@/main/setup/app-setup'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate-vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { generateAccessToken } from '#/main/helpers/generate-access-token'
import { makeFakeRequiredInputSignUpStub } from '#/modules/users/application/@mocks/input-sign-up-stub'
import { makeFakeUserCollectionPersistenceStub } from '#/modules/users/application/@mocks/user-persistence-stub'
import { emailRegExp } from '#/modules/users/domain/@helpers/email-regexp'

describe('UsersGraphQL', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let accessToken: string
  let fetchUsersQuery: string
  let getUserByIdQuery: string
  let userId: string

  beforeAll(async () => {
    prisma = new PrismaClient()
    app = await appSetup()
    await app.ready()
    accessToken = await generateAccessToken(prisma)
  })

  describe('FetchUsers', async () => {
    beforeAll(async () => {
      const listOfUsers = makeFakeUserCollectionPersistenceStub({
        length: 99,
      })
      await prisma.user.createMany({
        data: [...listOfUsers],
      })
      fetchUsersQuery = `
        query FetchUsers($params: PaginationParams) {
          fetchUsers(params: $params) {
            count
            users {
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

    test('fetch users without token', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: fetchUsersQuery,
          variables: {},
        })

      expect(statusCode).toEqual(401)
      expect(body).toMatchObject({
        errors: [
          {
            message: 'Unauthorized.',
            locations: [
              {
                line: 3,
                column: 11,
              },
            ],
            path: ['fetchUsers'],
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        ],
      })
    })

    test('fetch users with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer fake-invalid-token')
        .send({
          query: fetchUsersQuery,
        })

      expect(statusCode).toEqual(401)
      expect(body).toMatchObject({
        errors: [
          {
            message: 'Unauthorized.',
            locations: [
              {
                line: 3,
                column: 11,
              },
            ],
            path: ['fetchUsers'],
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        ],
      })
    })

    test('fetch users with invalid page[offset] and page[limit]', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: fetchUsersQuery,
          variables: {
            params: {
              offset: -2,
              limit: 99,
            },
          },
        })
      const { count, users } = body.data.fetchUsers
      const [anyUser] = users

      expect(statusCode).toEqual(200)
      expect(count).toEqual(100)
      expect(users).toHaveLength(20)
      expect(anyUser).toMatchObject({
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
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: fetchUsersQuery,
          variables: {
            params: {
              offset: 2,
              limit: 10,
            },
          },
        })
      const { count, users } = body.data.fetchUsers
      const [anyUser] = users

      expect(statusCode).toEqual(200)
      expect(count).toEqual(100)
      expect(users).toHaveLength(10)
      expect(anyUser).toMatchObject({
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
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: fetchUsersQuery,
        })
      const { count, users } = body.data.fetchUsers
      const [anyUser] = users

      expect(statusCode).toEqual(200)
      expect(count).toEqual(100)
      expect(users).toHaveLength(20)
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

  describe('GetUserById', async () => {
    beforeAll(async () => {
      const listOfUsers = makeFakeUserCollectionPersistenceStub({
        length: 100,
      })
      userId = listOfUsers[9].id
      await prisma.user.createMany({
        data: [...listOfUsers],
      })
      getUserByIdQuery = `
        query GetUserById($userId: ID!) {
          getUserById(userId: $userId) {
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

    test('get user without token', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: getUserByIdQuery,
          variables: {
            userId,
          },
        })

      expect(statusCode).toEqual(401)
      expect(body).toMatchObject({
        errors: [
          {
            message: 'Unauthorized.',
            locations: [
              {
                line: 3,
                column: 11,
              },
            ],
            path: ['getUserById'],
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        ],
      })
    })

    test('get user with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer fake-invalid-token')
        .send({
          query: getUserByIdQuery,
          variables: {
            userId,
          },
        })

      expect(statusCode).toEqual(401)
      expect(body).toMatchObject({
        errors: [
          {
            message: 'Unauthorized.',
            locations: [
              {
                line: 3,
                column: 11,
              },
            ],
            path: ['getUserById'],
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        ],
      })
    })

    test('get user by invalid id', async () => {
      const invalidId = 'invalid-id'

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getUserByIdQuery,
          variables: {
            userId: invalidId,
          },
        })

      expect(statusCode).toEqual(400)
      expect(body).toMatchObject({
        errors: [
          {
            message: 'The field "id" with value "invalid-id" is invalid id!',
            extensions: {
              code: 'DOMAIN_VALIDATION_ERROR',
            },
          },
        ],
      })
    })

    test('get user by non existent id', async () => {
      const nonExistentId = randomUUID()

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getUserByIdQuery,
          variables: {
            userId: nonExistentId,
          },
        })

      expect(statusCode).toEqual(404)
      expect(body).toMatchObject({
        errors: [
          {
            message: `User with id "${nonExistentId}" not found!`,
            locations: [
              {
                line: 3,
                column: 11,
              },
            ],
            path: ['getUserById'],
            extensions: {
              code: 'NOT_FOUND',
            },
          },
        ],
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
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getUserByIdQuery,
          variables: {
            userId: id,
          },
        })
      const { getUserById } = body.data

      expect(statusCode).toEqual(200)
      expect(getUserById).toMatchObject({
        user: {
          id,
          name,
          email,
          age: new BirthdateVO(birthdate).getCurrentAgeInYears(),
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        },
      })
    })
  })
})
