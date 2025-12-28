import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import {
  PersonEntity,
  type PersonInput,
  type PersonProps,
} from '@/modules/persons/domain/entities/person.entity'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate.vo'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props.contract'

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
    birthdate:
      personInput?.birthdate ??
      BirthdateVO.reconstitute(faker.date.birthdate()),
    createdAt: personInput?.createdAt ?? faker.date.recent(),
    updatedAt: personInput?.updatedAt ?? faker.date.recent(),
  }
}

export function makePersonEntityStub(props?: PersonEntityProps): PersonEntity {
  const { id, ...rest } = makePersonInputStub({ ...props?.personInput })
  const personProps: PersonProps = {
    name: rest.name,
    birthdate: rest.birthdate,
    createdAt: rest.createdAt ?? new Date(),
    updatedAt: rest.updatedAt ?? new Date(),
  }
  return PersonEntity.reconstitute(personProps, new UniqueEntityId(id))
}

export function makePersonEntityCollectionStub({
  personInput,
  length = 20,
}: PersonEntityProps & CollectionStubProps): PersonEntity[] {
  return Array.from({ length }).map(() => makePersonEntityStub({ personInput }))
}
