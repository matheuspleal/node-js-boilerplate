import { type PersonEntity } from '@/modules/persons/domain/entities/person.entity'
import { type UserEntity } from '@/modules/users/domain/entities/user.entity'

export interface SaveUserRepositoryInput {
  person: PersonEntity
  user: UserEntity
}

export interface SaveUserRepositoryOutput {
  person: PersonEntity
  user: UserEntity
}

export interface SaveUserRepository {
  save({
    person,
    user,
  }: SaveUserRepositoryInput): Promise<SaveUserRepositoryOutput>
}
