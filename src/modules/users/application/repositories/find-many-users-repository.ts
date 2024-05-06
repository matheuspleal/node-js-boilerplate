import { type PaginationParams } from '@/core/shared/types/pagination-params'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

export interface FindManyUsersRepository {
  findMany(paginationParams: PaginationParams): Promise<UserEntity[]>
}
