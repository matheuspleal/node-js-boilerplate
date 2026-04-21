import { DomainEvents } from '@/core/domain/events/domain-events'
import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma.repository'
import { resolveOffsetByPageParams } from '@/core/infra/repositories/helpers/resolve-offset-by-pagination-params'
import { PaginationParams } from '@/core/shared/types/pagination-params.type'
import { type CountUsersRepository } from '@/modules/users/application/repositories/count-users.repository'
import { type FindManyUsersRepository } from '@/modules/users/application/repositories/find-many-users.repository'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email.repository'
import { type FindUserByIdRepository } from '@/modules/users/application/repositories/find-user-by-id.repository'
import { type SaveUserRepository } from '@/modules/users/application/repositories/save-user.repository'
import { type UserEntity } from '@/modules/users/domain/entities/user.entity'
import { UserMapper } from '@/modules/users/infra/repositories/mappers/user.mapper'

export class UserPrismaRepository
  extends BasePrismaRepository
  implements
    SaveUserRepository,
    FindUserByEmailRepository,
    CountUsersRepository,
    FindManyUsersRepository,
    FindUserByIdRepository
{
  constructor() {
    super()
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const savedUser = await this.prisma.user.upsert({
      create: {
        ...UserMapper.toPersistence(user),
      },
      update: {
        ...UserMapper.toPersistence(user),
      },
      where: {
        id: user.id.toValue(),
      },
    })
    await DomainEvents.dispatchEventsForAggregate(user.id)
    return UserMapper.toDomain(savedUser)
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
    return UserMapper.toDomain(user)
  }

  async count(): Promise<number> {
    return this.prisma.user.count()
  }

  async findMany({ number, size }: PaginationParams): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      skip: resolveOffsetByPageParams({ number, size }),
      take: size,
    })
    return UserMapper.toCollectionDomain(users)
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
