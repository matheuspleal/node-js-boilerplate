import { FindUserByIdPrismaRepository } from '@/modules/users/infra/repositories/find-user-by-id-prisma-repository'

export function makeFindUserByIdPrismaRepository() {
  return new FindUserByIdPrismaRepository()
}
