import { faker } from '@faker-js/faker'

import { type PersonPersistence } from '@/modules/persons/application/repositories/persistence/person-persistence'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export interface PersonPersistenceStubProps {
  personPersistence?: Partial<PersonPersistence>
}

export function makePersonPersistenceStub(
  props?: PersonPersistenceStubProps,
): PersonPersistence {
  const { personPersistence } = props ?? {}
  return {
    id: personPersistence?.id ?? faker.string.uuid(),
    name: personPersistence?.name ?? faker.person.fullName(),
    birthdate: personPersistence?.birthdate ?? faker.date.birthdate(),
    createdAt: personPersistence?.createdAt ?? faker.date.recent(),
    updatedAt: personPersistence?.updatedAt ?? faker.date.recent(),
  }
}

export function makePersonCollectionPersistenceStub({
  length = 20,
  personPersistence,
}: PersonPersistenceStubProps & CollectionStubProps): PersonPersistence[] {
  return Array.from({ length }).map(() =>
    makePersonPersistenceStub({ personPersistence }),
  )
}
