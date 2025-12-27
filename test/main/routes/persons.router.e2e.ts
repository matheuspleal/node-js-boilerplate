import { faker } from '@faker-js/faker'
import { type FastifyInstance } from 'fastify'
import request from 'supertest'

import { PrismaClient } from '@/core/infra/repositories/prisma/generated/client'
import { PrismaConnectionManager } from '@/core/infra/repositories/prisma/prisma-connection-manager'
import { StatusCode } from '@/core/presentation/helpers/http.helper'
import { appSetup } from '@/main/setup/app.setup'
import { PersonNotFoundError } from '@/modules/persons/application/errors/person-not-found.error'
import { UnauthorizedError } from '@/modules/persons/application/errors/unauthorized.error'
import { type PersonPersistenceCollection } from '@/modules/persons/application/repositories/persistence/person.persistence'
import { type PersonCollectionDTO } from '@/modules/persons/application/use-cases/dtos/person.dto'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate.vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'
import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'
import { generateAccessToken } from '#/main/helpers/generate-access-token.helper'
import { createManyPersons } from '#/modules/persons/infra/@helpers/person-persistance-prisma'
import { makePersonCollectionPersistenceStub } from '#/modules/persons/infra/@mocks/person-persistence.stub'
import { makeRequiredSignUpInputStub } from '#/modules/users/application/@mocks/sign-up-input.stub'
import { createUser } from '#/modules/users/infra/@helpers/user-persistence-prisma'

describe('PersonsRouter', () => {
  let prisma: PrismaClient
  let app: FastifyInstance
  let accessToken: string
  let listOfPersons: PersonPersistenceCollection

  beforeAll(async () => {
    prisma = PrismaConnectionManager.getInstance()
    await prisma.user.deleteMany()
    await prisma.person.deleteMany()
    app = await appSetup()
    await app.ready()
    accessToken = await generateAccessToken()
  })

  describe('[GET] /persons', async () => {
    beforeAll(async () => {
      await prisma.user.deleteMany()
      await prisma.person.deleteMany()
      listOfPersons = makePersonCollectionPersistenceStub({
        length: 100,
      })
      await createManyPersons({ prisma, personsPersistence: listOfPersons })
    })

    test('fetch persons without token', async () => {
      const { statusCode, body } = await request(app.server).get(
        '/api/v1/persons',
      )

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('fetch persons with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/persons')
        .set('Authorization', 'Bearer fake-invalid-token')

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('fetch persons with invalid page[number] and page[size]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/persons')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          'page[number]': '-2',
          'page[size]': '99',
        })

      const [anyPerson] = body.persons as PersonCollectionDTO

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body.count).toEqual(100)
      expect(body.persons).toHaveLength(20)
      expect(anyPerson).toEqual({
        id: expect.stringMatching(UUIDRegExp),
        name: expect.any(String),
        birthdate: expect.stringMatching(ISODateRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })

    test('fetch persons with custom page[number] and page[size]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/persons')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          'page[number]': '2',
          'page[size]': '10',
        })

      const [anyPerson] = body.persons as PersonCollectionDTO

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body.count).toEqual(100)
      expect(body.persons).toHaveLength(10)
      expect(anyPerson).toEqual({
        id: expect.stringMatching(UUIDRegExp),
        name: expect.any(String),
        birthdate: expect.stringMatching(ISODateRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })

    test('fetch persons without page[number] and page[size]', async () => {
      const { statusCode, body } = await request(app.server)
        .get('/api/v1/persons')
        .set('Authorization', `Bearer ${accessToken}`)

      const [anyPerson] = body.persons as PersonCollectionDTO

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body.count).toEqual(100)
      expect(body.persons).toHaveLength(20)
      expect(anyPerson).toEqual({
        id: expect.stringMatching(UUIDRegExp),
        name: expect.any(String),
        birthdate: expect.stringMatching(ISODateRegExp),
        age: expect.any(Number),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })
  })

  describe('[GET] /persons/:id', async () => {
    beforeAll(async () => {
      await prisma.user.deleteMany()
      await prisma.person.deleteMany()
      const listOfPersons = makePersonCollectionPersistenceStub({
        length: 100,
      })
      await createManyPersons({
        prisma,
        personsPersistence: listOfPersons,
      })
    })

    test('get person without token', async () => {
      const { statusCode, body } = await request(app.server).get(
        `/api/v1/persons/${faker.string.uuid()}`,
      )

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('get person with invalid token', async () => {
      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/persons/${faker.string.uuid()}`)
        .set('Authorization', 'Bearer fake-invalid-token')

      expect(statusCode).toEqual(StatusCode.UNAUTHORIZED)
      expect(body).toEqual({
        error: new UnauthorizedError().message,
      })
    })

    test('get person by invalid id', async () => {
      const invalidId = 'invalid-id'

      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/persons/${invalidId}`)
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

    test('get person by non existent id', async () => {
      const nonExistentId = faker.string.uuid()

      const { statusCode, body } = await request(app.server)
        .get(`/api/v1/persons/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(statusCode).toEqual(StatusCode.NOT_FOUND)
      expect(body).toEqual({
        error: new PersonNotFoundError(nonExistentId).message,
      })
    })

    test('get person by id', async () => {
      const { name, email, password, birthdate } = makeRequiredSignUpInputStub()
      const birthdateVO = BirthdateVO.create({ value: birthdate })
        .value as BirthdateVO
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
        .get(`/api/v1/persons/${personId}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(statusCode).toEqual(StatusCode.OK)
      expect(body.person).toEqual({
        id: personId,
        name,
        birthdate: birthdateVO.toString(),
        age: birthdateVO.getCurrentAgeInYears(),
        createdAt: expect.stringMatching(ISODateRegExp),
        updatedAt: expect.stringMatching(ISODateRegExp),
      })
    })
  })
})
