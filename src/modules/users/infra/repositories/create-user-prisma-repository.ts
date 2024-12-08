import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma-repository'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'
import {
  type CreateUserRepositoryInput,
  type CreateUserRepositoryOutput,
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

  async create({
    person,
    user,
  }: CreateUserRepositoryInput): Promise<CreateUserRepositoryOutput> {
    const [createdPerson, createdUser] = await this.prisma.$transaction(
      async (prisma) => {
        const createdPerson = await prisma.person.create({
          data: {
            ...PersonMapper.toPersistence(person),
          },
        })
        const createdUser = await prisma.user.create({
          data: {
            ...UserMapper.toPersistence(user),
            personId: createdPerson.id,
          },
        })
        return [createdPerson, createdUser]
      },
    )
    return {
      person: PersonMapper.toDomain(createdPerson),
      user: UserMapper.toDomain(createdUser),
    }
  }
}
