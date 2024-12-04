import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { right } from '@/core/application/either'
import { type PersonCollectionDTO } from '@/modules/persons/application/use-cases/dtos/person-dto'
import { type FetchPersonsUseCase } from '@/modules/persons/application/use-cases/fetch-persons-use-case'
import { FetchPersonsController } from '@/modules/persons/presentation/controllers/fetch-persons-controller'

import { makePersonCollectionDTOStub } from '#/modules/persons/application/@mocks/person-dto-stub'

describe('FetchPersonsController', () => {
  let sut: FetchPersonsController
  let count: number
  let personsDTOStub: PersonCollectionDTO
  let defaultPersonsDTOStub: PersonCollectionDTO
  let fetchPersonsUseCaseMock: MockProxy<FetchPersonsUseCase>
  let fetchPersonsUseCaseSpy: MockInstance

  beforeAll(() => {
    count = 40
    personsDTOStub = makePersonCollectionDTOStub({ length: count })
    defaultPersonsDTOStub = personsDTOStub.splice(0, 20)
    fetchPersonsUseCaseMock = mock<FetchPersonsUseCase>()
    fetchPersonsUseCaseMock.execute.mockResolvedValue(
      right({
        count,
        persons: defaultPersonsDTOStub,
      }),
    )
  })

  beforeEach(() => {
    fetchPersonsUseCaseSpy = vi.spyOn(fetchPersonsUseCaseMock, 'execute')
    sut = new FetchPersonsController(fetchPersonsUseCaseMock)
  })

  describe('Empty Pagination Params', () => {
    it('should be able to return count equals 0 and persons equal to an empty array when no persons exist', async () => {
      fetchPersonsUseCaseMock.execute.mockResolvedValueOnce(
        right({
          count: 0,
          persons: [],
        }),
      )

      const response = await sut.handle({})

      expect(fetchPersonsUseCaseSpy).toHaveBeenCalledTimes(1)
      expect(fetchPersonsUseCaseSpy).toHaveBeenCalledWith({
        paginationParams: {
          page: 1,
          limit: 20,
        },
      })
      expect(response).toEqual({
        statusCode: 200,
        data: {
          count: 0,
          persons: [],
        },
      })
    })

    it('should be able to return count equal to total persons and return as many persons as possible', async () => {
      const response = await sut.handle({})

      expect(fetchPersonsUseCaseSpy).toHaveBeenCalledTimes(1)
      expect(fetchPersonsUseCaseSpy).toHaveBeenCalledWith({
        paginationParams: {
          page: 1,
          limit: 20,
        },
      })
      expect(response).toEqual({
        statusCode: 200,
        data: {
          count,
          persons: defaultPersonsDTOStub,
        },
      })
    })
  })

  describe('Custom Pagination Params', () => {
    it('should be able to return count equals 0 and persons equal to an empty array when no persons exist', async () => {
      fetchPersonsUseCaseMock.execute.mockResolvedValueOnce(
        right({
          count: 0,
          persons: [],
        }),
      )

      const response = await sut.handle({
        'page[offset]': 2,
        'page[limit]': 20,
      })

      expect(fetchPersonsUseCaseSpy).toHaveBeenCalledTimes(1)
      expect(fetchPersonsUseCaseSpy).toHaveBeenCalledWith({
        paginationParams: {
          page: 2,
          limit: 20,
        },
      })
      expect(response).toEqual({
        statusCode: 200,
        data: {
          count: 0,
          persons: [],
        },
      })
    })

    it('should be able to return a count equal to the total persons and return as many persons as the limit parameter allows', async () => {
      const customEntitiesStub = defaultPersonsDTOStub.splice(0, 10)
      fetchPersonsUseCaseMock.execute.mockResolvedValueOnce(
        right({
          count,
          persons: customEntitiesStub,
        }),
      )

      const response = await sut.handle({
        'page[offset]': 1,
        'page[limit]': 10,
      })

      expect(fetchPersonsUseCaseSpy).toHaveBeenCalledTimes(1)
      expect(fetchPersonsUseCaseSpy).toHaveBeenCalledWith({
        paginationParams: {
          page: 1,
          limit: 10,
        },
      })
      expect(response).toEqual({
        statusCode: 200,
        data: {
          count,
          persons: customEntitiesStub,
        },
      })
    })
  })
})
