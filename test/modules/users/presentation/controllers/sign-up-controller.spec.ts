import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { left, right } from '@/core/application/either'
import { InvalidPasswordError } from '@/core/presentation/validators/errors/invalid-password-error'
import { RequiredError } from '@/core/presentation/validators/errors/required-error'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite-error'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidBirthdateError } from '@/modules/users/application/errors/invalid-birthdate-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import { type SignUpUseCase } from '@/modules/users/application/use-cases/sign-up-use-case'
import { type UserDTO } from '@/modules/users/contracts/dtos/user-dto'
import {
  SignUpController,
  type SignUp,
} from '@/modules/users/presentation/controllers/sign-up-controller'

import { makeFakeUserDTOStub } from '#/modules/users/contracts/@mocks/user-dto-stub'
import { makeFakeRequiredInputSignUpStub } from '#/modules/users/domain/@mocks/input-sign-up-stub'
import { plaintextPasswordStub } from '#/modules/users/domain/@mocks/password-stub'

const listOfFields = ['name', 'email', 'password', 'birthdate']

describe('SignUpController', () => {
  let sut: SignUpController
  let userDTOStub: UserDTO
  let signUpUseCaseMock: MockProxy<SignUpUseCase>
  let signUpUseCaseSpy: MockInstance

  beforeAll(() => {
    userDTOStub = makeFakeUserDTOStub()
    signUpUseCaseMock = mock<SignUpUseCase>()
    signUpUseCaseMock.execute.mockResolvedValue(
      right({
        user: userDTOStub,
      }),
    )
  })

  beforeEach(() => {
    signUpUseCaseSpy = vi.spyOn(signUpUseCaseMock, 'execute')
    sut = new SignUpController(signUpUseCaseMock)
  })

  it('should be able to return RequiredFieldError when all required fields is not provided', async () => {
    const fakeUserInput = {} as any

    const response = await sut.handle(fakeUserInput)

    expect(signUpUseCaseSpy).toHaveBeenCalledTimes(0)
    expect(response).toMatchObject({
      statusCode: 400,
      data: new ValidationCompositeError([
        ...listOfFields.map(
          (field) => new RequiredError(field, fakeUserInput[field]),
        ),
        new InvalidPasswordError('password'),
      ]),
    })
  })

  it.each(listOfFields)(
    'should be able to return RequiredFieldError when "%s" is not provided',
    async (field) => {
      const fakeUserInput: any = {
        ...makeFakeRequiredInputSignUpStub(),
      }
      fakeUserInput[field] = undefined

      const errors: ValidationError[] = [
        new RequiredError(field, fakeUserInput[field]),
      ]
      if (field === 'password') {
        errors.push(new InvalidPasswordError(field))
      }

      const response = await sut.handle(fakeUserInput)

      expect(signUpUseCaseSpy).toHaveBeenCalledTimes(0)
      expect(response).toMatchObject({
        statusCode: 400,
        data: new ValidationCompositeError(errors),
      })
    },
  )

  it('should be able to return EmailAlreadyExistsError when the informed email already exists', async () => {
    const fakeEmailAlreadyExistsError = new EmailAlreadyExistsError(
      userDTOStub.email,
    )
    signUpUseCaseMock.execute.mockResolvedValueOnce(
      left(fakeEmailAlreadyExistsError),
    )

    const fakeUserInput: SignUp.Request = {
      name: userDTOStub.name,
      email: userDTOStub.email,
      password: plaintextPasswordStub,
      birthdate: userDTOStub.birthdate!.toISOString(),
    }

    const response = await sut.handle(fakeUserInput)

    expect(response).toMatchObject({
      statusCode: 400,
      data: fakeEmailAlreadyExistsError,
    })
  })

  it('should be able to return InvalidEmailError when the informed email is invalid', async () => {
    const fakeInvalidEmailError = new InvalidEmailError(userDTOStub.email)
    signUpUseCaseMock.execute.mockResolvedValueOnce(left(fakeInvalidEmailError))

    const fakeUserInput: SignUp.Request = {
      name: userDTOStub.name,
      email: userDTOStub.email,
      password: plaintextPasswordStub,
      birthdate: userDTOStub.birthdate!.toISOString(),
    }

    const response = await sut.handle(fakeUserInput)

    expect(response).toMatchObject({
      statusCode: 400,
      data: fakeInvalidEmailError,
    })
  })

  it('should be able to return InvalidBirthdateError when the informed birthdate is invalid', async () => {
    const fakeInvalidBirthdateError = new InvalidBirthdateError(
      userDTOStub.birthdate!,
    )
    signUpUseCaseMock.execute.mockResolvedValueOnce(
      left(fakeInvalidBirthdateError),
    )

    const fakeUserInput: SignUp.Request = {
      name: userDTOStub.name,
      email: userDTOStub.email,
      password: plaintextPasswordStub,
      birthdate: userDTOStub.birthdate!.toISOString(),
    }

    const response = await sut.handle(fakeUserInput)

    expect(response).toMatchObject({
      statusCode: 400,
      data: fakeInvalidBirthdateError,
    })
  })

  it('should be able to return the created user when the user was created successfully', async () => {
    const fakeUserInput: SignUp.Request = {
      name: userDTOStub.name,
      email: userDTOStub.email,
      password: plaintextPasswordStub,
      birthdate: userDTOStub.birthdate!.toISOString(),
    }

    const response = await sut.handle(fakeUserInput)

    expect(signUpUseCaseSpy).toHaveBeenCalledTimes(1)
    expect(signUpUseCaseSpy).toHaveBeenCalledWith({
      name: userDTOStub.name,
      password: plaintextPasswordStub,
      email: userDTOStub.email,
      birthdate: userDTOStub.birthdate,
    })
    expect(response).toMatchObject({
      statusCode: 201,
      data: {
        user: userDTOStub,
      },
    })
  })
})
