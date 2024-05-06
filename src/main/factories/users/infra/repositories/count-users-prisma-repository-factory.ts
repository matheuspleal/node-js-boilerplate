import { CountUsersPrismaRepository } from '@/modules/users/infra/repositories/count-users-prisma-repository'

export function makeCountUsersPrismaRepository() {
  return new CountUsersPrismaRepository()
}
