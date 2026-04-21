export interface NotificationDTO {
  id: string
  recipientId: string
  title: string
  content: string
  readAt: Date | null
  createdAt: Date
}

export type NotificationCollectionDTO = NotificationDTO[]
