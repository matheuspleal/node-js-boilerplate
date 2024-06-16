import { type Either, left, right } from '@/core/application/either'
import { type HashGeneratorGateway } from '@/core/application/gateways/cryptography/hash-generator'
import { type UseCase } from '@/core/application/use-cases/use-case'
import { InvalidBirthdateError } from '@/modules/persons/application/errors/invalid-birthdate-error'
import { PersonEntity } from '@/modules/persons/domain/entities/person-entity'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import { type CreateUserRepository } from '@/modules/users/application/repositories/create-user-repository'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email-repository'
import { UserEntity } from '@/modules/users/domain/entities/user-entity'

export namespace SignUp {
  export interface Input {
    name: string
    email: string
    password: string
    birthdate: Date
  }

  export type Output = Either<
    EmailAlreadyExistsError | InvalidEmailError | InvalidBirthdateError,
    null
  >
}

export class SignUpUseCase implements UseCase<SignUp.Input, SignUp.Output> {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly createUserRepository: CreateUserRepository,
    private readonly hashGeneratorGateway: HashGeneratorGateway,
  ) {}

  async execute({
    name,
    password,
    email,
    birthdate,
  }: SignUp.Input): Promise<SignUp.Output> {
    const foundUser = await this.findUserByEmailRepository.findByEmail(email)
    if (foundUser) {
      return left(new EmailAlreadyExistsError(email))
    }
    const person = PersonEntity.create({
      name,
      birthdate,
    })
    const user = UserEntity.create({
      personId: person.id,
      email,
      password,
    })
    if (!user.email.isValid()) {
      return left(new InvalidEmailError(email))
    }
    if (!person.birthdate.isValid()) {
      return left(new InvalidBirthdateError(birthdate))
    }
    const hashedPassword = await this.hashGeneratorGateway.hash({
      plaintext: user.password,
    })
    user.password = hashedPassword
    await this.createUserRepository.create({ person, user })
    return right(null)
  }
}
