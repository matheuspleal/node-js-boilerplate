import { Mapper } from '@/core/infra/repositories/mappers/mapper'

import {
  type FakeEntity,
  type FakePersistence,
  makeFakePersistenceStub,
  makeFakeEntityStub,
} from '#/core/infra/@mocks/fake-mapper.stub'

class FakeMapper extends Mapper<FakeEntity, FakePersistence> {
  static toDomain(persistence: FakePersistence): FakeEntity {
    return {
      id: persistence.id,
      name: persistence.full_name,
      email: persistence.email,
      password: persistence.password,
      birthdate: persistence.birthdate,
    }
  }

  static toCollectionDomain(
    persistenceCollection: FakePersistence[],
  ): FakeEntity[] {
    return persistenceCollection.map<FakeEntity>(this.toDomain)
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
  let fakeEntity: FakeEntity
  let fakePersistence: FakePersistence

  beforeAll(() => {
    fakeEntity = makeFakeEntityStub()
    fakePersistence = makeFakePersistenceStub()
  })

  it('should be able to convert Persistence to Domain', () => {
    const persistenceToDomain = FakeMapper.toDomain(fakePersistence)

    expect(persistenceToDomain).toEqual(fakeEntity)
  })

  it('should be able to convert collection Persistence to collection Domain', () => {
    const persistenceToDomain = FakeMapper.toCollectionDomain([fakePersistence])

    expect(persistenceToDomain).toEqual([fakeEntity])
  })

  it('should be able to convert Domain to Persistence', () => {
    const domainToPersistence = FakeMapper.toPersistence(fakeEntity)

    expect(domainToPersistence).toEqual(fakePersistence)
  })

  it('should be able to convert collection Domain to collection Persistence', () => {
    const domainToPersistence = FakeMapper.toCollectionPersistence([fakeEntity])

    expect(domainToPersistence).toEqual([fakePersistence])
  })
})
