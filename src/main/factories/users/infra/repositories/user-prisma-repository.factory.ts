import { UserPrismaRepository } from '@/modules/users/infra/repositories/user-prisma.repository'

export function makeUserPrismaRepository() {
  return new UserPrismaRepository()
}
