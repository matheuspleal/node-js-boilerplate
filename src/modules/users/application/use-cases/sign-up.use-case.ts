import { type HashGeneratorGateway } from '@/core/application/gateways/cryptography/hash-generator.gateway'
import { type UseCase } from '@/core/application/use-cases/use-case'
import { combine, type Either, left, right } from '@/core/shared/either'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists.error'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email.repository'
import { type SaveUserRepository } from '@/modules/users/application/repositories/save-user.repository'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user.dto'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user.mapper'
import { UserEntity } from '@/modules/users/domain/entities/user.entity'
import { InvalidBirthdateError } from '@/modules/users/domain/errors/invalid-birthdate.error'
import { InvalidEmailError } from '@/modules/users/domain/errors/invalid-email.error'
import { InvalidPasswordError } from '@/modules/users/domain/errors/invalid-password.error'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate.vo'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'
import { PasswordVO } from '@/modules/users/domain/value-objects/password.vo'

export interface SignUpUseCaseInput {
  birthdate: Date
  name: string
  email: string
  password: string
}

export type SignUpUseCaseOutput = Either<
  | EmailAlreadyExistsError
  | InvalidEmailError
  | InvalidBirthdateError
  | InvalidPasswordError,
  {
    user: UserDTO
  }
>

type UserRepository = FindUserByEmailRepository & SaveUserRepository

export class SignUpUseCase implements UseCase<
  SignUpUseCaseInput,
  SignUpUseCaseOutput
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGeneratorGateway: HashGeneratorGateway,
  ) {}

  async execute({
    birthdate,
    name,
    email,
    password,
  }: SignUpUseCaseInput): Promise<SignUpUseCaseOutput> {
    const birthdateResult = BirthdateVO.create({ value: birthdate })
    const emailResult = EmailVO.create({ value: email })
    const passwordResult = PasswordVO.create({ value: password })
    const combinedResults = combine([
      birthdateResult,
      emailResult,
      passwordResult,
    ])
    if (combinedResults.isLeft()) {
      return left(combinedResults.value)
    }
    const [birthdateVO, emailVO] = combinedResults.value
    const foundUser = await this.userRepository.findByEmail(email)
    if (foundUser) {
      return left(new EmailAlreadyExistsError(email))
    }
    const hashedPassword = await this.hashGeneratorGateway.hash({
      plaintext: password,
    })
    const userResult = UserEntity.create({
      name,
      birthdate: birthdateVO,
      email: emailVO,
      password: PasswordVO.reconstitute(hashedPassword),
    })
    if (userResult.isLeft()) {
      return left(userResult.value)
    }
    const user = userResult.value
    const savedUser = await this.userRepository.save(user)
    return right({
      user: UserMapper.toDTO(savedUser),
    })
  }
}
