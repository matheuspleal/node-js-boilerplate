export interface UserDTO {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export type UserCollectionDTO = UserDTO[]
