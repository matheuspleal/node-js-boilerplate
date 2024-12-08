import { faker } from '@faker-js/faker'

import {
  type PersonDTO,
  type PersonCollectionDTO,
} from '@/modules/persons/application/use-cases/dtos/person-dto'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export interface PersonDTOStubProps {
  personDTO?: Partial<PersonDTO>
}

export function makePersonDTOStub(props?: PersonDTOStubProps): PersonDTO {
  const { personDTO } = props ?? {}
  const birthdate = personDTO?.birthdate ?? faker.date.birthdate()
  const age =
    personDTO?.age ??
    new BirthdateVO({ value: birthdate }).getCurrentAgeInYears()
  return {
    id: personDTO?.id ?? faker.string.uuid(),
    name: personDTO?.name ?? faker.person.fullName(),
    birthdate,
    age,
    createdAt: personDTO?.createdAt ?? faker.date.recent(),
    updatedAt: personDTO?.updatedAt ?? faker.date.recent(),
  }
}
export function makePersonCollectionDTOStub({
  personDTO,
  length = 20,
}: PersonDTOStubProps & CollectionStubProps): PersonCollectionDTO {
  return Array.from({ length }).map(() => makePersonDTOStub({ personDTO }))
}
