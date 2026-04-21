import { type AggregateRoot } from '@/core/domain/aggregate-root'
import { type DomainEvent } from '@/core/domain/events/domain-event'
import { type DomainEventHandler } from '@/core/domain/events/domain-event-handler'
import { type UniqueEntityId } from '@/core/domain/unique-entity.id'

export class DomainEvents {
  private static handlersMap = new Map<string, DomainEventHandler[]>()
  private static markedAggregates: AggregateRoot<unknown>[] = []

  static register(eventName: string, handler: DomainEventHandler): void {
    const handlers = this.handlersMap.get(eventName) ?? []
    handlers.push(handler)
    this.handlersMap.set(eventName, handlers)
  }

  static async dispatch(event: DomainEvent): Promise<void> {
    const handlers = this.handlersMap.get(event.eventName) ?? []
    for (const handler of handlers) {
      await handler.handle(event)
    }
  }

  static markAggregateForDispatch(aggregate: AggregateRoot<unknown>): void {
    const alreadyMarked = this.findMarkedAggregateByID(aggregate.id)
    if (!alreadyMarked) {
      this.markedAggregates.push(aggregate)
    }
  }

  static async dispatchEventsForAggregate(id: UniqueEntityId): Promise<void> {
    const aggregate = this.findMarkedAggregateByID(id)
    if (!aggregate) {
      return
    }
    await this.dispatchAggregateEvents(aggregate)
    aggregate.clearDomainEvents()
    this.removeAggregateFromMarkedDispatchList(aggregate)
  }

  static clearHandlers(): void {
    this.handlersMap.clear()
  }

  static clearMarkedAggregates(): void {
    this.markedAggregates = []
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityId,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ): void {
    this.markedAggregates = this.markedAggregates.filter(
      (marked) => !marked.id.equals(aggregate.id),
    )
  }

  private static async dispatchAggregateEvents(
    aggregate: AggregateRoot<unknown>,
  ): Promise<void> {
    for (const event of aggregate.domainEvents) {
      await this.dispatch(event)
    }
  }
}
