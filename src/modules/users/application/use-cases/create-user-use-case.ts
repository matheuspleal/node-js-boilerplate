import { Either, left, right } from '@/core/application/either'
import { UseCase } from '@/core/application/use-cases/use-case'
import { EmailAlreadyExistsError } from '@/modules/users/application/errors/email-already-exists-error'
import { InvalidBirthdateError } from '@/modules/users/application/errors/invalid-birthdate-error'
import { InvalidEmailError } from '@/modules/users/application/errors/invalid-email-error'
import { CreateUserRepository } from '@/modules/users/application/repositories/create-user-repository'
import { FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email-repository'
import { UserDTO } from '@/modules/users/contracts/dtos/user-dto'
import { UserMap } from '@/modules/users/contracts/mappers/user-map'
import { UserEntity } from '@/modules/users/domain/entities/user-entity'

export namespace CreateUser {
  export interface Input {
    name: string
    email: string
    birthdate: Date
  }

  export type Output = Either<
    EmailAlreadyExistsError | InvalidEmailError | InvalidBirthdateError,
    {
      user: UserDTO
    }
  >
}

export class CreateUserUseCase
  implements UseCase<CreateUser.Input, CreateUser.Output>
{
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly createUserRepository: CreateUserRepository,
  ) {}

  async execute({
    name,
    email,
    birthdate,
  }: CreateUser.Input): Promise<CreateUser.Output> {
    const findUserByEmail =
      await this.findUserByEmailRepository.findByEmail(email)
    if (findUserByEmail) {
      return left(new EmailAlreadyExistsError(email))
    }
    const user = UserEntity.create({
      name,
      email,
      birthdate,
    })
    if (!user.email.isValid()) {
      return left(new InvalidEmailError(email))
    }
    if (!user.birthdate.isValid()) {
      return left(new InvalidBirthdateError(birthdate))
    }
    const createdUser = await this.createUserRepository.create(user)
    return right({
      user: UserMap.toDTO(createdUser),
    })
  }
}
