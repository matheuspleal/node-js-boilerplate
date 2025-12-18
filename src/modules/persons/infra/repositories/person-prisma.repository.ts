import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma.repository'
import { resolveOffsetByPageParams } from '@/core/infra/repositories/helpers/resolve-offset-by-pagination-params'
import { PaginationParams } from '@/core/shared/types/pagination-params.type'
import { type CountPersonsRepository } from '@/modules/persons/application/repositories/count-persons.repository'
import { type FindManyPersonsRepository } from '@/modules/persons/application/repositories/find-many-persons.repository'
import { type FindPersonByIdRepository } from '@/modules/persons/application/repositories/find-person-by-id.repository'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person.mapper'
import { type PersonEntity } from '@/modules/persons/domain/entities/person.entity'

export class PersonPrismaRepository
  extends BasePrismaRepository
  implements
    CountPersonsRepository,
    FindManyPersonsRepository,
    FindPersonByIdRepository
{
  constructor() {
    super()
  }

  async count(): Promise<number> {
    return this.prisma.person.count()
  }

  async findMany({ number, size }: PaginationParams): Promise<PersonEntity[]> {
    const persons = await this.prisma.person.findMany({
      skip: resolveOffsetByPageParams({ number, size }),
      take: size,
    })
    return PersonMapper.toCollectionDomain(persons)
  }

  async findById(id: string): Promise<PersonEntity | null> {
    const person = await this.prisma.person.findUnique({
      where: {
        id,
      },
    })
    if (!person) {
      return null
    }
    return PersonMapper.toDomain(person)
  }
}
