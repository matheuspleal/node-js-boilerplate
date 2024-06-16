import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { type PaginationParams } from '@/core/shared/types/pagination-params'
import { type CountPersonsRepository } from '@/modules/persons/application/repositories/count-persons-repository'
import { type FindManyPersonsRepository } from '@/modules/persons/application/repositories/find-many-persons-repository'
import { FetchPersonsUseCase } from '@/modules/persons/application/use-cases/fetch-persons-use-case'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'
import { type PersonEntity } from '@/modules/persons/domain/entities/person-entity'

import { makeFakePersonCollectionEntityStub } from '#/modules/persons/domain/@mocks/person-entity-stub'

describe('FetchPersonsUseCase', () => {
  let sut: FetchPersonsUseCase
  let length: number
  let personsEntitiesStub: PersonEntity[]
  let defaultEntitiesStub: PersonEntity[]
  let countPersonsRepositoryMock: MockProxy<CountPersonsRepository>
  let countPersonsRepositorySpy: MockInstance<[], Promise<number>>
  let findManyPersonsRepositoryMock: MockProxy<FindManyPersonsRepository>
  let findManyPersonsRepositorySpy: MockInstance<
    [paginationParams: PaginationParams],
    Promise<PersonEntity[]>
  >

  beforeAll(() => {
    length = 100
    personsEntitiesStub = makeFakePersonCollectionEntityStub({ length })
    countPersonsRepositoryMock = mock<CountPersonsRepository>()
    countPersonsRepositoryMock.count.mockResolvedValue(length)
    findManyPersonsRepositoryMock = mock<FindManyPersonsRepository>()
    defaultEntitiesStub = personsEntitiesStub.slice(0, 20)
    findManyPersonsRepositoryMock.findMany.mockResolvedValue(
      defaultEntitiesStub,
    )
  })

  beforeEach(() => {
    findManyPersonsRepositorySpy = vi.spyOn(
      findManyPersonsRepositoryMock,
      'findMany',
    )
    countPersonsRepositorySpy = vi.spyOn(countPersonsRepositoryMock, 'count')
    sut = new FetchPersonsUseCase(
      countPersonsRepositoryMock,
      findManyPersonsRepositoryMock,
    )
  })

  it('should be able to returns count and a list of first 20 persons when paginations params is default', async () => {
    const paginationParams = {
      page: 1,
      limit: 20,
    }

    const result = await sut.execute({ paginationParams })

    expect(countPersonsRepositorySpy).toHaveBeenCalledTimes(1)
    expect(countPersonsRepositorySpy).toHaveBeenCalledWith()
    expect(findManyPersonsRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findManyPersonsRepositorySpy).toHaveBeenCalledWith(paginationParams)
    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
    expect(result.value?.count).toEqual(length)
    expect(result.value?.persons).toMatchObject(
      PersonMapper.toCollectionDTO(defaultEntitiesStub),
    )
  })

  it('should be able to returns count and a list of first 20 persons when paginations params is default', async () => {
    const customEntitiesStub = personsEntitiesStub.slice(80, 20)
    findManyPersonsRepositoryMock.findMany.mockResolvedValueOnce(
      customEntitiesStub,
    )
    const paginationParams = {
      page: 5,
      limit: 20,
    }

    const result = await sut.execute({ paginationParams })

    expect(countPersonsRepositorySpy).toHaveBeenCalledTimes(1)
    expect(countPersonsRepositorySpy).toHaveBeenCalledWith()
    expect(findManyPersonsRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findManyPersonsRepositorySpy).toHaveBeenCalledWith(paginationParams)
    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
    expect(result.value?.count).toEqual(length)
    expect(result.value?.persons).toMatchObject(
      PersonMapper.toCollectionDTO(customEntitiesStub),
    )
  })
})
