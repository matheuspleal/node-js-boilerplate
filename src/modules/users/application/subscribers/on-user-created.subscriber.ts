import { type DomainEventHandler } from '@/core/domain/events/domain-event-handler'
import { DomainEvents } from '@/core/domain/events/domain-events'
import { type SendNotificationUseCase } from '@/modules/notification/application/use-cases/send-notification.use-case'
import { type UserCreatedEvent } from '@/modules/users/domain/events/user-created.event'

export class OnUserCreatedSubscriber implements DomainEventHandler<UserCreatedEvent> {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {}

  setupSubscriptions(): void {
    DomainEvents.register('UserCreatedEvent', this)
  }

  async handle(event: UserCreatedEvent): Promise<void> {
    try {
      await this.sendNotificationUseCase.execute({
        recipientId: event.aggregateId.toValue(),
        title: 'Welcome!',
        content: 'Thanks for signing up. We are glad to have you with us.',
      })
    } catch {
      // fire-and-forget: subscriber failures must not abort the emitting aggregate
    }
  }
}
