import { makeReadNotificationUseCase } from '@/main/factories/notification/application/use-cases/read-notification-use-case.factory'
import { ReadNotificationController } from '@/modules/notification/presentation/controllers/read-notification.controller'

export function makeReadNotificationController() {
  return new ReadNotificationController(makeReadNotificationUseCase())
}
