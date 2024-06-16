import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'
import {
  type CreateUserRepositoryProps,
  type CreateUserRepository,
} from '@/modules/users/application/repositories/create-user-repository'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user-mapper'

export class CreateUserPrismaRepository
  extends BasePrismaRepository
  implements CreateUserRepository
{
  constructor() {
    super()
  }

  async create({ person, user }: CreateUserRepositoryProps): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.person({
        data: {
          ...PersonMapper.toPersistence(person),
        },
      }),
      this.prisma.user.create({
        data: { ...UserMapper.toPersistence(user) },
      }),
    ])
  }
}
