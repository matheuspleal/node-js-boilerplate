import { type UniqueEntityId } from '@/core/domain/unique-entity.id'

export interface DomainEvent {
  readonly occurredAt: Date
  readonly aggregateId: UniqueEntityId
  readonly eventName: string
}
