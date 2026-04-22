import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { UserCreatedEvent } from '@/modules/users/domain/events/user-created.event'

describe('UserCreatedEvent', () => {
  it('should be able to create a UserCreatedEvent with correct properties', () => {
    const aggregateId = new UniqueEntityId()

    const event = new UserCreatedEvent(aggregateId)

    expect(event.aggregateId).toEqual(aggregateId)
    expect(event.eventName).toEqual('UserCreatedEvent')
    expect(event.occurredAt).toBeInstanceOf(Date)
  })
})
