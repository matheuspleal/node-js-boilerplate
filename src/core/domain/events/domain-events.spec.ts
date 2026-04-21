import { DomainEvents } from '@/core/domain/events/domain-events'
import { UniqueEntityId } from '@/core/domain/unique-entity.id'

import { FakeAggregateRoot } from '#/core/domain/@mocks/fake-aggregate-root.stub'
import { FakeDomainEvent } from '#/core/domain/@mocks/fake-domain-event.stub'

describe('DomainEvents', () => {
  afterEach(() => {
    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()
  })

  it('should be able to register a handler and dispatch an event to it', async () => {
    const handler = { handle: vi.fn() }
    DomainEvents.register('FakeDomainEvent', handler)
    const event = new FakeDomainEvent('aggregate-1')

    await DomainEvents.dispatch(event)

    expect(handler.handle).toHaveBeenCalledTimes(1)
    expect(handler.handle).toHaveBeenCalledWith(event)
  })

  it('should be able to dispatch an event to multiple handlers', async () => {
    const handler1 = { handle: vi.fn() }
    const handler2 = { handle: vi.fn() }
    DomainEvents.register('FakeDomainEvent', handler1)
    DomainEvents.register('FakeDomainEvent', handler2)
    const event = new FakeDomainEvent('aggregate-1')

    await DomainEvents.dispatch(event)

    expect(handler1.handle).toHaveBeenCalledTimes(1)
    expect(handler2.handle).toHaveBeenCalledTimes(1)
  })

  it('should not fail when dispatching an event with no registered handlers', async () => {
    const event = new FakeDomainEvent('aggregate-1')

    await expect(DomainEvents.dispatch(event)).resolves.toBeUndefined()
  })

  it('should be able to clear all handlers', async () => {
    const handler = { handle: vi.fn() }
    DomainEvents.register('FakeDomainEvent', handler)
    DomainEvents.clearHandlers()
    const event = new FakeDomainEvent('aggregate-1')

    await DomainEvents.dispatch(event)

    expect(handler.handle).not.toHaveBeenCalled()
  })

  it('should not dispatch events of a different event name', async () => {
    const handler = { handle: vi.fn() }
    DomainEvents.register('OtherEvent', handler)
    const event = new FakeDomainEvent('aggregate-1')

    await DomainEvents.dispatch(event)

    expect(handler.handle).not.toHaveBeenCalled()
  })

  describe('markAggregateForDispatch', () => {
    it('should be able to mark an aggregate for dispatch', async () => {
      const handler = { handle: vi.fn() }
      DomainEvents.register('FakeDomainEvent', handler)
      const aggregate = FakeAggregateRoot.create({ name: 'test' })
      const event = new FakeDomainEvent(aggregate.id.toString())
      aggregate.addDomainEvent(event)

      DomainEvents.markAggregateForDispatch(aggregate)
      await DomainEvents.dispatchEventsForAggregate(aggregate.id)

      expect(handler.handle).toHaveBeenCalledTimes(1)
      expect(handler.handle).toHaveBeenCalledWith(event)
    })

    it('should be idempotent when marking the same aggregate twice', async () => {
      const handler = { handle: vi.fn() }
      DomainEvents.register('FakeDomainEvent', handler)
      const aggregate = FakeAggregateRoot.create({ name: 'test' })
      aggregate.addDomainEvent(new FakeDomainEvent(aggregate.id.toString()))

      DomainEvents.markAggregateForDispatch(aggregate)
      DomainEvents.markAggregateForDispatch(aggregate)
      await DomainEvents.dispatchEventsForAggregate(aggregate.id)

      expect(handler.handle).toHaveBeenCalledTimes(1)
    })
  })

  describe('dispatchEventsForAggregate', () => {
    it('should dispatch all events of the aggregate to registered handlers', async () => {
      const handler = { handle: vi.fn() }
      DomainEvents.register('FakeDomainEvent', handler)
      const aggregate = FakeAggregateRoot.create({ name: 'test' })
      const event1 = new FakeDomainEvent(aggregate.id.toString())
      const event2 = new FakeDomainEvent(aggregate.id.toString())
      aggregate.addDomainEvent(event1)
      aggregate.addDomainEvent(event2)
      DomainEvents.markAggregateForDispatch(aggregate)

      await DomainEvents.dispatchEventsForAggregate(aggregate.id)

      expect(handler.handle).toHaveBeenCalledTimes(2)
      expect(handler.handle).toHaveBeenNthCalledWith(1, event1)
      expect(handler.handle).toHaveBeenNthCalledWith(2, event2)
    })

    it('should clear domain events of the aggregate after dispatch', async () => {
      const handler = { handle: vi.fn() }
      DomainEvents.register('FakeDomainEvent', handler)
      const aggregate = FakeAggregateRoot.create({ name: 'test' })
      aggregate.addDomainEvent(new FakeDomainEvent(aggregate.id.toString()))
      DomainEvents.markAggregateForDispatch(aggregate)

      await DomainEvents.dispatchEventsForAggregate(aggregate.id)

      expect(aggregate.domainEvents).toHaveLength(0)
    })

    it('should remove the aggregate from the marked list after dispatch', async () => {
      const handler = { handle: vi.fn() }
      DomainEvents.register('FakeDomainEvent', handler)
      const aggregate = FakeAggregateRoot.create({ name: 'test' })
      aggregate.addDomainEvent(new FakeDomainEvent(aggregate.id.toString()))
      DomainEvents.markAggregateForDispatch(aggregate)

      await DomainEvents.dispatchEventsForAggregate(aggregate.id)
      aggregate.addDomainEvent(new FakeDomainEvent(aggregate.id.toString()))
      await DomainEvents.dispatchEventsForAggregate(aggregate.id)

      expect(handler.handle).toHaveBeenCalledTimes(1)
    })

    it('should not fail when dispatching for an unknown aggregate id', async () => {
      const unknownId = new UniqueEntityId()

      await expect(
        DomainEvents.dispatchEventsForAggregate(unknownId),
      ).resolves.toBeUndefined()
    })
  })

  describe('clearMarkedAggregates', () => {
    it('should clear the marked aggregates list', async () => {
      const handler = { handle: vi.fn() }
      DomainEvents.register('FakeDomainEvent', handler)
      const aggregate = FakeAggregateRoot.create({ name: 'test' })
      aggregate.addDomainEvent(new FakeDomainEvent(aggregate.id.toString()))
      DomainEvents.markAggregateForDispatch(aggregate)

      DomainEvents.clearMarkedAggregates()
      await DomainEvents.dispatchEventsForAggregate(aggregate.id)

      expect(handler.handle).not.toHaveBeenCalled()
    })
  })
})
