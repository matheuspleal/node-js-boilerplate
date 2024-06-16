import { type PersonEntity } from '@/modules/persons/domain/entities/person-entity'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

export interface CreateUserRepositoryProps {
  person: PersonEntity
  user: UserEntity
}

export interface CreateUserRepository {
  create({ person, user }: CreateUserRepositoryProps): Promise<void>
}
