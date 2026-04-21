import { makeFetchNotificationsByRecipientUseCase } from '@/main/factories/notification/application/use-cases/fetch-notifications-by-recipient-use-case.factory'
import { FetchNotificationsByRecipientController } from '@/modules/notification/presentation/controllers/fetch-notifications-by-recipient.controller'

export function makeFetchNotificationsByRecipientController() {
  return new FetchNotificationsByRecipientController(
    makeFetchNotificationsByRecipientUseCase(),
  )
}
