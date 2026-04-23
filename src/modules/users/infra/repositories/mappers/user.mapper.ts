import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { UserEntity } from '@/modules/users/domain/entities/user.entity'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate.vo'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'
import { PasswordVO } from '@/modules/users/domain/value-objects/password.vo'
import { type UserPersistence } from '@/modules/users/infra/repositories/persistence/user.persistence'

export class UserMapper {
  static toDomain(userPersistence: UserPersistence): UserEntity {
    return UserEntity.reconstitute(
      {
        name: userPersistence.name,
        birthdate: BirthdateVO.reconstitute(userPersistence.birthdate),
        email: EmailVO.reconstitute(userPersistence.email),
        password: PasswordVO.reconstitute(userPersistence.password),
        createdAt: userPersistence.createdAt,
        updatedAt: userPersistence.updatedAt,
      },
      new UniqueEntityId(userPersistence.id),
    )
  }

  static toCollectionDomain(usersModel: UserPersistence[]): UserEntity[] {
    return usersModel.map<UserEntity>(UserMapper.toDomain)
  }

  static toPersistence(userEntity: UserEntity): UserPersistence {
    return {
      id: userEntity.id.toString(),
      name: userEntity.name,
      birthdate: userEntity.birthdate.toValue(),
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
