import { type UseCase } from '@/core/application/use-cases/use-case'
import { type Either, right } from '@/core/shared/either'
import { type PaginationParams } from '@/core/shared/types/pagination-params.type'
import { type CountUsersRepository } from '@/modules/users/application/repositories/count-users.repository'
import { type FindManyUsersRepository } from '@/modules/users/application/repositories/find-many-users.repository'
import { type UserCollectionDTO } from '@/modules/users/application/use-cases/dtos/user.dto'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user.mapper'

export interface FetchUsersUseCaseInput {
  paginationParams: PaginationParams
}

export type FetchUsersUseCaseOutput = Either<
  never,
  {
    count: number
    users: UserCollectionDTO
  }
>

export class FetchUsersUseCase implements UseCase<
  FetchUsersUseCaseInput,
  FetchUsersUseCaseOutput
> {
  constructor(
    private readonly userRepository: CountUsersRepository &
      FindManyUsersRepository,
  ) {}

  async execute({
    paginationParams,
  }: FetchUsersUseCaseInput): Promise<FetchUsersUseCaseOutput> {
    const [count, users] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.findMany(paginationParams),
    ])
    return right({
      count,
      users: UserMapper.toCollectionDTO(users),
    })
  }
}
