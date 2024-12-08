import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { resolveOffsetByPageAndLimit } from '@/core/infra/repositories/helpers/resolve-offset-by-pagination-params'
import { type PaginationParams } from '@/core/shared/types/pagination-params'
import { type FindManyPersonsRepository } from '@/modules/persons/application/repositories/find-many-persons-repository'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'
import { type PersonEntity } from '@/modules/persons/domain/entities/person-entity'

export class FindManyPersonsPrismaRepository
  extends BasePrismaRepository
  implements FindManyPersonsRepository
{
  constructor() {
    super()
  }

  async findMany({ page, limit }: PaginationParams): Promise<PersonEntity[]> {
    const persons = await this.prisma.person.findMany({
      skip: resolveOffsetByPageAndLimit({ page, limit }),
      take: limit,
    })
    return PersonMapper.toCollectionDomain(persons)
  }
}
