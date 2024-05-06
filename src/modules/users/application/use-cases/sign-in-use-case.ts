import { type Either, left, right } from '@/core/application/either'
import { type HashCompareGateway } from '@/core/application/gateways/cryptography/hash-compare'
import { type TokenGeneratorGateway } from '@/core/application/gateways/token/token-generator'
import { type UseCase } from '@/core/application/use-cases/use-case'
import { UnauthorizedError } from '@/modules/users/application/errors/unauthorized-error'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email-repository'

export namespace SignIn {
  export interface Input {
    email: string
    password: string
  }

  export type Output = Either<
    UnauthorizedError,
    {
      token: string
    }
  >
}

export class SignInUseCase implements UseCase<SignIn.Input, SignIn.Output> {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashCompareGateway: HashCompareGateway,
    private readonly tokenGeneratorGateway: TokenGeneratorGateway,
  ) {}

  async execute({ email, password }: SignIn.Input): Promise<SignIn.Output> {
    const foundUser = await this.findUserByEmailRepository.findByEmail(email)
    if (!foundUser) {
      return left(new UnauthorizedError())
    }
    const passwordMatch = await this.hashCompareGateway.compare({
      plaintext: password,
      digest: foundUser.password,
    })
    if (!passwordMatch) {
      return left(new UnauthorizedError())
    }
    const token = this.tokenGeneratorGateway.generate({
      payload: {
        sub: foundUser.id.toString(),
      },
      expiresInMs: 5 * 60000,
    })
    return right({
      token,
    })
  }
}
