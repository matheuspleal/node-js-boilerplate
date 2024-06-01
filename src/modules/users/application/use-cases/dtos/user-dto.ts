export interface UserDTO {
  id: string
  name: string
  email: string
  birthdate: Date
  age: number
  createdAt: Date
  updatedAt: Date
}

export type UserCollectionDTO = UserDTO[]
