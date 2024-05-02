import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { right } from '@/core/application/either'
import { type FetchUsersUseCase } from '@/modules/users/application/use-cases/fetch-users-use-case'
import { type UserDTO } from '@/modules/users/contracts/dtos/user-dto'
import { FetchUsersController } from '@/modules/users/presentation/controllers/fetch-users-controller'

import { makeFakeUserCollectionDTOStub } from '#/modules/users/contracts/@mocks/user-dto-stub'

describe('FetchUsersController', () => {
  let sut: FetchUsersController
  let count: number
  let usersDTOStub: UserDTO[]
  let defaultUsersDTOStub: UserDTO[]
  let fetchUsersUseCaseMock: MockProxy<FetchUsersUseCase>
  let fetchUsersUseCaseSpy: MockInstance

  beforeAll(() => {
    count = 40
    usersDTOStub = makeFakeUserCollectionDTOStub({ length: count })
    defaultUsersDTOStub = usersDTOStub.splice(0, 20)
    fetchUsersUseCaseMock = mock<FetchUsersUseCase>()
    fetchUsersUseCaseMock.execute.mockResolvedValue(
      right({
        count,
        users: defaultUsersDTOStub,
      }),
    )
  })

  beforeEach(() => {
    fetchUsersUseCaseSpy = vi.spyOn(fetchUsersUseCaseMock, 'execute')
    sut = new FetchUsersController(fetchUsersUseCaseMock)
  })

  describe('empty pagination params', () => {
    it('should be able to return count equals 0 and users equal to an empty array when no users exist', async () => {
      fetchUsersUseCaseMock.execute.mockResolvedValueOnce(
        right({
          count: 0,
          users: [],
        }),
      )

      const response = await sut.handle({})

      expect(fetchUsersUseCaseSpy).toHaveBeenCalledTimes(1)
      expect(fetchUsersUseCaseSpy).toHaveBeenCalledWith({
        paginationParams: {
          page: 1,
          limit: 20,
        },
      })
      expect(response).toMatchObject({
        statusCode: 200,
        data: {
          count: 0,
          users: [],
        },
      })
    })

    it('should be able to return count equal to total users and return as many users as possible', async () => {
      const response = await sut.handle({})

      expect(fetchUsersUseCaseSpy).toHaveBeenCalledTimes(1)
      expect(fetchUsersUseCaseSpy).toHaveBeenCalledWith({
        paginationParams: {
          page: 1,
          limit: 20,
        },
      })
      expect(response).toMatchObject({
        statusCode: 200,
        data: {
          count,
          users: defaultUsersDTOStub,
        },
      })
    })
  })

  describe('custom pagination params', () => {
    it('should be able to return count equals 0 and users equal to an empty array when no users exist', async () => {
      fetchUsersUseCaseMock.execute.mockResolvedValueOnce(
        right({
          count: 0,
          users: [],
        }),
      )

      const response = await sut.handle({
        'page[offset]': 2,
        'page[limit]': 20,
      })

      expect(fetchUsersUseCaseSpy).toHaveBeenCalledTimes(1)
      expect(fetchUsersUseCaseSpy).toHaveBeenCalledWith({
        paginationParams: {
          page: 2,
          limit: 20,
        },
      })
      expect(response).toMatchObject({
        statusCode: 200,
        data: {
          count: 0,
          users: [],
        },
      })
    })

    it('should be able to return a count equal to the total users and return as many users as the limit parameter allows', async () => {
      const customEntitiesStub = defaultUsersDTOStub.splice(0, 10)
      fetchUsersUseCaseMock.execute.mockResolvedValueOnce(
        right({
          count,
          users: customEntitiesStub,
        }),
      )

      const response = await sut.handle({
        'page[offset]': 1,
        'page[limit]': 10,
      })

      expect(fetchUsersUseCaseSpy).toHaveBeenCalledTimes(1)
      expect(fetchUsersUseCaseSpy).toHaveBeenCalledWith({
        paginationParams: {
          page: 1,
          limit: 10,
        },
      })
      expect(response).toMatchObject({
        statusCode: 200,
        data: {
          count,
          users: customEntitiesStub,
        },
      })
    })
  })
})
