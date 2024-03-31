import { PaginationParams } from '@/core/shared/types/pagination-params'
import { UserEntity } from '@/modules/users/domain/entities/user-entity'

export interface FindManyUsersRepository {
  findMany(paginationParams: PaginationParams): Promise<UserEntity[]>
}
