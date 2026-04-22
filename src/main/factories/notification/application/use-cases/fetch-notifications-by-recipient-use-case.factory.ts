import { makeNotificationPrismaRepository } from '@/main/factories/notification/infra/repositories/notification-prisma-repository.factory'
import { FetchNotificationsByRecipientUseCase } from '@/modules/notification/application/use-cases/fetch-notifications-by-recipient.use-case'

export function makeFetchNotificationsByRecipientUseCase() {
  return new FetchNotificationsByRecipientUseCase(
    makeNotificationPrismaRepository(),
  )
}
