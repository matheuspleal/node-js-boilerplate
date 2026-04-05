import { type DomainEvent } from '@/core/domain/events/domain-event'
import { type DomainEventHandler } from '@/core/domain/events/domain-event-handler'

export class DomainEvents {
  private static handlersMap = new Map<string, DomainEventHandler[]>()

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

  static clearHandlers(): void {
    this.handlersMap.clear()
  }
}
