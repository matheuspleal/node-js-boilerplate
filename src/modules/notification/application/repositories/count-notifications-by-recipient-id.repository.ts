export interface CountNotificationsByRecipientIdRepository {
  countByRecipientId(recipientId: string): Promise<number>
}
