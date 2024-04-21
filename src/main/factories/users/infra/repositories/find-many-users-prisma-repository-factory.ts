import { FindManyUsersPrismaRepository } from '@/modules/users/infra/repositories/find-many-users-prisma-repository'

export function makeFindManyUsersPrismaRepository() {
  return new FindManyUsersPrismaRepository()
}
