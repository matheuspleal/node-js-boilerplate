import { type Either, left, right } from '@/core/application/either'
import { type UseCase } from '@/core/application/use-cases/use-case'
import { UserNotFoundError } from '@/modules/users/application/errors/user-not-found-error'
import { type FindUserByIdRepository } from '@/modules/users/application/repositories/find-user-by-id-repository'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user-dto'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user-mapper'

export namespace GetUserById {
  export interface Input {
    id: string
  }

  export type Output = Either<
    UserNotFoundError,
    {
      user: UserDTO
    }
  >
}

export class GetUserByIdUseCase
  implements UseCase<GetUserById.Input, GetUserById.Output>
{
  constructor(
    private readonly findUserByIdRepository: FindUserByIdRepository,
  ) {}

  async execute({ id }: GetUserById.Input): Promise<GetUserById.Output> {
    const user = await this.findUserByIdRepository.findById(id)
    if (!user) {
      return left(new UserNotFoundError(id))
    }
    return right({
      user: UserMapper.toDTO(user),
    })
  }
}
