import { type Either, right } from '@/core/application/either'
import { type UseCase } from '@/core/application/use-cases/use-case'
import { type PaginationParams } from '@/core/shared/types/pagination-params'
import { type CountUsersRepository } from '@/modules/users/application/repositories/count-users-repository'
import { type FindManyUsersRepository } from '@/modules/users/application/repositories/find-many-users-repository'
import { type UserCollectionDTO } from '@/modules/users/application/use-cases/dtos/user-dto'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user-mapper'

export namespace FetchUsers {
  export interface Input {
    paginationParams: PaginationParams
  }

  export type Output = Either<
    null,
    {
      count: number
      users: UserCollectionDTO
    }
  >
}

export class FetchUsersUseCase
  implements UseCase<FetchUsers.Input, FetchUsers.Output>
{
  constructor(
    private readonly countUsersRepository: CountUsersRepository,
    private readonly findManyUsersRepository: FindManyUsersRepository,
  ) {}

  async execute({
    paginationParams,
  }: FetchUsers.Input): Promise<FetchUsers.Output> {
    const [count, users] = await Promise.all([
      this.countUsersRepository.count(),
      this.findManyUsersRepository.findMany(paginationParams),
    ])
    return right({
      count,
      users: UserMapper.toCollectionDTO(users),
    })
  }
}
