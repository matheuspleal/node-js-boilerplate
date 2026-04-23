import { type DomainEvent } from '@/core/domain/events/domain-event'
import { type UniqueEntityId } from '@/core/domain/unique-entity.id'

export class UserCreatedEvent implements DomainEvent {
  readonly occurredAt: Date
  readonly eventName = 'UserCreatedEvent'

  constructor(public readonly aggregateId: UniqueEntityId) {
    this.occurredAt = new Date()
  }
}
