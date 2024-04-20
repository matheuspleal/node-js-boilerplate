import { type UserEntity } from '@/modules/users/domain/entities/user-entity'

export interface FindUserByIdRepository {
  findById(id: string): Promise<UserEntity | null>
}
