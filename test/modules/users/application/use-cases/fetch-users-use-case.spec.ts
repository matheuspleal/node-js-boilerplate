import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { type PaginationParams } from '@/core/shared/types/pagination-params'
import { type CountUsersRepository } from '@/modules/users/application/repositories/count-users-repository'
import { type FindManyUsersRepository } from '@/modules/users/application/repositories/find-many-users-repository'
import { FetchUsersUseCase } from '@/modules/users/application/use-cases/fetch-users-use-case'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user-mapper'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

import { makeFakeUserCollectionEntityStub } from '#/modules/users/domain/@mocks/user-entity-stub'

describe('FetchUsersUseCase', () => {
  let sut: FetchUsersUseCase
  let length: number
  let usersEntitiesStub: UserEntity[]
  let defaultEntitiesStub: UserEntity[]
  let countUsersRepositoryMock: MockProxy<CountUsersRepository>
  let countUsersRepositorySpy: MockInstance<[], Promise<number>>
  let findManyUsersRepositoryMock: MockProxy<FindManyUsersRepository>
  let findManyUsersRepositorySpy: MockInstance<
    [paginationParams: PaginationParams],
    Promise<UserEntity[]>
  >

  beforeAll(() => {
    length = 100
    usersEntitiesStub = makeFakeUserCollectionEntityStub({ length })
    countUsersRepositoryMock = mock<CountUsersRepository>()
    countUsersRepositoryMock.count.mockResolvedValue(length)
    findManyUsersRepositoryMock = mock<FindManyUsersRepository>()
    defaultEntitiesStub = usersEntitiesStub.slice(0, 20)
    findManyUsersRepositoryMock.findMany.mockResolvedValue(defaultEntitiesStub)
  })

  beforeEach(() => {
    findManyUsersRepositorySpy = vi.spyOn(
      findManyUsersRepositoryMock,
      'findMany',
    )
    countUsersRepositorySpy = vi.spyOn(countUsersRepositoryMock, 'count')
    sut = new FetchUsersUseCase(
      countUsersRepositoryMock,
      findManyUsersRepositoryMock,
    )
  })

  it('should be able to returns count and a list of first 20 users when paginations params is default', async () => {
    const paginationParams = {
      page: 1,
      limit: 20,
    }

    const result = await sut.execute({ paginationParams })

    expect(countUsersRepositorySpy).toHaveBeenCalledTimes(1)
    expect(countUsersRepositorySpy).toHaveBeenCalledWith()
    expect(findManyUsersRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findManyUsersRepositorySpy).toHaveBeenCalledWith(paginationParams)
    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
    expect(result.value?.count).toEqual(length)
    expect(result.value?.users).toMatchObject(
      UserMapper.toCollectionDTO(defaultEntitiesStub),
    )
  })

  it('should be able to returns count and a list of first 20 users when paginations params is default', async () => {
    const customEntitiesStub = usersEntitiesStub.slice(80, 20)
    findManyUsersRepositoryMock.findMany.mockResolvedValueOnce(
      customEntitiesStub,
    )
    const paginationParams = {
      page: 5,
      limit: 20,
    }

    const result = await sut.execute({ paginationParams })

    expect(countUsersRepositorySpy).toHaveBeenCalledTimes(1)
    expect(countUsersRepositorySpy).toHaveBeenCalledWith()
    expect(findManyUsersRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findManyUsersRepositorySpy).toHaveBeenCalledWith(paginationParams)
    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
    expect(result.value?.count).toEqual(length)
    expect(result.value?.users).toMatchObject(
      UserMapper.toCollectionDTO(customEntitiesStub),
    )
  })
})
