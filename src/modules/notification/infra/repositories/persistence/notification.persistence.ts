export interface NotificationPersistence {
  id: string
  recipientId: string
  title: string
  content: string
  readAt: Date | null
  createdAt: Date
}
