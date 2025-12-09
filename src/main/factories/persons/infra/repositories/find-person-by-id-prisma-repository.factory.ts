import { FindPersonByIdPrismaRepository } from '@/modules/persons/infra/repositories/find-person-by-id-prisma-repository'

export function makeFindPersonByIdPrismaRepository() {
  return new FindPersonByIdPrismaRepository()
}
