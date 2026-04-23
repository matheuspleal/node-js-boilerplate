import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { StatusCode } from '@/core/presentation/helpers/http.helper'
import { right } from '@/core/shared/either'
import { type UserCollectionDTO } from '@/modules/users/application/use-cases/dtos/user.dto'
import { type FetchUsersUseCase } from '@/modules/users/application/use-cases/fetch-users.use-case'
import { FetchUsersController } from '@/modules/users/presentation/controllers/fetch-users.controller'

import { makeUserCollectionDTOStub } from '#/modules/users/application/@mocks/user-dto.stub'

describe('FetchUsersController', () => {
  let sut: FetchUsersController
  let count: number
  let usersDTOStub: UserCollectionDTO
  let defaultUsersDTOStub: UserCollectionDTO
  let fetchUsersUseCaseMock: MockProxy<FetchUsersUseCase>
  let fetchUsersUseCaseSpy: MockInstance

  beforeAll(() => {
    count = 40
    usersDTOStub = makeUserCollectionDTOStub({ length: count })
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
    fetchUsersUseCaseMock.execute.mockClear()
  })

  beforeEach(() => {
    fetchUsersUseCaseSpy = vi.spyOn(fetchUsersUseCaseMock, 'execute')
    sut = new FetchUsersController(fetchUsersUseCaseMock)
  })

  describe('Empty Pagination Params', () => {
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
          number: 1,
          size: 20,
        },
      })
      expect(response).toEqual({
        statusCode: StatusCode.OK,
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
          number: 1,
          size: 20,
        },
      })
      expect(response).toEqual({
        statusCode: StatusCode.OK,
        data: {
          count,
          users: defaultUsersDTOStub,
        },
      })
    })
  })

  describe('Custom Pagination Params', () => {
    it('should be able to return count equals 0 and users equal to an empty array when no users exist', async () => {
      fetchUsersUseCaseMock.execute.mockResolvedValueOnce(
        right({
          count: 0,
          users: [],
        }),
      )

      const response = await sut.handle({
        'page[number]': 2,
        'page[size]': 20,
      })

      expect(fetchUsersUseCaseSpy).toHaveBeenCalledTimes(1)
      expect(fetchUsersUseCaseSpy).toHaveBeenCalledWith({
        paginationParams: {
          number: 2,
          size: 20,
        },
      })
      expect(response).toEqual({
        statusCode: StatusCode.OK,
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
        'page[number]': 1,
        'page[size]': 10,
      })

      expect(fetchUsersUseCaseSpy).toHaveBeenCalledTimes(1)
      expect(fetchUsersUseCaseSpy).toHaveBeenCalledWith({
        paginationParams: {
          number: 1,
          size: 10,
        },
      })
      expect(response).toEqual({
        statusCode: StatusCode.OK,
        data: {
          count,
          users: customEntitiesStub,
        },
      })
    })
  })
})
