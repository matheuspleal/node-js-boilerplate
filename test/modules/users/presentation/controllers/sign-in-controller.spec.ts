import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { left, right } from '@/core/application/either'
import { StatusCode } from '@/core/presentation/helpers/http-helpers'
import { RequiredError } from '@/core/presentation/validators/errors/required-error'
import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite-error'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'
import { UnauthorizedError } from '@/modules/persons/application/errors/unauthorized-error'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user-dto'
import { type SignInUseCase } from '@/modules/users/application/use-cases/sign-in-use-case'
import {
  SignInController,
  type SignInControllerRequest,
} from '@/modules/users/presentation/controllers/sign-in-controller'

import { makeFakeAccessTokenStub } from '#/core/infra/gateways/@mocks/access-token-stub'
import { plaintextPasswordStub } from '#/modules/users/application/@mocks/password-stub'
import { makeSignInInputStub } from '#/modules/users/application/@mocks/sign-in-input-stub'
import { makeUserDTOStub } from '#/modules/users/application/@mocks/user-dto-stub'

const listOfFields = ['email', 'password']

describe('SignInController', () => {
  let sut: SignInController
  let userDTOStub: UserDTO
  let accessTokenStub: string
  let signInUseCaseMock: MockProxy<SignInUseCase>
  let signInUseCaseSpy: MockInstance

  beforeAll(() => {
    userDTOStub = makeUserDTOStub()
    accessTokenStub = makeFakeAccessTokenStub()
    signInUseCaseMock = mock<SignInUseCase>()
    signInUseCaseMock.execute.mockResolvedValue(
      right({
        accessToken: accessTokenStub,
      }),
    )
  })

  beforeEach(() => {
    signInUseCaseSpy = vi.spyOn(signInUseCaseMock, 'execute')
    sut = new SignInController(signInUseCaseMock)
  })

  it('should be able to return RequiredFieldError when all required fields is not provided', async () => {
    const fakeSignInInput = {} as any

    const response = await sut.handle(fakeSignInInput)

    expect(signInUseCaseSpy).toHaveBeenCalledTimes(0)
    expect(response).toEqual({
      statusCode: StatusCode.BAD_REQUEST,
      data: new ValidationCompositeError([
        ...listOfFields.map(
          (field) => new RequiredError(field, fakeSignInInput[field]),
        ),
      ]),
    })
  })

  it.each(listOfFields)(
    'should be able to return RequiredFieldError when "%s" is not provided',
    async (field) => {
      const fakeSignInInput: any = {
        ...makeSignInInputStub(),
      }
      fakeSignInInput[field] = undefined

      const errors: ValidationError[] = [
        new RequiredError(field, fakeSignInInput[field]),
      ]

      const response = await sut.handle(fakeSignInInput)

      expect(signInUseCaseSpy).toHaveBeenCalledTimes(0)
      expect(response).toEqual({
        statusCode: StatusCode.BAD_REQUEST,
        data: new ValidationCompositeError(errors),
      })
    },
  )

  it.each(listOfFields)(
    'should be able to return UnauthorizedError when the "%s" is incorrect',
    async () => {
      const fakeUnauthorizedError = new UnauthorizedError()
      signInUseCaseMock.execute.mockResolvedValueOnce(
        left(fakeUnauthorizedError),
      )

      const fakeSignInInput: SignInControllerRequest = {
        email: userDTOStub.email,
        password: plaintextPasswordStub,
      }

      const response = await sut.handle(fakeSignInInput)

      expect(response).toEqual({
        statusCode: StatusCode.UNAUTHORIZED,
        data: fakeUnauthorizedError,
      })
    },
  )

  it('should be able to return the genetared accessToken when the sign in is successful', async () => {
    const fakeSignInInput: SignInControllerRequest = {
      email: userDTOStub.email,
      password: plaintextPasswordStub,
    }

    const response = await sut.handle(fakeSignInInput)

    expect(signInUseCaseSpy).toHaveBeenCalledTimes(1)
    expect(signInUseCaseSpy).toHaveBeenCalledWith({
      password: plaintextPasswordStub,
      email: userDTOStub.email,
    })
    expect(response).toEqual({
      statusCode: StatusCode.OK,
      data: {
        accessToken: accessTokenStub,
      },
    })
  })
})
