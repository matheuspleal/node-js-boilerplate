import { type UseCase } from '@/core/application/use-cases/use-case'
import { type Either, left, right } from '@/core/shared/either'
import { type FindNotificationByIdRepository } from '@/modules/notification/application/repositories/find-notification-by-id.repository'
import { type SaveNotificationRepository } from '@/modules/notification/application/repositories/save-notification.repository'
import { type NotificationDTO } from '@/modules/notification/application/use-cases/dtos/notification.dto'
import { NotificationMapper } from '@/modules/notification/application/use-cases/mappers/notification.mapper'
import { NotificationNotFoundError } from '@/modules/notification/domain/errors/notification-not-found.error'

export interface ReadNotificationUseCaseInput {
  id: string
}

export type ReadNotificationUseCaseOutput = Either<
  NotificationNotFoundError,
  {
    notification: NotificationDTO
  }
>

export class ReadNotificationUseCase implements UseCase<
  ReadNotificationUseCaseInput,
  ReadNotificationUseCaseOutput
> {
  constructor(
    private readonly notificationRepository: FindNotificationByIdRepository &
      SaveNotificationRepository,
  ) {}

  async execute({
    id,
  }: ReadNotificationUseCaseInput): Promise<ReadNotificationUseCaseOutput> {
    const notification = await this.notificationRepository.findById(id)
    if (!notification) {
      return left(new NotificationNotFoundError(id))
    }
    notification.read()
    const savedNotification =
      await this.notificationRepository.save(notification)
    return right({
      notification: NotificationMapper.toDTO(savedNotification),
    })
  }
}
