import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { NotificationCreatedEvent } from '@/modules/notification/domain/events/notification-created.event'

describe('NotificationCreatedEvent', () => {
  it('should be able to create an event with correct properties', () => {
    const aggregateId = new UniqueEntityId()
    const event = new NotificationCreatedEvent(aggregateId)

    expect(event.aggregateId).toEqual(aggregateId)
    expect(event.eventName).toEqual('NotificationCreatedEvent')
    expect(event.occurredAt).toBeInstanceOf(Date)
  })
})
