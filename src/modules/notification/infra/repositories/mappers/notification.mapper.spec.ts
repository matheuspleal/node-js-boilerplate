import { faker } from '@faker-js/faker'

import { type NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'
import { NotificationMapper } from '@/modules/notification/infra/repositories/mappers/notification.mapper'
import { type NotificationPersistence } from '@/modules/notification/infra/repositories/persistence/notification.persistence'

import {
  makeNotificationEntityCollectionStub,
  makeNotificationEntityStub,
} from '#/modules/notification/domain/@mocks/notification-entity.stub'

function makeNotificationPersistenceStub(): NotificationPersistence {
  return {
    id: faker.string.uuid(),
    recipientId: faker.string.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    readAt: null,
    createdAt: faker.date.recent(),
  }
}

describe('NotificationMapper (Infra)', () => {
  let notificationEntity: NotificationEntity
  let notificationCollectionEntity: NotificationEntity[]
  let notificationPersistence: NotificationPersistence

  beforeAll(() => {
    notificationEntity = makeNotificationEntityStub()
    notificationCollectionEntity = makeNotificationEntityCollectionStub({
      length: 5,
    })
    notificationPersistence = makeNotificationPersistenceStub()
  })

  it('should be able to map NotificationEntity to NotificationPersistence', () => {
    const result = NotificationMapper.toPersistence(notificationEntity)

    expect(result).toEqual({
      id: notificationEntity.id.toString(),
      recipientId: notificationEntity.recipientId.toString(),
      title: notificationEntity.title,
      content: notificationEntity.content,
      readAt: notificationEntity.readAt,
      createdAt: notificationEntity.createdAt,
    })
  })

  it('should be able to map NotificationPersistence to NotificationEntity', () => {
    const result = NotificationMapper.toDomain(notificationPersistence)

    expect(result.id.toValue()).toEqual(notificationPersistence.id)
    expect(result.recipientId.toValue()).toEqual(
      notificationPersistence.recipientId,
    )
    expect(result.title).toEqual(notificationPersistence.title)
    expect(result.content).toEqual(notificationPersistence.content)
    expect(result.readAt).toEqual(notificationPersistence.readAt)
    expect(result.createdAt).toEqual(notificationPersistence.createdAt)
  })

  it('should be able to map a collection of NotificationPersistence to NotificationEntity', () => {
    const persistenceList = notificationCollectionEntity.map((entity) =>
      NotificationMapper.toPersistence(entity),
    )

    const result = NotificationMapper.toCollectionDomain(persistenceList)

    expect(result).toHaveLength(notificationCollectionEntity.length)
  })
})
