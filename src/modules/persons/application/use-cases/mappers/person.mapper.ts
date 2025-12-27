import { Mapper } from '@/core/application/use-cases/mappers/mapper'
import { type PersonDTO } from '@/modules/persons/application/use-cases/dtos/person.dto'
import { PersonEntity } from '@/modules/persons/domain/entities/person.entity'

export class PersonMapper extends Mapper<PersonDTO, PersonEntity> {
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

  static toCollectionDTO(personEntities: PersonEntity[]): PersonDTO[] {
    return personEntities.map<PersonDTO>(PersonMapper.toDTO)
  }
}
