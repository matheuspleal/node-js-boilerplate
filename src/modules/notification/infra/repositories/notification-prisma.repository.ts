import { DomainEvents } from '@/core/domain/events/domain-events'
import { BasePrismaRepository } from '@/core/infra/repositories/base-prisma.repository'
import { type CountNotificationsByRecipientIdRepository } from '@/modules/notification/application/repositories/count-notifications-by-recipient-id.repository'
import { type FindManyNotificationsByRecipientIdRepository } from '@/modules/notification/application/repositories/find-many-notifications-by-recipient-id.repository'
import { type FindNotificationByIdRepository } from '@/modules/notification/application/repositories/find-notification-by-id.repository'
import { type SaveNotificationRepository } from '@/modules/notification/application/repositories/save-notification.repository'
import { type NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'
import { NotificationMapper } from '@/modules/notification/infra/repositories/mappers/notification.mapper'

export class NotificationPrismaRepository
  extends BasePrismaRepository
  implements
    SaveNotificationRepository,
    FindNotificationByIdRepository,
    FindManyNotificationsByRecipientIdRepository,
    CountNotificationsByRecipientIdRepository
{
  constructor() {
    super()
  }

  async save(notification: NotificationEntity): Promise<NotificationEntity> {
    const savedNotification = await this.prisma.notification.upsert({
      create: {
        ...NotificationMapper.toPersistence(notification),
      },
      update: {
        ...NotificationMapper.toPersistence(notification),
      },
      where: {
        id: notification.id.toValue(),
      },
    })
    await DomainEvents.dispatchEventsForAggregate(notification.id)
    return NotificationMapper.toDomain(savedNotification)
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    })
    if (!notification) {
      return null
    }
    return NotificationMapper.toDomain(notification)
  }

  async findManyByRecipientId(
    recipientId: string,
  ): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { recipientId },
    })
    return NotificationMapper.toCollectionDomain(notifications)
  }

  async countByRecipientId(recipientId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { recipientId },
    })
  }
}
