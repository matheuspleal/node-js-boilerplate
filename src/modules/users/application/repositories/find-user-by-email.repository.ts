import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

export interface FindUserByEmailRepository {
  findByEmail(email: string): Promise<UserEntity | null>
}
