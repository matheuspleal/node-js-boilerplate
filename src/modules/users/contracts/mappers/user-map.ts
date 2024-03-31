import { Mapper } from '@/core/contracts/mapper'
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id'
import { UserPersistence } from '@/modules/users/application/repositories/persistence/user-persistence'
import { UserDTO } from '@/modules/users/contracts/dtos/user-dto'
import { UserEntity } from '@/modules/users/domain/entities/user-entity'

export class UserMap extends Mapper<UserDTO, UserEntity, UserPersistence> {
  static toDTO(userEntity: UserEntity): UserDTO {
    return {
      id: userEntity.id.toString(),
      name: userEntity.name,
      age: userEntity.age,
      email: userEntity.email.toString(),
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    }
  }

  static toCollectionDTO(usersEntity: UserEntity[]): UserDTO[] {
    return usersEntity.map<UserDTO>(UserMap.toDTO)
  }

  static toEntity(userPersistence: UserPersistence): UserEntity {
    return UserEntity.create(
      {
        name: userPersistence.name,
        email: userPersistence.email,
        birthdate: userPersistence.birthdate,
        createdAt: userPersistence.createdAt,
        updatedAt: userPersistence.updatedAt,
      },
      new UniqueEntityId(userPersistence.id),
    )
  }

  static toCollectionEntity(usersModel: UserPersistence[]): UserEntity[] {
    return usersModel.map<UserEntity>(UserMap.toEntity)
  }

  static toPersistence(userEntity: UserEntity): UserPersistence {
    return {
      id: userEntity.id.toString(),
      name: userEntity.name,
      email: userEntity.email.toString(),
      birthdate: userEntity.birthdate.toValue(),
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    }
  }

  static toCollectionPersistence(
    userEntities: UserEntity[],
  ): UserPersistence[] {
    return userEntities.map<UserPersistence>(UserMap.toPersistence)
  }
}
