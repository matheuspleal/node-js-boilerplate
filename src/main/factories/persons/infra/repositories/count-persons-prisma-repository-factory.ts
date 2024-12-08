import { CountPersonsPrismaRepository } from '@/modules/persons/infra/repositories/count-persons-prisma-repository'

export function makeCountPersonsPrismaRepository() {
  return new CountPersonsPrismaRepository()
}
