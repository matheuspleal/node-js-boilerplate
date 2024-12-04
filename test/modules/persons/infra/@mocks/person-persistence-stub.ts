import { faker } from '@faker-js/faker'

import { type PersonPersistence } from '@/modules/persons/application/repositories/persistence/person-persistence'

import { type CollectionStubProps } from '#/core/domain/@types/collection-stub-props-contract'

export interface PersonPersistanceStubProps {
  personPersistance?: Partial<PersonPersistence>
}

export function makePersonPersistenceStub(
  props?: PersonPersistanceStubProps,
): PersonPersistence {
  const { personPersistance } = props ?? {}
  return {
    id: personPersistance?.id ?? faker.string.uuid(),
    name: personPersistance?.name ?? faker.person.fullName(),
    birthdate: personPersistance?.birthdate ?? faker.date.birthdate(),
    createdAt: personPersistance?.createdAt ?? faker.date.recent(),
    updatedAt: personPersistance?.updatedAt ?? faker.date.recent(),
  }
}

export function makePersonCollectionPersistenceStub({
  length = 20,
  personPersistance,
}: PersonPersistanceStubProps & CollectionStubProps): PersonPersistence[] {
  return Array.from({ length }).map(() =>
    makePersonPersistenceStub({ personPersistance }),
  )
}
