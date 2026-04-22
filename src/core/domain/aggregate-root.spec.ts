import { DomainEvents } from '@/core/domain/events/domain-events'

import { FakeAggregateRoot } from '#/core/domain/@mocks/fake-aggregate-root.stub'
import { FakeDomainEvent } from '#/core/domain/@mocks/fake-domain-event.stub'

describe('AggregateRoot', () => {
  afterEach(() => {
    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()
  })

  it('should be able to collect domain events', () => {
    const aggregate = FakeAggregateRoot.create({ name: 'test' })
    const event = new FakeDomainEvent(aggregate.id.toString())

    aggregate.publishDomainEvent(event)

    expect(aggregate.domainEvents).toHaveLength(1)
    expect(aggregate.domainEvents[0]).toBe(event)
  })

  it('should be able to collect multiple domain events', () => {
    const aggregate = FakeAggregateRoot.create({ name: 'test' })
    const event1 = new FakeDomainEvent(aggregate.id.toString())
    const event2 = new FakeDomainEvent(aggregate.id.toString())

    aggregate.publishDomainEvent(event1)
    aggregate.publishDomainEvent(event2)

    expect(aggregate.domainEvents).toHaveLength(2)
  })

  it('should be able to clear domain events', () => {
    const aggregate = FakeAggregateRoot.create({ name: 'test' })
    aggregate.publishDomainEvent(new FakeDomainEvent(aggregate.id.toString()))
    aggregate.publishDomainEvent(new FakeDomainEvent(aggregate.id.toString()))

    aggregate.clearDomainEvents()

    expect(aggregate.domainEvents).toHaveLength(0)
  })

  it('should start with no domain events', () => {
    const aggregate = FakeAggregateRoot.create({ name: 'test' })

    expect(aggregate.domainEvents).toHaveLength(0)
  })

  it('should mark itself for dispatch when an event is added', async () => {
    const handler = { handle: vi.fn() }
    DomainEvents.register('FakeDomainEvent', handler)
    const aggregate = FakeAggregateRoot.create({ name: 'test' })
    const event = new FakeDomainEvent(aggregate.id.toString())

    aggregate.publishDomainEvent(event)
    await DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(handler.handle).toHaveBeenCalledWith(event)
  })

  it('should restrict addDomainEvent to subclasses (protected)', () => {
    const aggregate = FakeAggregateRoot.create({ name: 'test' })
    const event = new FakeDomainEvent(aggregate.id.toString())

    // @ts-expect-error addDomainEvent is protected and cannot be called from outside the class
    expect(() => aggregate.addDomainEvent(event)).not.toThrow()
  })
})
