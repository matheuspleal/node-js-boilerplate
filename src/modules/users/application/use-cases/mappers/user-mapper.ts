import { Mapper } from '@/core/application/use-cases/mappers/mapper'
import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { type UserPersistence } from '@/modules/users/application/repositories/persistence/user-persistence'
import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user-dto'
import { UserEntity } from '@/modules/users/domain/entities/user-entity'

export class UserMapper extends Mapper<UserDTO, UserEntity, UserPersistence> {
  static toDTO(userEntity: UserEntity): UserDTO {
    return {
      id: userEntity.id.toString(),
      email: userEntity.email.toString(),
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    }
  }

  static toCollectionDTO(usersEntity: UserEntity[]): UserDTO[] {
    return usersEntity.map<UserDTO>(UserMapper.toDTO)
  }

  static toDomain(userPersistence: UserPersistence): UserEntity {
    return UserEntity.create(
      {
        personId: new UniqueEntityIdVO(userPersistence.personId),
        email: userPersistence.email,
        password: userPersistence.password,
        createdAt: userPersistence.createdAt,
        updatedAt: userPersistence.updatedAt,
      },
      new UniqueEntityIdVO(userPersistence.id),
    )
  }

  static toCollectionDomain(usersModel: UserPersistence[]): UserEntity[] {
    return usersModel.map<UserEntity>(UserMapper.toDomain)
  }

  static toPersistence(userEntity: UserEntity): UserPersistence {
    return {
      id: userEntity.id.toString(),
      personId: userEntity.personId,
      email: userEntity.email.toString(),
      password: userEntity.password.toString(),
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    }
  }

  static toCollectionPersistence(
    userEntities: UserEntity[],
  ): UserPersistence[] {
    return userEntities.map<UserPersistence>(UserMapper.toPersistence)
  }
}
