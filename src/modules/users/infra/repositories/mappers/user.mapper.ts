import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { Mapper } from '@/core/infra/repositories/mappers/mapper'
import { type UserPersistence } from '@/modules/users/application/repositories/persistence/user.persistence'
import { UserEntity } from '@/modules/users/domain/entities/user.entity'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'

export class UserMapper extends Mapper<UserEntity, UserPersistence> {
  static toDomain(userPersistence: UserPersistence): UserEntity {
    return UserEntity.create(
      {
        personId: new UniqueEntityId(userPersistence.personId),
        email: EmailVO.create({ value: userPersistence.email })
          .value as EmailVO,
        password: userPersistence.password,
        createdAt: userPersistence.createdAt,
        updatedAt: userPersistence.updatedAt,
      },
      new UniqueEntityId(userPersistence.id),
    ).value as UserEntity
  }

  static toCollectionDomain(usersModel: UserPersistence[]): UserEntity[] {
    return usersModel.map<UserEntity>(UserMapper.toDomain)
  }

  static toPersistence(userEntity: UserEntity): UserPersistence {
    return {
      id: userEntity.id.toString(),
      personId: userEntity.personId.toString(),
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
