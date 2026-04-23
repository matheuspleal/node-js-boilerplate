import { type DomainEvent } from '@/core/domain/events/domain-event'
import { type UniqueEntityId } from '@/core/domain/unique-entity.id'

export class UserPasswordChangedEvent implements DomainEvent {
  readonly occurredAt: Date
  readonly eventName = 'UserPasswordChangedEvent'

  constructor(public readonly aggregateId: UniqueEntityId) {
    this.occurredAt = new Date()
  }
}
