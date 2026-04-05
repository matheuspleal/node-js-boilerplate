import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { UserPasswordChangedEvent } from '@/modules/users/domain/events/user-password-changed.event'

describe('UserPasswordChangedEvent', () => {
  it('should be able to create an event with correct properties', () => {
    const aggregateId = new UniqueEntityId()
    const event = new UserPasswordChangedEvent(aggregateId)

    expect(event.aggregateId).toEqual(aggregateId)
    expect(event.eventName).toEqual('UserPasswordChangedEvent')
    expect(event.occurredAt).toBeInstanceOf(Date)
  })
})
