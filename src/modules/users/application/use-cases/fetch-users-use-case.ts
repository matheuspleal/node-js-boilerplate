import { Either, right } from '@/core/application/either'
import { UseCase } from '@/core/application/use-cases/use-case'
import { PaginationParams } from '@/core/shared/types/pagination-params'
import { CountUsersRepository } from '@/modules/users/application/repositories/count-users-repository'
import { FindManyUsersRepository } from '@/modules/users/application/repositories/find-many-users-repository'
import { UserCollectionDTO } from '@/modules/users/contracts/dtos/user-dto'
import { UserMap } from '@/modules/users/contracts/mappers/user-map'

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
      users: UserMap.toCollectionDTO(users),
    })
  }
}
