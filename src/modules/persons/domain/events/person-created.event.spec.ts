import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { PersonCreatedEvent } from '@/modules/persons/domain/events/person-created.event'

describe('PersonCreatedEvent', () => {
  it('should be able to create a PersonCreatedEvent with correct properties', () => {
    const aggregateId = new UniqueEntityId()

    const event = new PersonCreatedEvent(aggregateId)

    expect(event.aggregateId).toEqual(aggregateId)
    expect(event.eventName).toEqual('PersonCreatedEvent')
    expect(event.occurredAt).toBeInstanceOf(Date)
  })
})
