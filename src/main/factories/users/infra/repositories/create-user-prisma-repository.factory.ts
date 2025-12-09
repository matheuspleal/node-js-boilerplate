import { CreateUserPrismaRepository } from '@/modules/users/infra/repositories/create-user-prisma-repository'

export function makeCreateUserPrismaRepository() {
  return new CreateUserPrismaRepository()
}
