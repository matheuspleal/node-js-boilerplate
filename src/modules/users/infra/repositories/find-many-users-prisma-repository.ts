import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { resolveOffsetByPageAndLimit } from '@/core/infra/repositories/helpers/resolve-offset-by-pagination-params'
import { type PaginationParams } from '@/core/shared/types/pagination-params'
import { type FindManyUsersRepository } from '@/modules/users/application/repositories/find-many-users-repository'
import { UserMap } from '@/modules/users/contracts/mappers/user-map'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

export class FindManyUsersPrismaRepository
  extends BasePrismaRepository
  implements FindManyUsersRepository
{
  constructor() {
    super()
  }

  async findMany({ page, limit }: PaginationParams): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      skip: resolveOffsetByPageAndLimit({ page, limit }),
      take: limit,
    })
    return UserMap.toCollectionEntity(users)
  }
}
