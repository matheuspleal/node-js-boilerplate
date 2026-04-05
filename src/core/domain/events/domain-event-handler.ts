import { type DomainEvent } from '@/core/domain/events/domain-event'

export interface DomainEventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>
}
