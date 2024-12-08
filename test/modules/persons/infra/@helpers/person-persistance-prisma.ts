import { type PrismaClient } from '@prisma/client'

import { type PersonPersistence } from '@/modules/persons/application/repositories/persistence/person-persistence'

import { makePersonPersistenceStub } from '#/modules/persons/infra/@mocks/person-persistence-stub'

export interface PersonDTOStubProps {
  prisma: PrismaClient
  personPersistence?: Partial<PersonPersistence>
}

export interface PersonCollectionDTOStubProps {
  prisma: PrismaClient
  personsPersistence: PersonPersistence[]
}

export async function createPerson({
  prisma,
  personPersistence,
}: PersonDTOStubProps): Promise<PersonPersistence> {
  const personPersistenceData = makePersonPersistenceStub({ personPersistence })
  const createdPerson = await prisma.person.create({
    data: {
      ...personPersistenceData,
    },
  })
  return createdPerson
}

export async function createManyPersons({
  prisma,
  personsPersistence,
}: PersonCollectionDTOStubProps): Promise<void> {
  await prisma.person.createMany({
    data: [...personsPersistence],
  })
}
