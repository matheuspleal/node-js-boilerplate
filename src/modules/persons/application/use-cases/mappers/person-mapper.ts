import { Mapper } from '@/core/application/use-cases/mappers/mapper'
import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { type PersonPersistence } from '@/modules/persons/application/repositories/persistence/person-persistence'
import { type PersonDTO } from '@/modules/persons/application/use-cases/dtos/person-dto'
import { PersonEntity } from '@/modules/persons/domain/entities/person-entity'

export class PersonMapper extends Mapper<
  PersonDTO,
  PersonEntity,
  PersonPersistence
> {
  static toDTO(personEntity: PersonEntity): PersonDTO {
    return {
      id: personEntity.id.toString(),
      name: personEntity.name,
      birthdate: personEntity.birthdate.toValue(),
      age: personEntity.age,
      createdAt: personEntity.createdAt,
      updatedAt: personEntity.updatedAt,
    }
  }

  static toCollectionDTO(personsEntity: PersonEntity[]): PersonDTO[] {
    return personsEntity.map<PersonDTO>(PersonMapper.toDTO)
  }

  static toDomain(personsPersistence: PersonPersistence): PersonEntity {
    return PersonEntity.create(
      {
        name: personsPersistence.name,
        birthdate: personsPersistence.birthdate,
        createdAt: personsPersistence.createdAt,
        updatedAt: personsPersistence.updatedAt,
      },
      new UniqueEntityIdVO(personsPersistence.id),
    )
  }

  static toCollectionDomain(
    personsEntity: PersonPersistence[],
  ): PersonEntity[] {
    return personsEntity.map<PersonEntity>(PersonMapper.toDomain)
  }

  static toPersistence(personEntity: PersonEntity): PersonPersistence {
    return {
      id: personEntity.id.toString(),
      name: personEntity.name,
      birthdate: personEntity.birthdate.toValue(),
      createdAt: personEntity.createdAt,
      updatedAt: personEntity.updatedAt,
    }
  }

  static toCollectionPersistence(
    personEntities: PersonEntity[],
  ): PersonPersistence[] {
    return personEntities.map<PersonPersistence>(PersonMapper.toPersistence)
  }
}
