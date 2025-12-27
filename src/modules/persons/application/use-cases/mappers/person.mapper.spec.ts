import { type PersonDTO } from '@/modules/persons/application/use-cases/dtos/person.dto'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person.mapper'
import { PersonEntity } from '@/modules/persons/domain/entities/person.entity'

import {
  makePersonEntityStub,
  makePersonEntityCollectionStub,
} from '#/modules/persons/domain/@mocks/person-entity.stub'

describe('PersonMapper', () => {
  let length: number
  let personEntity: PersonEntity
  let personCollectionEntity: PersonEntity[]

  beforeAll(() => {
    length = 20
    personEntity = makePersonEntityStub()
    personCollectionEntity = makePersonEntityCollectionStub({ length })
  })

  it('should be able to map PersonEntity instance to PersonDTO', () => {
    const entityToDTO = PersonMapper.toDTO(personEntity)

    expect(entityToDTO).toEqual<PersonDTO>({
      id: personEntity.id.toString(),
      name: personEntity.name,
      birthdate: personEntity.birthdate.toValue(),
      age: personEntity.age,
      createdAt: personEntity.createdAt,
      updatedAt: personEntity.updatedAt,
    })
  })

  it('should be able to map a collection of PersonEntity instances to a collection of PersonDTO', () => {
    const entityCollectionToDTOCollection = PersonMapper.toCollectionDTO(
      personCollectionEntity,
    )

    expect(entityCollectionToDTOCollection).toHaveLength(length)
    entityCollectionToDTOCollection.forEach((item, index) => {
      expect(item).toEqual<PersonDTO>({
        id: personCollectionEntity[index].id.toString(),
        name: personCollectionEntity[index].name,
        birthdate: personCollectionEntity[index].birthdate.toValue(),
        age: personCollectionEntity[index].age,
        createdAt: personCollectionEntity[index].createdAt,
        updatedAt: personCollectionEntity[index].updatedAt,
      })
    })
  })
})
