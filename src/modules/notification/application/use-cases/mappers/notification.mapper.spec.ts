import { type NotificationDTO } from '@/modules/notification/application/use-cases/dtos/notification.dto'
import { NotificationMapper } from '@/modules/notification/application/use-cases/mappers/notification.mapper'
import { NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'

import {
  makeNotificationEntityCollectionStub,
  makeNotificationEntityStub,
} from '#/modules/notification/domain/@mocks/notification-entity.stub'

describe('NotificationMapper', () => {
  let length: number
  let notificationEntity: NotificationEntity
  let notificationCollectionEntity: NotificationEntity[]

  beforeAll(() => {
    length = 20
    notificationEntity = makeNotificationEntityStub()
    notificationCollectionEntity = makeNotificationEntityCollectionStub({
      length,
    })
  })

  it('should be able to map NotificationEntity instance to NotificationDTO', () => {
    const entityToDTO = NotificationMapper.toDTO(notificationEntity)

    expect(entityToDTO).toEqual<NotificationDTO>({
      id: notificationEntity.id.toString(),
      recipientId: notificationEntity.recipientId.toString(),
      title: notificationEntity.title,
      content: notificationEntity.content,
      readAt: notificationEntity.readAt,
      createdAt: notificationEntity.createdAt,
    })
  })

  it('should be able to map a collection of NotificationEntity instances to a collection of NotificationDTO', () => {
    const collectionDTO = NotificationMapper.toCollectionDTO(
      notificationCollectionEntity,
    )

    expect(collectionDTO).toHaveLength(length)
    collectionDTO.forEach((item, index) => {
      expect(item).toEqual<NotificationDTO>({
        id: notificationCollectionEntity[index].id.toString(),
        recipientId: notificationCollectionEntity[index].recipientId.toString(),
        title: notificationCollectionEntity[index].title,
        content: notificationCollectionEntity[index].content,
        readAt: notificationCollectionEntity[index].readAt,
        createdAt: notificationCollectionEntity[index].createdAt,
      })
    })
  })
})
