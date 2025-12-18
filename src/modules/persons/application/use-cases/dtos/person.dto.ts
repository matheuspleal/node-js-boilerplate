export interface PersonDTO {
  id: string
  name: string
  birthdate: Date
  age: number
  createdAt: Date
  updatedAt: Date
}

export type PersonCollectionDTO = PersonDTO[]
