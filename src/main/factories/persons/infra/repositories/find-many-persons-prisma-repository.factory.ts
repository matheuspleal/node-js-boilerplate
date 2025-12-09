import { FindManyPersonsPrismaRepository } from '@/modules/persons/infra/repositories/find-many-persons-prisma-repository'

export function makeFindManyPersonsPrismaRepository() {
  return new FindManyPersonsPrismaRepository()
}
