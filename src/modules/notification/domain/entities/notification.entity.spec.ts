import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import {
  NotificationEntity,
  type NotificationProps,
} from '@/modules/notification/domain/entities/notification.entity'
import { NotificationCreatedEvent } from '@/modules/notification/domain/events/notification-created.event'

import { UUIDRegExp } from '#/core/domain/@helpers/uuid-regexp'

describe('NotificationEntity', () => {
  let sut: NotificationEntity

  it('should be able to create an instance with required props', () => {
    sut = NotificationEntity.create({
      recipientId: new UniqueEntityId(),
      title: 'Welcome',
      content: 'Welcome to the platform!',
    })

    expect(sut.id).toBeInstanceOf(UniqueEntityId)
    expect(sut.id.toValue()).toMatch(UUIDRegExp)
    expect(sut.recipientId).toBeInstanceOf(UniqueEntityId)
    expect(sut.title).toEqual('Welcome')
    expect(sut.content).toEqual('Welcome to the platform!')
    expect(sut.readAt).toBeNull()
    expect(sut.isRead).toBe(false)
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  it('should be able to create an instance with all props', () => {
    const id = new UniqueEntityId()
    const recipientId = new UniqueEntityId()
    const createdAt = new Date()

    sut = NotificationEntity.create(
      {
        recipientId,
        title: 'Test',
        content: 'Test content',
        createdAt,
      },
      id,
    )

    expect(sut.id).toEqual(id)
    expect(sut.recipientId).toEqual(recipientId)
    expect(sut.createdAt).toEqual(createdAt)
  })

  it('should be able to mark as read', () => {
    sut = NotificationEntity.create({
      recipientId: new UniqueEntityId(),
      title: 'Test',
      content: 'Test content',
    })

    expect(sut.isRead).toBe(false)

    sut.read()

    expect(sut.isRead).toBe(true)
    expect(sut.readAt).toBeInstanceOf(Date)
  })

  it('should be able to emit NotificationCreatedEvent when created', () => {
    sut = NotificationEntity.create({
      recipientId: new UniqueEntityId(),
      title: 'Test',
      content: 'Test content',
    })

    expect(sut.domainEvents).toHaveLength(1)
    expect(sut.domainEvents[0]).toBeInstanceOf(NotificationCreatedEvent)
    expect(sut.domainEvents[0].aggregateId).toEqual(sut.id)
  })

  it('should not emit domain events when reconstituted', () => {
    const id = new UniqueEntityId()
    const props: NotificationProps = {
      recipientId: new UniqueEntityId(),
      title: 'Test',
      content: 'Test content',
      readAt: null,
      createdAt: new Date(),
    }

    const reconstituted = NotificationEntity.reconstitute(props, id)

    expect(reconstituted.domainEvents).toHaveLength(0)
  })
})
