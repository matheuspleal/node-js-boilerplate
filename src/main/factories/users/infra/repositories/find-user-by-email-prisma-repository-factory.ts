import { FindUserByEmailPrismaRepository } from '@/modules/users/infra/repositories/find-user-by-email-prisma-repository'

export function makeFindUserByEmailPrismaRepository() {
  return new FindUserByEmailPrismaRepository()
}
