export interface PersonPersistence {
  id: string
  name: string
  birthdate: Date
  createdAt: Date
  updatedAt: Date
}

export type PersonPersistenceCollection = PersonPersistence[]
