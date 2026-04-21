import { mock, type MockProxy } from 'vitest-mock-extended'

import { DomainEvents } from '@/core/domain/events/domain-events'
import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { right } from '@/core/shared/either'
import { type SendNotificationUseCase } from '@/modules/notification/application/use-cases/send-notification.use-case'
import { OnUserCreatedSubscriber } from '@/modules/users/application/subscribers/on-user-created.subscriber'
import { UserCreatedEvent } from '@/modules/users/domain/events/user-created.event'

describe('OnUserCreatedSubscriber', () => {
  let sendNotificationUseCase: MockProxy<SendNotificationUseCase>
  let subscriber: OnUserCreatedSubscriber

  beforeEach(() => {
    sendNotificationUseCase = mock<SendNotificationUseCase>()
    subscriber = new OnUserCreatedSubscriber(sendNotificationUseCase)
  })

  afterEach(() => {
    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()
  })

  it('should invoke SendNotificationUseCase with the event aggregateId as recipientId', async () => {
    sendNotificationUseCase.execute.mockResolvedValue(
      right({
        notification: {
          id: 'notification-id',
          recipientId: 'user-id',
          title: 'Welcome!',
          content: 'Thanks for signing up. We are glad to have you with us.',
          readAt: null,
          createdAt: new Date(),
        },
      }),
    )
    const aggregateId = new UniqueEntityId('user-id')
    const event = new UserCreatedEvent(aggregateId)

    await subscriber.handle(event)

    expect(sendNotificationUseCase.execute).toHaveBeenCalledWith({
      recipientId: 'user-id',
      title: 'Welcome!',
      content: 'Thanks for signing up. We are glad to have you with us.',
    })
  })

  it('should swallow errors from the use case to preserve fire-and-forget semantics', async () => {
    sendNotificationUseCase.execute.mockRejectedValue(new Error('infra down'))
    const event = new UserCreatedEvent(new UniqueEntityId('user-id'))

    await expect(subscriber.handle(event)).resolves.toBeUndefined()
  })

  it('should register itself as a UserCreatedEvent handler on setupSubscriptions', async () => {
    const handleSpy = vi.spyOn(subscriber, 'handle').mockResolvedValue()
    subscriber.setupSubscriptions()
    const event = new UserCreatedEvent(new UniqueEntityId('user-id'))

    await DomainEvents.dispatch(event)

    expect(handleSpy).toHaveBeenCalledWith(event)
  })
})
