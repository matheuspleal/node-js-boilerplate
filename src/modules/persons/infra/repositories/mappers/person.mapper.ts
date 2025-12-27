import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { Mapper } from '@/core/infra/repositories/mappers/mapper'
import { type PersonPersistence } from '@/modules/persons/application/repositories/persistence/person.persistence'
import { PersonEntity } from '@/modules/persons/domain/entities/person.entity'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate.vo'

export class PersonMapper extends Mapper<PersonEntity, PersonPersistence> {
  static toDomain(personsPersistence: PersonPersistence): PersonEntity {
    return PersonEntity.reconstitute(
      {
        name: personsPersistence.name,
        birthdate: BirthdateVO.reconstitute(personsPersistence.birthdate),
        createdAt: personsPersistence.createdAt,
        updatedAt: personsPersistence.updatedAt,
      },
      new UniqueEntityId(personsPersistence.id),
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
