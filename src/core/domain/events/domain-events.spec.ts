import { DomainEvents } from '@/core/domain/events/domain-events'

import { FakeDomainEvent } from '#/core/domain/@mocks/fake-domain-event.stub'

describe('DomainEvents', () => {
  afterEach(() => {
    DomainEvents.clearHandlers()
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
})
