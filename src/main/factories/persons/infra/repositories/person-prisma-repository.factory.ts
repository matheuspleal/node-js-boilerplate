import { PersonPrismaRepository } from '@/modules/persons/infra/repositories/person-prisma.repository'

export function makePersonPrismaRepository() {
  return new PersonPrismaRepository()
}
