import { type NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'

export interface FindNotificationByIdRepository {
  findById(id: string): Promise<NotificationEntity | null>
}
