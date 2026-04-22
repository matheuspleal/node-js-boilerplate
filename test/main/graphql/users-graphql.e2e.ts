import { randomUUID } from 'node:crypto'

import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { PrismaClient } from '@/core/infra/repositories/prisma/generated/client'
import { PrismaConnectionManager } from '@/core/infra/repositories/prisma/prisma-connection-manager'
import { StatusCode } from '@/core/presentation/helpers/http.helper'
import { appSetup } from '@/main/setup/app.setup'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate.vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { generateAccessToken } from '#/main/helpers/generate-access-token.helper'
import { makeRequiredSignUpInputStub } from '#/modules/users/application/@mocks/sign-up-input.stub'
import { createUser } from '#/modules/users/infra/@helpers/user-persistence-prisma'
import { makeUserCollectionPersistenceStub } from '#/modules/users/infra/@mocks/user-persistence.stub'

describe('UsersGraphQL', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let accessToken: string
  let fetchUsersQuery: string
  let getUserByIdQuery: string
  let userId: string

  beforeAll(async () => {
    prisma = PrismaConnectionManager.getInstance()
    await prisma.user.deleteMany()
    app = await appSetup()
    await app.ready()
    accessToken = await generateAccessToken()
  })

  describe('FetchUsers', async () => {
    beforeAll(async () => {
      await prisma.user.deleteMany()
      const listOfUsers = makeUserCollectionPersistenceStub({
        length: 100,
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
              birthdate
              age
              email
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

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'UNAUTHORIZED',
        },
        locations: expect.any(Array),
        message: 'Unauthorized.',
        path: ['fetchUsers'],
      })
    })

    test('fetch users with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer fake-invalid-token')
        .send({
          query: fetchUsersQuery,
        })

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'UNAUTHORIZED',
        },
        locations: expect.any(Array),
        message: 'Unauthorized.',
        path: ['fetchUsers'],
      })
    })

    test('fetch users with invalid page[number] and page[size]', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: fetchUsersQuery,
          variables: {
            params: {
              number: -2,
              size: 99,
            },
          },
        })
      const { count, users } = body.data.fetchUsers
      const [anyUser] = users

      expect(statusCode).toEqual(StatusCode.OK)
      expect(count).toEqual(100)
      expect(users).toHaveLength(20)
      expect(anyUser).toMatchObject({
        id: expect.any(String),
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
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: fetchUsersQuery,
          variables: {
            params: {
              number: 2,
              size: 10,
            },
          },
        })
      const { count, users } = body.data.fetchUsers
      const [anyUser] = users

      expect(statusCode).toEqual(StatusCode.OK)
      expect(count).toEqual(100)
      expect(users).toHaveLength(10)
      expect(anyUser).toMatchObject({
        id: expect.any(String),
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
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: fetchUsersQuery,
        })
      const { count, users } = body.data.fetchUsers
      const [anyUser] = users

      expect(statusCode).toEqual(StatusCode.OK)
      expect(count).toEqual(100)
      expect(users).toHaveLength(20)
      expect(anyUser).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        birthdate: expect.stringMatching(ISODateRegExp),
        age: expect.any(Number),
        email: expect.any(String),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })
  })

  describe('GetUserById', async () => {
    beforeAll(async () => {
      await prisma.user.deleteMany()
      const listOfUsers = makeUserCollectionPersistenceStub({
        length: 100,
      })
      userId = listOfUsers[9].id
      await prisma.user.createMany({
        data: [...listOfUsers],
      })
      getUserByIdQuery = `
        query GetUserById($id: ID!) {
          getUserById(id: $id) {
            user {
              id
              name
              birthdate
              age
              email
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
            id: userId,
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
        message: 'Unauthorized.',
        path: ['getUserById'],
      })
    })

    test('get user with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer fake-invalid-token')
        .send({
          query: getUserByIdQuery,
          variables: {
            id: userId,
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
        message: 'Unauthorized.',
        path: ['getUserById'],
      })
    })

    test('get user without id', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getUserByIdQuery,
          variables: {
            id: undefined,
          },
        })

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'BAD_USER_INPUT',
        },
        locations: expect.any(Array),
        message: 'Variable "$id" of required type "ID!" was not provided.',
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
            id: invalidId,
          },
        })

      expect(statusCode).toEqual(StatusCode.BAD_REQUEST)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'DOMAIN_VALIDATION_ERROR',
        },
        message: `The field "id" with value "${invalidId}" is invalid id!`,
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
            id: nonExistentId,
          },
        })

      expect(statusCode).toEqual(StatusCode.NOT_FOUND)
      expect(body.errors).toHaveLength(1)
      const [error] = body.errors
      expect(error).toMatchObject({
        extensions: {
          code: 'NOT_FOUND',
        },
        locations: expect.any(Array),
        message: `User with id "${nonExistentId}" not found!`,
        path: ['getUserById'],
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
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getUserByIdQuery,
          variables: {
            id: createdUser.id,
          },
        })

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body).toMatchObject({
        data: {
          getUserById: {
            user: {
              id: createdUser.id,
              name,
              birthdate: birthdateVO.toString(),
              age: birthdateVO.getCurrentAgeInYears(),
              email,
              createdAt: expect.stringMatching(ISODateRegExp),
              updatedAt: expect.stringMatching(ISODateRegExp),
            },
          },
        },
      })
    })
  })
})
