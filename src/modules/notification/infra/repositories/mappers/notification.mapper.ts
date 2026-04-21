import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { Mapper } from '@/core/infra/repositories/mappers/mapper'
import { NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'
import { type NotificationPersistence } from '@/modules/notification/infra/repositories/persistence/notification.persistence'

export class NotificationMapper extends Mapper<
  NotificationEntity,
  NotificationPersistence
> {
  static toDomain(persistence: NotificationPersistence): NotificationEntity {
    return NotificationEntity.reconstitute(
      {
        recipientId: new UniqueEntityId(persistence.recipientId),
        title: persistence.title,
        content: persistence.content,
        readAt: persistence.readAt,
        createdAt: persistence.createdAt,
      },
      new UniqueEntityId(persistence.id),
    )
  }

  static toCollectionDomain(
    persistenceList: NotificationPersistence[],
  ): NotificationEntity[] {
    return persistenceList.map<NotificationEntity>(NotificationMapper.toDomain)
  }

  static toPersistence(entity: NotificationEntity): NotificationPersistence {
    return {
      id: entity.id.toString(),
      recipientId: entity.recipientId.toString(),
      title: entity.title,
      content: entity.content,
      readAt: entity.readAt,
      createdAt: entity.createdAt,
    }
  }
}
