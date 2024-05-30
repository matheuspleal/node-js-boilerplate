import { Mapper } from '@/core/application/use-cases/mappers/mapper'

import {
  type FakeDTO,
  type FakeEntity,
  type FakePersistence,
  makeFakeDTOStub,
  makeFakePersistenceStub,
  makeFakeEntityStub,
} from '#/core/application/@mocks/fake-map-stub'

class FakeMap extends Mapper<FakeDTO, FakeEntity, FakePersistence> {
  static toDTO(entity: FakeEntity): FakeDTO {
    return {
      name: entity.name,
      email: entity.email,
      password: entity.password,
      age: new Date().getFullYear() - entity.birthdate.getFullYear(),
    }
  }

  static toCollectionDTO(entityCollection: FakeEntity[]): FakeDTO[] {
    return entityCollection.map<FakeDTO>(this.toDTO)
  }

  static toEntity(persistence: FakePersistence): FakeEntity {
    return {
      id: persistence.id,
      name: persistence.full_name,
      email: persistence.email,
      password: persistence.password,
      birthdate: persistence.birthdate,
    }
  }

  static toCollectionEntity(
    persistenceCollection: FakePersistence[],
  ): FakeEntity[] {
    return persistenceCollection.map<FakeEntity>(this.toEntity)
  }

  static toPersistence(entity: FakeEntity): FakePersistence {
    return {
      id: entity.id,
      full_name: entity.name,
      email: entity.email,
      password: entity.password,
      birthdate: entity.birthdate,
    }
  }

  static toCollectionPersistence(
    entityCollection: FakeEntity[],
  ): FakePersistence[] {
    return entityCollection.map<FakePersistence>(this.toPersistence)
  }
}

describe('Mapper', () => {
  let fakeDTO: FakeDTO
  let fakeEntity: FakeEntity
  let fakePersistence: FakePersistence

  beforeAll(() => {
    fakeDTO = makeFakeDTOStub()
    fakeEntity = makeFakeEntityStub()
    fakePersistence = makeFakePersistenceStub()
  })

  it('should be able to convert Domain to DTO', () => {
    const domainToDTO = FakeMap.toDTO(fakeEntity)

    expect(domainToDTO).toMatchObject(fakeDTO)
  })

  it('should be able to convert collection Domain to collection DTO', () => {
    const domainToDTO = FakeMap.toCollectionDTO([fakeEntity])

    expect(domainToDTO).toMatchObject([fakeDTO])
  })

  it('should be able to convert Entity to Domain', () => {
    const entityToDomain = FakeMap.toEntity(fakePersistence)

    expect(entityToDomain).toMatchObject(fakeEntity)
  })

  it('should be able to convert collection Entity to collection Domain', () => {
    const entityToDomain = FakeMap.toCollectionEntity([fakePersistence])

    expect(entityToDomain).toMatchObject([fakeEntity])
  })

  it('should be able to convert Domain to Entity', () => {
    const domainToEntity = FakeMap.toPersistence(fakeEntity)

    expect(domainToEntity).toMatchObject(fakePersistence)
  })

  it('should be able to convert collection Domain to collection Entity', () => {
    const domainToEntity = FakeMap.toCollectionPersistence([fakeEntity])

    expect(domainToEntity).toMatchObject([fakePersistence])
  })
})
