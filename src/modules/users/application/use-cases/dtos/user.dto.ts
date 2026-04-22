export interface UserDTO {
  id: string
  name: string
  birthdate: Date
  age: number
  email: string
  createdAt: Date
  updatedAt: Date
}

export type UserCollectionDTO = UserDTO[]
