import { FakeAggregateRoot } from '#/core/domain/@mocks/fake-aggregate-root.stub'
import { FakeDomainEvent } from '#/core/domain/@mocks/fake-domain-event.stub'

describe('AggregateRoot', () => {
  it('should be able to collect domain events', () => {
    const aggregate = FakeAggregateRoot.create({ name: 'test' })
    const event = new FakeDomainEvent(aggregate.id.toString())

    aggregate.addDomainEvent(event)

    expect(aggregate.domainEvents).toHaveLength(1)
    expect(aggregate.domainEvents[0]).toBe(event)
  })

  it('should be able to collect multiple domain events', () => {
    const aggregate = FakeAggregateRoot.create({ name: 'test' })
    const event1 = new FakeDomainEvent(aggregate.id.toString())
    const event2 = new FakeDomainEvent(aggregate.id.toString())

    aggregate.addDomainEvent(event1)
    aggregate.addDomainEvent(event2)

    expect(aggregate.domainEvents).toHaveLength(2)
  })

  it('should be able to clear domain events', () => {
    const aggregate = FakeAggregateRoot.create({ name: 'test' })
    aggregate.addDomainEvent(new FakeDomainEvent(aggregate.id.toString()))
    aggregate.addDomainEvent(new FakeDomainEvent(aggregate.id.toString()))

    aggregate.clearDomainEvents()

    expect(aggregate.domainEvents).toHaveLength(0)
  })

  it('should start with no domain events', () => {
    const aggregate = FakeAggregateRoot.create({ name: 'test' })

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
