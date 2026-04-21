import { type UseCase } from '@/core/application/use-cases/use-case'
import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { type Either, right } from '@/core/shared/either'
import { type SaveNotificationRepository } from '@/modules/notification/application/repositories/save-notification.repository'
import { type NotificationDTO } from '@/modules/notification/application/use-cases/dtos/notification.dto'
import { NotificationMapper } from '@/modules/notification/application/use-cases/mappers/notification.mapper'
import { NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'

export interface SendNotificationUseCaseInput {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseOutput = Either<
  never,
  {
    notification: NotificationDTO
  }
>

export class SendNotificationUseCase implements UseCase<
  SendNotificationUseCaseInput,
  SendNotificationUseCaseOutput
> {
  constructor(
    private readonly saveNotificationRepository: SaveNotificationRepository,
  ) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseInput): Promise<SendNotificationUseCaseOutput> {
    const notification = NotificationEntity.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    })
    const savedNotification =
      await this.saveNotificationRepository.save(notification)
    return right({
      notification: NotificationMapper.toDTO(savedNotification),
    })
  }
}
