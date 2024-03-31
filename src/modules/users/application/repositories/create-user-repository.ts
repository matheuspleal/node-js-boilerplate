import { UserEntity } from '@/modules/users/domain/entities/user-entity'

export interface CreateUserRepository {
  create(user: UserEntity): Promise<UserEntity>
}
