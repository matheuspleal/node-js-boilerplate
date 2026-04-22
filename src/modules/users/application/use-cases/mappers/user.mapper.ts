import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user.dto'
import { UserEntity } from '@/modules/users/domain/entities/user.entity'

export class UserMapper {
  static toDTO(userEntity: UserEntity): UserDTO {
    return {
      id: userEntity.id.toString(),
      name: userEntity.name,
      birthdate: userEntity.birthdate.toValue(),
      age: userEntity.age,
      email: userEntity.email.toString(),
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    }
  }

  static toCollectionDTO(userEntities: UserEntity[]): UserDTO[] {
    return userEntities.map<UserDTO>(UserMapper.toDTO)
  }
}
