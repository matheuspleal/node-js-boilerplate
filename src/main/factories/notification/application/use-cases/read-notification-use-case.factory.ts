import { makeNotificationPrismaRepository } from '@/main/factories/notification/infra/repositories/notification-prisma-repository.factory'
import { ReadNotificationUseCase } from '@/modules/notification/application/use-cases/read-notification.use-case'

export function makeReadNotificationUseCase() {
  return new ReadNotificationUseCase(makeNotificationPrismaRepository())
}
