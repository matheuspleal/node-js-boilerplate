import { type UseCase } from '@/core/application/use-cases/use-case'
import { type Either, right } from '@/core/shared/either'
import { type CountNotificationsByRecipientIdRepository } from '@/modules/notification/application/repositories/count-notifications-by-recipient-id.repository'
import { type FindManyNotificationsByRecipientIdRepository } from '@/modules/notification/application/repositories/find-many-notifications-by-recipient-id.repository'
import { type NotificationCollectionDTO } from '@/modules/notification/application/use-cases/dtos/notification.dto'
import { NotificationMapper } from '@/modules/notification/application/use-cases/mappers/notification.mapper'

export interface FetchNotificationsByRecipientUseCaseInput {
  recipientId: string
}

export type FetchNotificationsByRecipientUseCaseOutput = Either<
  never,
  {
    count: number
    notifications: NotificationCollectionDTO
  }
>

export class FetchNotificationsByRecipientUseCase implements UseCase<
  FetchNotificationsByRecipientUseCaseInput,
  FetchNotificationsByRecipientUseCaseOutput
> {
  constructor(
    private readonly notificationRepository: CountNotificationsByRecipientIdRepository &
      FindManyNotificationsByRecipientIdRepository,
  ) {}

  async execute({
    recipientId,
  }: FetchNotificationsByRecipientUseCaseInput): Promise<FetchNotificationsByRecipientUseCaseOutput> {
    const [count, notifications] = await Promise.all([
      this.notificationRepository.countByRecipientId(recipientId),
      this.notificationRepository.findManyByRecipientId(recipientId),
    ])
    return right({
      count,
      notifications: NotificationMapper.toCollectionDTO(notifications),
    })
  }
}
