import { type Either, left, right } from '@/core/application/either'
import { type HashGeneratorGateway } from '@/core/application/gateways/cryptography/hash-generator'
import { type UseCase } from '@/core/application/use-cases/use-case'
import { InvalidBirthdateError } from '@/modules/persons/application/errors/invalid-birthdate-error'
import { type PersonDTO } from '@/modules/persons/application/use-cases/dtos/person-dto'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'
import { PersonEntity } from '@/modules/persons/domain/entities/person-entity'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import { type CreateUserRepository } from '@/modules/users/application/repositories/create-user-repository'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email-repository'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user-dto'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user-mapper'
import { UserEntity } from '@/modules/users/domain/entities/user-entity'

export interface SignUpUseCaseInput {
  name: string
  email: string
  password: string
  birthdate: Date
}

export type SignUpUseCaseOutput = Either<
  EmailAlreadyExistsError | InvalidEmailError | InvalidBirthdateError,
  {
    person: PersonDTO
    user: UserDTO
  }
>

export class SignUpUseCase
  implements UseCase<SignUpUseCaseInput, SignUpUseCaseOutput>
{
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
  }: SignUpUseCaseInput): Promise<SignUpUseCaseOutput> {
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
    const result = await this.createUserRepository.create({ person, user })
    return right({
      person: PersonMapper.toDTO(result.person),
      user: UserMapper.toDTO(result.user),
    })
  }
}
