import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma.repository'
import { PrismaClient } from '@/core/infra/repositories/prisma/generated/client'
import { PersonMapper } from '@/modules/persons/infra/repositories/mappers/person.mapper'
import { type FindUserByEmailRepository } from '@/modules/users/application/repositories/find-user-by-email.repository'
import {
  SaveUserRepositoryInput,
  SaveUserRepositoryOutput,
  type SaveUserRepository,
} from '@/modules/users/application/repositories/save-user.repository'
import { type UserEntity } from '@/modules/users/domain/entities/user.entity'
import { UserMapper } from '@/modules/users/infra/repositories/mappers/user.mapper'

export class UserPrismaRepository
  extends BasePrismaRepository
  implements SaveUserRepository, FindUserByEmailRepository
{
  constructor() {
    super()
  }

  async save({
    person,
    user,
  }: SaveUserRepositoryInput): Promise<SaveUserRepositoryOutput> {
    const [savedPerson, savedUser] = await this.prisma.$transaction(
      async (prisma: PrismaClient) => {
        const savedPerson = await prisma.person.upsert({
          create: {
            ...PersonMapper.toPersistence(person),
          },
          update: {
            ...PersonMapper.toPersistence(person),
          },
          where: {
            id: person.id.toValue(),
          },
        })
        const savedUser = await prisma.user.upsert({
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
        return [savedPerson, savedUser]
      },
    )
    return {
      person: PersonMapper.toDomain(savedPerson),
      user: UserMapper.toDomain(savedUser),
    }
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
}
