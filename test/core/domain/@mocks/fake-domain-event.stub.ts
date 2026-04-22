import { type DomainEvent } from '@/core/domain/events/domain-event'
import { UniqueEntityId } from '@/core/domain/unique-entity.id'

export class FakeDomainEvent implements DomainEvent {
  readonly occurredAt: Date
  readonly eventName: string
  readonly aggregateId: UniqueEntityId

  constructor(aggregateId?: string, eventName?: string) {
    this.occurredAt = new Date()
    this.aggregateId = new UniqueEntityId(aggregateId)
    this.eventName = eventName ?? 'FakeDomainEvent'
  }
}
