import { type PaginationParams } from '@/core/shared/types/pagination-params'
import { type PersonEntity } from '@/modules/persons/domain/entities/person-entity'

export interface FindManyPersonsRepository {
  findMany(paginationParams: PaginationParams): Promise<PersonEntity[]>
}
