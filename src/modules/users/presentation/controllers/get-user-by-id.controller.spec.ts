import { faker } from '@faker-js/faker'
import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { StatusCode } from '@/core/presentation/helpers/http.helper'
import { InvalidUUIDError } from '@/core/presentation/validators/errors/invalid-uuid.error'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite.error'
import { left, right } from '@/core/shared/either'
import { UserNotFoundError } from '@/modules/users/application/errors/user-not-found.error'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user.dto'
import { type GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id.use-case'
import { GetUserByIdController } from '@/modules/users/presentation/controllers/get-user-by-id.controller'

import { makeUserDTOStub } from '#/modules/users/application/@mocks/user-dto.stub'

describe('GetUserById', () => {
  let sut: GetUserByIdController
  let userDTOStub: UserDTO
  let getUserByIdUseCaseMock: MockProxy<GetUserByIdUseCase>
  let getUserByIdUseCaseSpy: MockInstance

  beforeAll(() => {
    userDTOStub = makeUserDTOStub()
    getUserByIdUseCaseMock = mock<GetUserByIdUseCase>()
    getUserByIdUseCaseMock.execute.mockResolvedValue(
      right({
        user: userDTOStub,
      }),
    )
  })

  beforeEach(() => {
    getUserByIdUseCaseMock.execute.mockClear()
  })

  beforeEach(() => {
    getUserByIdUseCaseSpy = vi.spyOn(getUserByIdUseCaseMock, 'execute')
    sut = new GetUserByIdController(getUserByIdUseCaseMock)
  })

  it('should be able to return InvalidUUIDError when id is not in uuid format', async () => {
    const invalidId = 'invalid-uuid'

    const response = await sut.handle({
      id: invalidId,
    })

    expect(getUserByIdUseCaseSpy).not.toHaveBeenCalled()
    expect(response).toEqual({
      statusCode: StatusCode.BAD_REQUEST,
      data: new ValidationCompositeError([
        new InvalidUUIDError('id', invalidId),
      ]),
    })
  })

  it('should be able to return UserNotFoundError when user is not found', async () => {
    const id = faker.string.uuid()
    const fakeUserNotFoundError = new UserNotFoundError(id)
    getUserByIdUseCaseMock.execute.mockResolvedValueOnce(
      left(fakeUserNotFoundError),
    )

    const response = await sut.handle({
      id,
    })

    expect(getUserByIdUseCaseSpy).toHaveBeenCalledTimes(1)
    expect(getUserByIdUseCaseSpy).toHaveBeenCalledWith({
      id,
    })
    expect(response).toEqual({
      statusCode: StatusCode.NOT_FOUND,
      data: fakeUserNotFoundError,
    })
  })

  it('should be able to return user when user is found', async () => {
    const id = userDTOStub.id

    const response = await sut.handle({
      id,
    })

    expect(getUserByIdUseCaseSpy).toHaveBeenCalledTimes(1)
    expect(getUserByIdUseCaseSpy).toHaveBeenCalledWith({
      id,
    })
    expect(response).toEqual({
      statusCode: StatusCode.OK,
      data: {
        user: userDTOStub,
      },
    })
  })
})
