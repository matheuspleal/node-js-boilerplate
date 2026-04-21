import { type NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'

export interface SaveNotificationRepository {
  save(notification: NotificationEntity): Promise<NotificationEntity>
}
