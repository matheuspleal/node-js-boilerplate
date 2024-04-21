import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { type FindUserByIdRepository } from '@/modules/users/application/repositories/find-user-by-id-repository'
import { UserMap } from '@/modules/users/contracts/mappers/user-map'
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
    return UserMap.toEntity(user)
  }
}
