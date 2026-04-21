import { type NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'

export interface FindManyNotificationsByRecipientIdRepository {
  findManyByRecipientId(recipientId: string): Promise<NotificationEntity[]>
}
