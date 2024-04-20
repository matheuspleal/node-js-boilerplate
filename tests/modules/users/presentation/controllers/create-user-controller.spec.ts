import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { left, right } from '@/core/application/either'
import { RequiredError } from '@/core/presentation/validators/errors/required-error'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidBirthdateError } from '@/modules/users/application/errors/invalid-birthdate-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import { type CreateUserUseCase } from '@/modules/users/application/use-cases/create-user-use-case'
import { type UserDTO } from '@/modules/users/contracts/dtos/user-dto'
import {
  type CreateUser,
  CreateUserController,
} from '@/modules/users/presentation/controllers/create-user-controller'

import { makeFakeUserDTOStub } from '#/modules/users/contracts/@mocks/user-dto-stub'
import { makeFakeRequiredInputUserStub } from '#/modules/users/domain/@mocks/input-user-stub'

const listOfFields = ['name', 'email', 'birthdate']

describe('CreateUserController', () => {
  let sut: CreateUserController
  let userDTOStub: UserDTO
  let createUserUseCaseMock: MockProxy<CreateUserUseCase>
  let createUserUseCaseSpy: MockInstance

  beforeAll(() => {
    userDTOStub = makeFakeUserDTOStub()
    createUserUseCaseMock = mock<CreateUserUseCase>()
    createUserUseCaseMock.execute.mockResolvedValue(
      right({
        user: userDTOStub,
      }),
    )
  })

  beforeEach(() => {
    createUserUseCaseSpy = vi.spyOn(createUserUseCaseMock, 'execute')
    sut = new CreateUserController(createUserUseCaseMock)
  })

  it('should be able to return RequiredFieldError when all required fields is not provided', async () => {
    const fakeUserInput = {} as any

    const response = await sut.handle(fakeUserInput)

    expect(createUserUseCaseSpy).toHaveBeenCalledTimes(0)
    expect(response).toMatchObject({
      statusCode: 400,
      body: new RequiredError(listOfFields),
    })
  })

  it.each(listOfFields)(
    'should be able to return RequiredFieldError when "%s" is not provided',
    async (field) => {
      const fakeUserInput = {
        ...makeFakeRequiredInputUserStub(),
      } as any
      fakeUserInput[field] = undefined

      const response = await sut.handle(fakeUserInput)

      expect(createUserUseCaseSpy).toHaveBeenCalledTimes(0)
      expect(response).toMatchObject({
        statusCode: 400,
        body: new RequiredError([field]),
      })
    },
  )

  it('should be able to return EmailAlreadyExistsError when the informed email already exists', async () => {
    const fakeEmailAlreadyExistsError = new EmailAlreadyExistsError(
      userDTOStub.email,
    )
    createUserUseCaseMock.execute.mockResolvedValueOnce(
      left(fakeEmailAlreadyExistsError),
    )

    const fakeUserInput: CreateUser.Request = {
      name: userDTOStub.name,
      email: userDTOStub.email,
      birthdate: userDTOStub.birthdate!.toISOString(),
    }

    const response = await sut.handle(fakeUserInput)

    expect(response).toMatchObject({
      statusCode: 400,
      body: fakeEmailAlreadyExistsError,
    })
  })

  it('should be able to return InvalidEmailError when the informed email is invalid', async () => {
    const fakeInvalidEmailError = new InvalidEmailError(userDTOStub.email)
    createUserUseCaseMock.execute.mockResolvedValueOnce(
      left(fakeInvalidEmailError),
    )

    const fakeUserInput: CreateUser.Request = {
      name: userDTOStub.name,
      email: userDTOStub.email,
      birthdate: userDTOStub.birthdate!.toISOString(),
    }

    const response = await sut.handle(fakeUserInput)

    expect(response).toMatchObject({
      statusCode: 400,
      body: fakeInvalidEmailError,
    })
  })

  it('should be able to return InvalidBirthdateError when the informed birthdate is invalid', async () => {
    const fakeInvalidBirthdateError = new InvalidBirthdateError(
      userDTOStub.birthdate!,
    )
    createUserUseCaseMock.execute.mockResolvedValueOnce(
      left(fakeInvalidBirthdateError),
    )

    const fakeUserInput: CreateUser.Request = {
      name: userDTOStub.name,
      email: userDTOStub.email,
      birthdate: userDTOStub.birthdate!.toISOString(),
    }

    const response = await sut.handle(fakeUserInput)

    expect(response).toMatchObject({
      statusCode: 400,
      body: fakeInvalidBirthdateError,
    })
  })

  it('should be able to return the created user when the user was created successfully', async () => {
    const fakeUserInput: CreateUser.Request = {
      name: userDTOStub.name,
      email: userDTOStub.email,
      birthdate: userDTOStub.birthdate!.toISOString(),
    }

    const response = await sut.handle(fakeUserInput)

    expect(createUserUseCaseSpy).toHaveBeenCalledTimes(1)
    expect(createUserUseCaseSpy).toHaveBeenCalledWith({
      name: userDTOStub.name,
      email: userDTOStub.email,
      birthdate: userDTOStub.birthdate,
    })
    expect(response).toMatchObject({
      statusCode: 201,
      body: {
        user: userDTOStub,
      },
    })
  })
})
