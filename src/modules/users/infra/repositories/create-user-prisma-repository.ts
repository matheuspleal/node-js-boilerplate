import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { type CreateUserRepository } from '@/modules/users/application/repositories/create-user-repository'
import { UserMap } from '@/modules/users/contracts/mappers/user-map'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

export class CreateUserPrismaRepository
  extends BasePrismaRepository
  implements CreateUserRepository
{
  constructor() {
    super()
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.prisma.user.create({
      data: { ...UserMap.toPersistence(user) },
    })
    return UserMap.toEntity(createdUser)
  }
}
