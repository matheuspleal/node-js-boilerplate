import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { type FindUserByIdRepository } from '@/modules/users/application/repositories/find-user-by-id-repository'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user-mapper'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

export class FindUserByIdPrismaRepository
  extends BasePrismaRepository
  implements FindUserByIdRepository
{
  constructor() {
    super()
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) {
      return null
    }
    return UserMapper.toDomain(user)
  }
}
