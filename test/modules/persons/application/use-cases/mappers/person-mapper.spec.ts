import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { type PersonPersistence } from '@/modules/persons/application/repositories/persistence/person-persistence'
import { PersonMapper } from '@/modules/persons/application/use-cases/mappers/person-mapper'
import { type PersonEntity } from '@/modules/persons/domain/entities/person-entity'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'

import {
  makeFakePersonCollectionPersistenceStub,
  makeFakePersonPersistenceStub,
} from '#/modules/persons/application/@mocks/person-persistence-stub'
import { getCurrentAgeInYears } from '#/modules/persons/domain/@helpers/get-current-age-in-years'
import {
  makeFakePersonCollectionEntityStub,
  makeFakePersonEntityStub,
} from '#/modules/persons/domain/@mocks/person-entity-stub'

describe('PersonMapper', () => {
  let length: number
  let personEntity: PersonEntity
  let personCollectionEntity: PersonEntity[]
  let personPersistence: PersonPersistence
  let personCollectionPersistence: PersonPersistence[]

  beforeAll(() => {
    length = 20
    personEntity = makeFakePersonEntityStub()
    personCollectionEntity = makeFakePersonCollectionEntityStub({ length })
    personPersistence = makeFakePersonPersistenceStub()
    personCollectionPersistence = makeFakePersonCollectionPersistenceStub({
      length,
    })
  })

  it('should be able to map PersonEntity instance to a PersonDTO object', () => {
    const entityToDTO = PersonMapper.toDTO(personEntity)

    expect(entityToDTO).toMatchObject({
      id: personEntity.id.toString(),
      name: personEntity.name,
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
      expect(item).toMatchObject({
        id: personCollectionEntity[index].id.toString(),
        name: personCollectionEntity[index].name,
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

    expect(entityToPersistence).toMatchObject({
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
      expect(item).toMatchObject({
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

    expect(persistenceToEntity).toMatchObject({
      id: new UniqueEntityIdVO(personPersistence.id),
      name: personPersistence.name,
      birthdate: new BirthdateVO({ value: personPersistence.birthdate }),
      createdAt: personPersistence.createdAt,
      updatedAt: personPersistence.updatedAt,
    })
  })

  it('should be able to map a personPersistence objects to collection of PersonEntity instances', () => {
    const persistenceCollectionToEntityCollection =
      PersonMapper.toCollectionDomain(personCollectionPersistence)

    persistenceCollectionToEntityCollection.forEach((item, index) => {
      expect(item).toMatchObject({
        id: new UniqueEntityIdVO(personCollectionPersistence[index].id),
        name: personCollectionPersistence[index].name,
        birthdate: new BirthdateVO({
          value: personCollectionPersistence[index].birthdate,
        }),
        createdAt: personCollectionPersistence[index].createdAt,
        updatedAt: personCollectionPersistence[index].updatedAt,
      })
    })
  })
})
