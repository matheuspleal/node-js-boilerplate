import { faker } from '@faker-js/faker'

import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import {
  PersonEntity,
  type PersonInput,
} from '@/modules/persons/domain/entities/person-entity'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export type PersonInputProps = PersonInput & { id?: string }

export interface PersonEntityProps {
  personInput?: Partial<PersonInputProps>
}

export function makePersonInputStub(
  personInput?: Partial<PersonInputProps>,
): PersonInputProps {
  return {
    id: personInput?.id ?? faker.string.uuid(),
    name: personInput?.name ?? faker.person.fullName(),
    birthdate: new BirthdateVO({
      value: personInput?.birthdate ?? faker.date.birthdate(),
    }).toValue(),
    createdAt: personInput?.createdAt ?? faker.date.recent(),
    updatedAt: personInput?.updatedAt ?? faker.date.recent(),
  }
}

export function makePersonEntityStub(props?: PersonEntityProps): PersonEntity {
  const { id, ...personInput } = makePersonInputStub({ ...props?.personInput })
  return PersonEntity.create(
    personInput,
    id ? new UniqueEntityIdVO(id) : undefined,
  )
}

export function makePersonEntityCollectionStub({
  personInput,
  length = 20,
}: PersonEntityProps & CollectionStubProps): PersonEntity[] {
  return Array.from({ length }).map(() => makePersonEntityStub({ personInput }))
}
