import { Entity } from '@/core/domain/entity'
import { type DomainEvent } from '@/core/domain/events/domain-event'
import { DomainEvents } from '@/core/domain/events/domain-events'

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): ReadonlyArray<DomainEvent> {
    return this._domainEvents
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event)
    DomainEvents.markAggregateForDispatch(this)
  }

  clearDomainEvents(): void {
    this._domainEvents = []
  }
}
