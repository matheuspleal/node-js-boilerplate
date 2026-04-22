import { type UserDTO } from '@/modules/users/application/use-cases/dtos/user.dto'
import { UserMapper } from '@/modules/users/application/use-cases/mappers/user.mapper'
import { UserEntity } from '@/modules/users/domain/entities/user.entity'

import {
  makeUserEntityCollectionStub,
  makeUserEntityStub,
} from '#/modules/users/domain/@mocks/user-entity.stub'

describe('UserMapper', () => {
  let length: number
  let userEntity: UserEntity
  let userCollectionEntity: UserEntity[]

  beforeAll(() => {
    length = 20
    userEntity = makeUserEntityStub()
    userCollectionEntity = makeUserEntityCollectionStub({ length })
  })

  it('should be able to map UserEntity instance to UserDTO', () => {
    const entityToDTO = UserMapper.toDTO(userEntity)

    expect(entityToDTO).toEqual<UserDTO>({
      id: userEntity.id.toString(),
      name: userEntity.name,
      birthdate: userEntity.birthdate.toValue(),
      age: userEntity.age,
      email: userEntity.email.toString(),
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    })
  })

  it('should be able to map a collection of UserEntity instances to a collection of UserDTO', () => {
    const entityCollectionToDTOCollection =
      UserMapper.toCollectionDTO(userCollectionEntity)

    expect(entityCollectionToDTOCollection).toHaveLength(length)
    entityCollectionToDTOCollection.forEach((item, index) => {
      expect(item).toEqual<UserDTO>({
        id: userCollectionEntity[index].id.toString(),
        name: userCollectionEntity[index].name,
        birthdate: userCollectionEntity[index].birthdate.toValue(),
        age: userCollectionEntity[index].age,
        email: userCollectionEntity[index].email.toString(),
        createdAt: userCollectionEntity[index].createdAt,
        updatedAt: userCollectionEntity[index].updatedAt,
      })
    })
  })
})
