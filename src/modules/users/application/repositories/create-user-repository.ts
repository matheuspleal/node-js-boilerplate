import { type PersonEntity } from '@/modules/persons/domain/entities/person-entity'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

export interface CreateUserRepositoryInput {
  person: PersonEntity
  user: UserEntity
}

export interface CreateUserRepositoryOutput {
  person: PersonEntity
  user: UserEntity
}

export interface CreateUserRepository {
  create({
    person,
    user,
  }: CreateUserRepositoryInput): Promise<CreateUserRepositoryOutput>
}
