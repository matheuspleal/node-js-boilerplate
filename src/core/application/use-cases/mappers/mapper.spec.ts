import { Mapper } from '@/core/application/use-cases/mappers/mapper'

import {
  type FakeDTO,
  makeFakeDTOStub,
  type FakeEntity,
  makeFakeEntityStub,
} from '#/core/application/@mocks/fake-mapper.stub'

class FakeMapper extends Mapper<FakeDTO, FakeEntity> {
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

  static toDomain(dto: FakeDTO): FakeEntity {
    const currentYear = new Date().getFullYear()
    return {
      id: 'generated-id',
      name: dto.name,
      email: dto.email,
      password: dto.password,
      birthdate: new Date(currentYear - dto.age, 0, 1),
    }
  }

  static toCollectionDomain(dtoCollection: FakeDTO[]): FakeEntity[] {
    return dtoCollection.map<FakeEntity>(this.toDomain)
  }
}

describe('Mapper', () => {
  let fakeDTO: FakeDTO
  let fakeEntity: FakeEntity

  beforeAll(() => {
    fakeDTO = makeFakeDTOStub()
    fakeEntity = makeFakeEntityStub()
  })

  it('should be able to convert Domain to DTO', () => {
    const domainToDTO = FakeMapper.toDTO(fakeEntity)

    expect(domainToDTO).toEqual(fakeDTO)
  })

  it('should be able to convert collection Domain to collection DTO', () => {
    const domainToDTO = FakeMapper.toCollectionDTO([fakeEntity])

    expect(domainToDTO).toEqual([fakeDTO])
  })

  it('should be able to convert DTO to Domain', () => {
    const dtoToDomain = FakeMapper.toDomain(fakeDTO)

    expect(dtoToDomain.name).toEqual(fakeEntity.name)
    expect(dtoToDomain.email).toEqual(fakeEntity.email)
    expect(dtoToDomain.password).toEqual(fakeEntity.password)
  })

  it('should be able to convert collection DTO to collection Domain', () => {
    const dtoToDomain = FakeMapper.toCollectionDomain([fakeDTO])

    expect(dtoToDomain[0].name).toEqual(fakeEntity.name)
    expect(dtoToDomain[0].email).toEqual(fakeEntity.email)
    expect(dtoToDomain[0].password).toEqual(fakeEntity.password)
  })
})
