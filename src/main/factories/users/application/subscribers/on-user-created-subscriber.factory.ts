import { makeSendNotificationUseCase } from '@/main/factories/notification/application/use-cases/send-notification-use-case.factory'
import { OnUserCreatedSubscriber } from '@/modules/users/application/subscribers/on-user-created.subscriber'

export function makeOnUserCreatedSubscriber(): OnUserCreatedSubscriber {
  const subscriber = new OnUserCreatedSubscriber(makeSendNotificationUseCase())
  subscriber.setupSubscriptions()
  return subscriber
}
