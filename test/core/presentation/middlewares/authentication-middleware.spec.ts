import { type MockInstance } from 'vitest'
import { mock, type MockProxy } from 'vitest-mock-extended'

import {
  type TokenVerifier,
  type TokenVerifierGateway,
} from '@/core/application/gateways/token/token-verifier'
import { StatusCode } from '@/core/presentation/helpers/http-helpers'
import { AuthenticationMiddleware } from '@/core/presentation/middlewares/authentication-middleware'
import { UnauthorizedError } from '@/modules/users/application/errors/unauthorized-error'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

import { makeFakeUserEntityStub } from '#/modules/users/domain/@mocks/user-entity-stub'

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let userEntityStub: UserEntity
  let tokenVerifierGatewayMock: MockProxy<TokenVerifierGateway>
  let tokenVerifierGatewaySpy: MockInstance<
    [input: TokenVerifier.Input],
    TokenVerifier.Output
  >

  beforeAll(() => {
    userEntityStub = makeFakeUserEntityStub()
    tokenVerifierGatewayMock = mock<TokenVerifierGateway>()
    tokenVerifierGatewayMock.verify.mockReturnValue({
      sub: userEntityStub.id.toString(),
    })
  })

  beforeEach(() => {
    tokenVerifierGatewaySpy = vi.spyOn(tokenVerifierGatewayMock, 'verify')
    sut = new AuthenticationMiddleware(tokenVerifierGatewayMock)
  })

  it('should be able to return UnauthorizedError when the token does not have the "Bearer" prefix', async () => {
    tokenVerifierGatewayMock.verify.mockImplementationOnce(() => {
      throw new UnauthorizedError() as any
    })
    const fakeToken = 'fake-token'

    const response = await sut.handle({
      authorization: fakeToken,
    })

    expect(tokenVerifierGatewaySpy).toHaveBeenCalledTimes(1)
    expect(tokenVerifierGatewaySpy).toHaveBeenCalledWith({ token: undefined })
    expect(response).toMatchObject({
      statusCode: StatusCode.UNAUTHORIZED,
      data: new UnauthorizedError(),
    })
  })

  it('should be able to return UnauthorizedError when the token is invalid', async () => {
    tokenVerifierGatewayMock.verify.mockImplementationOnce(() => {
      throw new UnauthorizedError() as any
    })
    const fakeToken = 'Bearer fake-invalid-token'

    const response = await sut.handle({
      authorization: fakeToken,
    })

    expect(tokenVerifierGatewaySpy).toHaveBeenCalledTimes(1)
    expect(tokenVerifierGatewaySpy).toHaveBeenCalledWith({
      token: 'fake-invalid-token',
    })
    expect(response).toMatchObject({
      statusCode: StatusCode.UNAUTHORIZED,
      data: new UnauthorizedError(),
    })
  })

  it('should be able to return UnauthorizedError when the token is expired', async () => {
    tokenVerifierGatewayMock.verify.mockImplementationOnce(() => {
      throw new UnauthorizedError() as any
    })
    const fakeToken = 'Bearer fake-expired-token'

    const response = await sut.handle({
      authorization: fakeToken,
    })

    expect(tokenVerifierGatewaySpy).toHaveBeenCalledTimes(1)
    expect(tokenVerifierGatewaySpy).toHaveBeenCalledWith({
      token: 'fake-expired-token',
    })
    expect(response).toMatchObject({
      statusCode: StatusCode.UNAUTHORIZED,
      data: new UnauthorizedError(),
    })
  })

  it('should be able to return token payload when the token is valid', async () => {
    const fakeToken = 'Bearer fake-valid-token'

    const response = await sut.handle({
      authorization: fakeToken,
    })

    expect(tokenVerifierGatewaySpy).toHaveBeenCalledTimes(1)
    expect(tokenVerifierGatewaySpy).toHaveBeenCalledWith({
      token: 'fake-valid-token',
    })
    expect(response).toMatchObject({
      statusCode: StatusCode.OK,
      data: {
        sub: userEntityStub.id.toString(),
      },
    })
  })
})
