import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { type CountUsersRepository } from '@/modules/users/application/repositories/count-users-repository'

export class CountUsersPrismaRepository
  extends BasePrismaRepository
  implements CountUsersRepository
{
  constructor() {
    super()
  }

  async count(): Promise<number> {
    return this.prisma.user.count()
  }
}
