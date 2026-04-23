import { makeNotificationPrismaRepository } from '@/main/factories/notification/infra/repositories/notification-prisma-repository.factory'
import { SendNotificationUseCase } from '@/modules/notification/application/use-cases/send-notification.use-case'

export function makeSendNotificationUseCase() {
  return new SendNotificationUseCase(makeNotificationPrismaRepository())
}
