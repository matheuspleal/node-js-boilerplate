import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { type CountPersonsRepository } from '@/modules/persons/application/repositories/count-persons-repository'

export class CountPersonsPrismaRepository
  extends BasePrismaRepository
  implements CountPersonsRepository
{
  constructor() {
    super()
  }

  async count(): Promise<number> {
    return this.prisma.person.count()
  }
}
