import { makeOnUserCreatedSubscriber } from '@/main/factories/users/application/subscribers/on-user-created-subscriber.factory'

export function subscribersSetup(): void {
  makeOnUserCreatedSubscriber()
}
