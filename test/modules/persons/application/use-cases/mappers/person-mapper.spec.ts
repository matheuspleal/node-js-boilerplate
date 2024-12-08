import { type PersonPersistence } from '@/modules/persons/application/repositories/persistence/person-persistence'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'
import { type PersonEntity } from '@/modules/persons/domain/entities/person-entity'

import { getCurrentAgeInYears } from '#/modules/persons/domain/@helpers/get-current-age-in-years'
import {
  makePersonEntityStub,
  makePersonEntityCollectionStub,
} from '#/modules/persons/domain/@mocks/person-entity-stub'
import {
  makePersonCollectionPersistenceStub,
  makePersonPersistenceStub,
} from '#/modules/persons/infra/@mocks/person-persistence-stub'

describe('PersonMapper', () => {
  let length: number
  let personEntity: PersonEntity
  let personCollectionEntity: PersonEntity[]
  let personPersistence: PersonPersistence
  let personCollectionPersistence: PersonPersistence[]

  beforeAll(() => {
    length = 20
    personEntity = makePersonEntityStub()
    personCollectionEntity = makePersonEntityCollectionStub({ length })
    personPersistence = makePersonPersistenceStub()
    personCollectionPersistence = makePersonCollectionPersistenceStub({
      length,
    })
  })

  it('should be able to map PersonEntity instance to a PersonDTO object', () => {
    const entityToDTO = PersonMapper.toDTO(personEntity)

    expect(entityToDTO).toEqual({
      id: personEntity.id.toString(),
      name: personEntity.name,
      birthdate: personEntity.birthdate.toValue(),
      age: getCurrentAgeInYears(personEntity.birthdate.toValue()),
      createdAt: personEntity.createdAt,
      updatedAt: personEntity.updatedAt,
    })
  })

  it('should be able to map a collection of PersonEntity instances to a collection of PersonDTO objects', () => {
    const entityCollectionToDTOCollection = PersonMapper.toCollectionDTO(
      personCollectionEntity,
    )

    entityCollectionToDTOCollection.forEach((item, index) => {
      expect(item).toEqual({
        id: personCollectionEntity[index].id.toString(),
        name: personCollectionEntity[index].name,
        birthdate: personCollectionEntity[index].birthdate.toValue(),
        age: getCurrentAgeInYears(
          personCollectionEntity[index].birthdate.toValue(),
        ),
        createdAt: personCollectionEntity[index].createdAt,
        updatedAt: personCollectionEntity[index].updatedAt,
      })
    })
  })

  it('should be able to map PersonEntity instance to a PersonPersistence object', () => {
    const entityToPersistence = PersonMapper.toPersistence(personEntity)

    expect(entityToPersistence).toEqual({
      id: personEntity.id.toString(),
      name: personEntity.name,
      birthdate: personEntity.birthdate.toValue(),
      createdAt: personEntity.createdAt,
      updatedAt: personEntity.updatedAt,
    })
  })

  it('should be able to map a collection of PersonEntity instances to a collection of PersonPersistence objects', () => {
    const entityCollectionToPersistenceCollection =
      PersonMapper.toCollectionPersistence(personCollectionEntity)

    entityCollectionToPersistenceCollection.forEach((item, index) => {
      expect(item).toEqual({
        id: personCollectionEntity[index].id.toString(),
        name: personCollectionEntity[index].name,
        birthdate: personCollectionEntity[index].birthdate.toValue(),
        createdAt: personCollectionEntity[index].createdAt,
        updatedAt: personCollectionEntity[index].updatedAt,
      })
    })
  })

  it('should be able to map PersonPersistence object to PersonEntity instance', () => {
    const persistenceToEntity = PersonMapper.toDomain(personPersistence)

    const birthdate = personPersistence.birthdate
    birthdate.setUTCHours(0, 0, 0, 0)

    expect(persistenceToEntity.id.toValue()).toEqual(personPersistence.id)
    expect(persistenceToEntity.name).toEqual(personPersistence.name)
    expect(persistenceToEntity.birthdate.toValue()).toEqual(birthdate)
    expect(persistenceToEntity.createdAt).toEqual(personPersistence.createdAt)
    expect(persistenceToEntity.updatedAt).toEqual(personPersistence.updatedAt)
  })

  it('should be able to map a personPersistence objects to collection of PersonEntity instances', () => {
    const persistenceCollectionToEntityCollection =
      PersonMapper.toCollectionDomain(personCollectionPersistence)

    persistenceCollectionToEntityCollection.forEach((item, index) => {
      const birthdate = personCollectionPersistence[index].birthdate
      birthdate.setUTCHours(0, 0, 0, 0)

      expect(item.id.toValue()).toEqual(personCollectionPersistence[index].id)
      expect(item.name).toEqual(personCollectionPersistence[index].name)
      expect(item.birthdate.toValue()).toEqual(birthdate)
      expect(item.createdAt).toEqual(
        personCollectionPersistence[index].createdAt,
      )
      expect(item.updatedAt).toEqual(
        personCollectionPersistence[index].updatedAt,
      )
    })
  })
})
