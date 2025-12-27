import { type HashGeneratorGateway } from '@/core/application/gateways/cryptography/hash-generator.gateway'
import { type UseCase } from '@/core/application/use-cases/use-case'
import { combine, type Either, left, right } from '@/core/shared/either'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person.mapper'
import { PersonEntity } from '@/modules/persons/domain/entities/person.entity'
import { InvalidBirthdateError } from '@/modules/persons/domain/errors/invalid-birthdate.error'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate.vo'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists.error'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email.repository'
import { type SaveUserRepository } from '@/modules/users/application/repositories/save-user.repository'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user.mapper'
import { UserEntity } from '@/modules/users/domain/entities/user.entity'
import { InvalidEmailError } from '@/modules/users/domain/errors/invalid-email.error'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'

export interface SignUpUseCaseInput {
  birthdate: Date
  name: string
  email: string
  password: string
}

export interface PersonDTO {
  id: string
  name: string
  birthdate: Date
  age: number
  createdAt: Date
  updatedAt: Date
}

export interface UserDTO {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export type SignUpUseCaseOutput = Either<
  EmailAlreadyExistsError | InvalidEmailError | InvalidBirthdateError,
  {
    person: PersonDTO
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
    const combinedResults = combine([birthdateResult, emailResult])
    if (combinedResults.isLeft()) {
      return left(combinedResults.value)
    }
    const [birthdateVO, emailVO] = combinedResults.value
    const foundUser = await this.userRepository.findByEmail(email)
    if (foundUser) {
      return left(new EmailAlreadyExistsError(email))
    }
    const personResult = PersonEntity.create({
      name,
      birthdate: birthdateVO,
    })
    if (personResult.isLeft()) {
      return left(personResult.value)
    }
    const person = personResult.value
    const userResult = UserEntity.create({
      personId: person.id,
      email: emailVO,
      password,
    })
    if (userResult.isLeft()) {
      return left(userResult.value)
    }
    const user = userResult.value
    const hashedPassword = await this.hashGeneratorGateway.hash({
      plaintext: user.password,
    })
    user.password = hashedPassword
    const result = await this.userRepository.save({ person, user })
    return right({
      person: PersonMapper.toDTO(result.person),
      user: UserMapper.toDTO(result.user),
    })
  }
}
