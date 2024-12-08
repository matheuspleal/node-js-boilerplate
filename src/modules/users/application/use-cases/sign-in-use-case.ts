import { type Either, left, right } from '@/core/application/either'
import { type HashCompareGateway } from '@/core/application/gateways/cryptography/hash-compare'
import { type TokenGeneratorGateway } from '@/core/application/gateways/token/token-generator'
import { type UseCase } from '@/core/application/use-cases/use-case'
import { UnauthorizedError } from '@/modules/users/application/errors/unauthorized-error'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email-repository'

export interface SignInUseCaseInput {
  email: string
  password: string
}

export type SignInUseCaseOutput = Either<
  UnauthorizedError,
  {
    accessToken: string
  }
>

export class SignInUseCase
  implements UseCase<SignInUseCaseInput, SignInUseCaseOutput>
{
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashCompareGateway: HashCompareGateway,
    private readonly tokenGeneratorGateway: TokenGeneratorGateway,
  ) {}

  async execute({
    email,
    password,
  }: SignInUseCaseInput): Promise<SignInUseCaseOutput> {
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
      expiresInMs: 60 * 1000 * 5,
    })
    return right({
      accessToken: token,
    })
  }
}
