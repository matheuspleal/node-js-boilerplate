import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import {
  type HashCompare,
  type HashCompareGateway,
} from '@/core/application/gateways/cryptography/hash-compare'
import {
  type TokenGenerator,
  type TokenGeneratorGateway,
} from '@/core/application/gateways/token/token-generator'
import { UnauthorizedError } from '@/modules/users/application/errors/unauthorized-error'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email-repository'
import {
  type SignIn,
  SignInUseCase,
} from '@/modules/users/application/use-cases/sign-in-use-case'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

import { makeFakeRequiredInputSignInStub } from '#/modules/users/application/@mocks/input-sign-in-stub'
import { plaintextPasswordStub } from '#/modules/users/application/@mocks/password-stub'
import { makeFakeUserEntityStub } from '#/modules/users/domain/@mocks/user-entity-stub'

describe('SignInUseCase', () => {
  let sut: SignInUseCase
  let userEntityStub: UserEntity
  let fakeToken: string
  let findUserByEmailRepositoryMock: MockProxy<FindUserByEmailRepository>
  let findUserByEmailRepositorySpy: MockInstance<
    [string],
    Promise<UserEntity | null>
  >
  let hashCompareGatewayMock: MockProxy<HashCompareGateway>
  let hashCompareGatewaySpy: MockInstance<
    [input: HashCompare.Input],
    Promise<HashCompare.Output>
  >
  let tokenGeneratorGatewayMock: MockProxy<TokenGeneratorGateway>
  let tokenGeneratorGatewaySpy: MockInstance<
    [input: TokenGenerator.Input],
    TokenGenerator.Output
  >

  beforeAll(() => {
    userEntityStub = makeFakeUserEntityStub()
    fakeToken = 'fake-token'
    findUserByEmailRepositoryMock = mock<FindUserByEmailRepository>()
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValue(userEntityStub)
    hashCompareGatewayMock = mock<HashCompareGateway>()
    hashCompareGatewayMock.compare.mockResolvedValue(true)
    tokenGeneratorGatewayMock = mock<TokenGeneratorGateway>()
    tokenGeneratorGatewayMock.generate.mockReturnValue(fakeToken)
  })

  beforeEach(() => {
    findUserByEmailRepositorySpy = vi.spyOn(
      findUserByEmailRepositoryMock,
      'findByEmail',
    )
    hashCompareGatewaySpy = vi.spyOn(hashCompareGatewayMock, 'compare')
    tokenGeneratorGatewaySpy = vi.spyOn(tokenGeneratorGatewayMock, 'generate')
    sut = new SignInUseCase(
      findUserByEmailRepositoryMock,
      hashCompareGatewayMock,
      tokenGeneratorGatewayMock,
    )
  })

  it('should be able to return UnauthorizedError when the email does not exist', async () => {
    findUserByEmailRepositoryMock.findByEmail.mockResolvedValueOnce(null)
    const email = 'fake-non-existent-email'
    const user: SignIn.Input = {
      ...makeFakeRequiredInputSignInStub(),
      email,
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
    expect(hashCompareGatewaySpy).not.toHaveBeenCalled()
    expect(tokenGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should be able to return UnauthorizedError when the password does not match', async () => {
    hashCompareGatewayMock.compare.mockResolvedValueOnce(false)
    const password = 'fake-incorrect-password'
    const user: SignIn.Input = {
      email: userEntityStub.email.toString(),
      password,
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(user.email)
    expect(hashCompareGatewaySpy).toHaveBeenCalledTimes(1)
    expect(hashCompareGatewaySpy).toHaveBeenCalledWith({
      plaintext: password,
      digest: userEntityStub.password,
    })
    expect(tokenGeneratorGatewaySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })

  it('should be able to return generated token when the credentials are correct', async () => {
    const user: SignIn.Input = {
      email: userEntityStub.email.toString(),
      password: plaintextPasswordStub,
    }

    const result = await sut.execute(user)

    expect(findUserByEmailRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith(user.email)
    expect(hashCompareGatewaySpy).toHaveBeenCalledTimes(1)
    expect(hashCompareGatewaySpy).toHaveBeenCalledWith({
      plaintext: user.password,
      digest: userEntityStub.password,
    })
    expect(tokenGeneratorGatewaySpy).toHaveBeenCalledTimes(1)
    expect(tokenGeneratorGatewaySpy).toHaveBeenCalledWith({
      payload: {
        sub: userEntityStub.id.toString(),
      },
      expiresInMs: 60 * 1000 * 5,
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      accessToken: fakeToken,
    })
  })
})
