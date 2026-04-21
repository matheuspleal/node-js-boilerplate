import { Mapper } from '@/core/application/use-cases/mappers/mapper'
import { type NotificationDTO } from '@/modules/notification/application/use-cases/dtos/notification.dto'
import { NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'

export class NotificationMapper extends Mapper<
  NotificationDTO,
  NotificationEntity
> {
  static toDTO(entity: NotificationEntity): NotificationDTO {
    return {
      id: entity.id.toString(),
      recipientId: entity.recipientId.toString(),
      title: entity.title,
      content: entity.content,
      readAt: entity.readAt,
      createdAt: entity.createdAt,
    }
  }

  static toCollectionDTO(entities: NotificationEntity[]): NotificationDTO[] {
    return entities.map<NotificationDTO>(NotificationMapper.toDTO)
  }
}
