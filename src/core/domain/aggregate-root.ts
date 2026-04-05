import { Entity } from '@/core/domain/entity'
import { type DomainEvent } from '@/core/domain/events/domain-event'

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): ReadonlyArray<DomainEvent> {
    return this._domainEvents
  }

  addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event)
  }

  clearDomainEvents(): void {
    this._domainEvents = []
  }
}
