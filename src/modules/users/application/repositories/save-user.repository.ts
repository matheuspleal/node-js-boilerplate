import { type UserEntity } from '@/modules/users/domain/entities/user.entity'

export interface SaveUserRepository {
  save(user: UserEntity): Promise<UserEntity>
}
