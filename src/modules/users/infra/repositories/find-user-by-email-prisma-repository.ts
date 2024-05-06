import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email-repository'
import { UserMap } from '@/modules/users/contracts/mappers/user-map'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

export class FindUserByEmailPrismaRepository
  extends BasePrismaRepository
  implements FindUserByEmailRepository
{
  constructor() {
    super()
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (!user) {
      return null
    }
    return UserMap.toEntity(user)
  }
}
