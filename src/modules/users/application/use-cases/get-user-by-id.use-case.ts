import { type UseCase } from '@/core/application/use-cases/use-case'
import { type Either, left, right } from '@/core/shared/either'
import { UserNotFoundError } from '@/modules/users/application/errors/user-not-found.error'
import { type FindUserByIdRepository } from '@/modules/users/application/repositories/find-user-by-id.repository'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user.dto'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user.mapper'

export interface GetUserByIdUseCaseInput {
  id: string
}

export type GetUserByIdUseCaseOutput = Either<
  UserNotFoundError,
  {
    user: UserDTO
  }
>

export class GetUserByIdUseCase implements UseCase<
  GetUserByIdUseCaseInput,
  GetUserByIdUseCaseOutput
> {
  constructor(
    private readonly findUserByIdRepository: FindUserByIdRepository,
  ) {}

  async execute({
    id,
  }: GetUserByIdUseCaseInput): Promise<GetUserByIdUseCaseOutput> {
    const user = await this.findUserByIdRepository.findById(id)
    if (!user) {
      return left(new UserNotFoundError(id))
    }
    return right({
      user: UserMapper.toDTO(user),
    })
  }
}
