import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { type FindPersonByIdRepository } from '@/modules/persons/application/repositories/find-person-by-id-repository'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'
import { type PersonEntity } from '@/modules/persons/domain/entities/person-entity'

export class FindPersonByIdPrismaRepository
  extends BasePrismaRepository
  implements FindPersonByIdRepository
{
  constructor() {
    super()
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
