import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { StatusCode } from '@/core/presentation/helpers/http-helpers'
import { appSetup } from '@/main/setup/app-setup'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { generateAccessToken } from '#/main/helpers/generate-access-token'
import { makePersonCollectionPersistenceStub } from '#/modules/persons/infra/@mocks/person-persistence-stub'
import { makeRequiredSignUpInputStub } from '#/modules/users/application/@mocks/sign-up-input-stub'
import { createUser } from '#/modules/users/infra/@helpers/user-persistence-prisma'

describe('PersonsGraphQL', () => {
  let app: FastifyInstance
  let prisma: PrismaClient
  let accessToken: string
  let fetchPersonsQuery: string
  let getPersonByIdQuery: string
  let personId: string

  beforeAll(async () => {
    prisma = new PrismaClient()
    app = await appSetup()
    await app.ready()
    accessToken = await generateAccessToken()
  })

  describe('FetchPersons', async () => {
    beforeAll(async () => {
      const listOfPersons = makePersonCollectionPersistenceStub({
        length: 100,
      })
      await prisma.person.createMany({
        data: [...listOfPersons],
      })
      fetchPersonsQuery = `
        query FetchPersons($params: PaginationParams) {
          fetchPersons(params: $params) {
            count
            persons {
              id
              name
              birthdate
              age
              createdAt
              updatedAt
            }
          }
        }
      `
    })

    test('fetch persons without token', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: fetchPersonsQuery,
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
        path: ['fetchPersons'],
      })
    })

    test('fetch persons with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer fake-invalid-token')
        .send({
          query: fetchPersonsQuery,
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
        path: ['fetchPersons'],
      })
    })

    test('fetch persons with invalid page[offset] and page[limit]', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: fetchPersonsQuery,
          variables: {
            params: {
              offset: -2,
              limit: 99,
            },
          },
        })
      const { count, persons } = body.data.fetchPersons
      const [anyPerson] = persons

      expect(statusCode).toEqual(StatusCode.OK)
      expect(count).toEqual(100)
      expect(persons).toHaveLength(20)
      expect(anyPerson).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        birthdate: expect.stringMatching(ISODateRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })

    test('fetch persons with custom page[offset] and page[limit]', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: fetchPersonsQuery,
          variables: {
            params: {
              offset: 2,
              limit: 10,
            },
          },
        })
      const { count, persons } = body.data.fetchPersons
      const [anyPerson] = persons

      expect(statusCode).toEqual(StatusCode.OK)
      expect(count).toEqual(100)
      expect(persons).toHaveLength(10)
      expect(anyPerson).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        birthdate: expect.stringMatching(ISODateRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })

    test('fetch persons without page[offset] and page[limit]', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: fetchPersonsQuery,
        })
      const { count, persons } = body.data.fetchPersons
      const [anyPerson] = persons

      expect(statusCode).toEqual(StatusCode.OK)
      expect(count).toEqual(100)
      expect(persons).toHaveLength(20)
      expect(anyPerson).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        birthdate: expect.stringMatching(ISODateRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })
  })

  describe('GetPersonById', async () => {
    beforeAll(async () => {
      const listOfPersons = makePersonCollectionPersistenceStub({
        length: 100,
      })
      personId = listOfPersons[9].id
      await prisma.person.createMany({
        data: [...listOfPersons],
      })
      getPersonByIdQuery = `
        query GetPersonById($id: ID!) {
          getPersonById(id: $id) {
            person {
              id
              name
              birthdate
              age
              createdAt
              updatedAt
            }
          }
        }
      `
    })

    test('get person without token', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .send({
          query: getPersonByIdQuery,
          variables: {
            id: personId,
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
        path: ['getPersonById'],
      })
    })

    test('get person with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', 'Bearer fake-invalid-token')
        .send({
          query: getPersonByIdQuery,
          variables: {
            id: personId,
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
        path: ['getPersonById'],
      })
    })

    test('get person without id', async () => {
      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getPersonByIdQuery,
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

    test('get person by invalid id', async () => {
      const invalidId = 'invalid-id'

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getPersonByIdQuery,
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

    test('get person by non existent id', async () => {
      const nonExistentId = randomUUID()

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getPersonByIdQuery,
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
        message: `Person with id "${nonExistentId}" not found!`,
        path: ['getPersonById'],
      })
    })

    test('get person by id', async () => {
      const { name, email, password, birthdate } = makeRequiredSignUpInputStub()
      const birthdateVO = new BirthdateVO({ value: birthdate })
      const { personId } = await createUser({
        prisma,
        personPersistence: {
          name,
          birthdate,
        },
        userPersistence: {
          email,
          password,
        },
      })

      const { statusCode, body } = await request(app.server)
        .post('/api/graphql')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          query: getPersonByIdQuery,
          variables: {
            id: personId,
          },
        })

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body).toMatchObject({
        data: {
          getPersonById: {
            person: {
              id: personId,
              name,
              birthdate: birthdateVO.toString(),
              age: birthdateVO.getCurrentAgeInYears(),
              createdAt: expect.stringMatching(ISODateRegExp),
              updatedAt: expect.stringMatching(ISODateRegExp),
            },
          },
        },
      })
    })
  })
})
