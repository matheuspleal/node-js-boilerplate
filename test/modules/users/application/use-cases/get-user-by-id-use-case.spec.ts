import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { UserNotFoundError } from '@/modules/users/application/errors/user-not-found-error'
import { type FindUserByIdRepository } from '@/modules/users/application/repositories/find-user-by-id-repository'
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id-use-case'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user-mapper'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

import { makeFakeUserEntityStub } from '#/modules/users/domain/@mocks/user-entity-stub'

describe('GetUserByIdUseCase', () => {
  let sut: GetUserByIdUseCase
  let userEntityStub: UserEntity
  let findUserByIdRepositoryMock: MockProxy<FindUserByIdRepository>
  let findUserByIdRepositorySpy: MockInstance<
    [string],
    Promise<UserEntity | null>
  >

  beforeAll(() => {
    userEntityStub = makeFakeUserEntityStub()
    findUserByIdRepositoryMock = mock<FindUserByIdRepository>()
    findUserByIdRepositoryMock.findById.mockResolvedValue(userEntityStub)
  })

  beforeEach(() => {
    findUserByIdRepositorySpy = vi.spyOn(findUserByIdRepositoryMock, 'findById')
    sut = new GetUserByIdUseCase(findUserByIdRepositoryMock)
  })

  it('should be able to returns UserNotFoundError when user id not found', async () => {
    findUserByIdRepositoryMock.findById.mockResolvedValueOnce(null)
    const id = 'fake-non-existent-id'

    const result = await sut.execute({ id })

    expect(findUserByIdRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByIdRepositorySpy).toHaveBeenCalledWith(id)
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })

  it('should be able to get an user by id', async () => {
    const id = userEntityStub.id.toString()
    const expectedValue = UserMapper.toDTO(userEntityStub)

    const result = await sut.execute({ id })

    expect(findUserByIdRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByIdRepositorySpy).toHaveBeenCalledWith(id)
    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({ user: expectedValue })
  })
})
