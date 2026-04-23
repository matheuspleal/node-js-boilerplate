import { faker } from '@faker-js/faker'
import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { StatusCode } from '@/core/presentation/helpers/http.helper'
import { right } from '@/core/shared/either'
import { type NotificationCollectionDTO } from '@/modules/notification/application/use-cases/dtos/notification.dto'
import { type FetchNotificationsByRecipientUseCase } from '@/modules/notification/application/use-cases/fetch-notifications-by-recipient.use-case'
import { NotificationMapper } from '@/modules/notification/application/use-cases/mappers/notification.mapper'
import { FetchNotificationsByRecipientController } from '@/modules/notification/presentation/controllers/fetch-notifications-by-recipient.controller'

import { makeNotificationEntityCollectionStub } from '#/modules/notification/domain/@mocks/notification-entity.stub'

describe('FetchNotificationsByRecipientController', () => {
  let sut: FetchNotificationsByRecipientController
  let recipientId: string
  let notificationsDTOStub: NotificationCollectionDTO
  let fetchNotificationsUseCaseMock: MockProxy<FetchNotificationsByRecipientUseCase>
  let fetchNotificationsUseCaseSpy: MockInstance

  beforeAll(() => {
    recipientId = faker.string.uuid()
    const entities = makeNotificationEntityCollectionStub({
      notificationInput: { recipientId: new UniqueEntityId(recipientId) },
      length: 3,
    })
    notificationsDTOStub = NotificationMapper.toCollectionDTO(entities)
    fetchNotificationsUseCaseMock = mock<FetchNotificationsByRecipientUseCase>()
    fetchNotificationsUseCaseMock.execute.mockResolvedValue(
      right({
        count: 3,
        notifications: notificationsDTOStub,
      }),
    )
  })

  beforeEach(() => {
    fetchNotificationsUseCaseMock.execute.mockClear()
  })

  beforeEach(() => {
    fetchNotificationsUseCaseSpy = vi.spyOn(
      fetchNotificationsUseCaseMock,
      'execute',
    )
    sut = new FetchNotificationsByRecipientController(
      fetchNotificationsUseCaseMock,
    )
  })

  it('should be able to return InvalidUUIDError when recipientId is invalid', async () => {
    const response = await sut.handle({ recipientId: 'invalid-uuid' })

    expect(fetchNotificationsUseCaseSpy).not.toHaveBeenCalled()
    expect(response.statusCode).toEqual(StatusCode.BAD_REQUEST)
  })

  it('should be able to return notifications by recipient', async () => {
    const response = await sut.handle({ recipientId })

    expect(fetchNotificationsUseCaseSpy).toHaveBeenCalledTimes(1)
    expect(fetchNotificationsUseCaseSpy).toHaveBeenCalledWith({ recipientId })
    expect(response).toEqual({
      statusCode: StatusCode.OK,
      data: {
        count: 3,
        notifications: notificationsDTOStub,
      },
    })
  })
})
