import jwt from 'jsonwebtoken'

import {
  type TokenGenerator,
  type TokenGeneratorGateway,
} from '@/core/application/gateways/token/token-generator'
import {
  type TokenVerifier,
  type TokenVerifierGateway,
} from '@/core/application/gateways/token/token-verifier'

export class JwtAdapter implements TokenGeneratorGateway, TokenVerifierGateway {
  private readonly algorithm = 'RS256'

  constructor(
    private readonly privateKey: string,
    private readonly publicKey: string,
  ) {}

  generate({
    payload,
    expiresInMs,
  }: TokenGenerator.Input): TokenGenerator.Output {
    const expiresInSeconds = expiresInMs / 1000
    return jwt.sign(payload, Buffer.from(this.privateKey, 'base64'), {
      algorithm: this.algorithm,
      expiresIn: expiresInSeconds,
    })
  }

  verify({ token }: TokenVerifier.Input): TokenVerifier.Output {
    return jwt.verify(token, Buffer.from(this.publicKey, 'base64'), {
      algorithms: [this.algorithm],
    }) as string
  }
}
