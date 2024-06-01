import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { type UserPersistence } from '@/modules/users/application/repositories/persistence/user-persistence'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user-mapper'
import { type UserEntity } from '@/modules/users/domain/entities/user-entity'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate-vo'
import { EmailVO } from '@/modules/users/domain/value-objects/email-vo'

import {
  makeFakeUserCollectionPersistenceStub,
  makeFakeUserPersistenceStub,
} from '#/modules/users/application/@mocks/user-persistence-stub'
import { getCurrentAgeInYears } from '#/modules/users/domain/@helpers/get-current-age-in-years'
import {
  makeFakeUserCollectionEntityStub,
  makeFakeUserEntityStub,
} from '#/modules/users/domain/@mocks/user-entity-stub'

describe('UserMapper', () => {
  let length: number
  let userEntity: UserEntity
  let userCollectionEntity: UserEntity[]
  let userPersistence: UserPersistence
  let userCollectionPersistence: UserPersistence[]

  beforeAll(() => {
    length = 20
    userEntity = makeFakeUserEntityStub()
    userCollectionEntity = makeFakeUserCollectionEntityStub({ length })
    userPersistence = makeFakeUserPersistenceStub()
    userCollectionPersistence = makeFakeUserCollectionPersistenceStub({
      length,
    })
  })

  it('should be able to map UserEntity instance to a UserDTO object', () => {
    const entityToDTO = UserMapper.toDTO(userEntity)

    expect(entityToDTO).toMatchObject({
      id: userEntity.id.toString(),
      name: userEntity.name,
      email: userEntity.email.toString(),
      age: getCurrentAgeInYears(userEntity.birthdate.toValue()),
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    })
  })

  it('should be able to map a collection of UserEntity instances to a collection of UserDTO objects', () => {
    const entityCollectionToDTOCollection =
      UserMapper.toCollectionDTO(userCollectionEntity)

    entityCollectionToDTOCollection.forEach((item, index) => {
      expect(item).toMatchObject({
        id: userCollectionEntity[index].id.toString(),
        name: userCollectionEntity[index].name,
        email: userCollectionEntity[index].email.toString(),
        age: getCurrentAgeInYears(
          userCollectionEntity[index].birthdate.toValue(),
        ),
        createdAt: userCollectionEntity[index].createdAt,
        updatedAt: userCollectionEntity[index].updatedAt,
      })
    })
  })

  it('should be able to map UserEntity instance to a UserPersistence object', () => {
    const entityToPersistence = UserMapper.toPersistence(userEntity)

    expect(entityToPersistence).toMatchObject({
      id: userEntity.id.toString(),
      name: userEntity.name,
      email: userEntity.email.toString(),
      birthdate: userEntity.birthdate.toValue(),
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    })
  })

  it('should be able to map a collection of UserEntity instances to a collection of UserPersistence objects', () => {
    const entityCollectionToPersistenceCollection =
      UserMapper.toCollectionPersistence(userCollectionEntity)

    entityCollectionToPersistenceCollection.forEach((item, index) => {
      expect(item).toMatchObject({
        id: userCollectionEntity[index].id.toString(),
        name: userCollectionEntity[index].name,
        email: userCollectionEntity[index].email.toString(),
        birthdate: userCollectionEntity[index].birthdate.toValue(),
        createdAt: userCollectionEntity[index].createdAt,
        updatedAt: userCollectionEntity[index].updatedAt,
      })
    })
  })

  it('should be able to map UserPersistence object to UserEntity instance', () => {
    const persistenceToEntity = UserMapper.toDomain(userPersistence)

    expect(persistenceToEntity).toMatchObject({
      id: new UniqueEntityIdVO(userPersistence.id),
      name: userPersistence.name,
      email: new EmailVO(userPersistence.email),
      birthdate: new BirthdateVO(userPersistence.birthdate),
      createdAt: userPersistence.createdAt,
      updatedAt: userPersistence.updatedAt,
    })
  })

  it('should be able to map a userPersistence objects to collection of UserEntity instances', () => {
    const persistenceCollectionToEntityCollection =
      UserMapper.toCollectionDomain(userCollectionPersistence)

    persistenceCollectionToEntityCollection.forEach((item, index) => {
      expect(item).toMatchObject({
        id: new UniqueEntityIdVO(userCollectionPersistence[index].id),
        name: userCollectionPersistence[index].name,
        email: new EmailVO(userCollectionPersistence[index].email),
        birthdate: new BirthdateVO(userCollectionPersistence[index].birthdate),
        createdAt: userCollectionPersistence[index].createdAt,
        updatedAt: userCollectionPersistence[index].updatedAt,
      })
    })
  })
})
