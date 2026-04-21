import { faker } from '@faker-js/faker'
import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { type SaveNotificationRepository } from '@/modules/notification/application/repositories/save-notification.repository'
import { SendNotificationUseCase } from '@/modules/notification/application/use-cases/send-notification.use-case'
import { type NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'

import { makeNotificationEntityStub } from '#/modules/notification/domain/@mocks/notification-entity.stub'

describe('SendNotificationUseCase', () => {
  let sut: SendNotificationUseCase
  let notificationEntityStub: NotificationEntity
  let saveNotificationRepositoryMock: MockProxy<SaveNotificationRepository>
  let saveNotificationRepositorySpy: MockInstance

  beforeAll(() => {
    notificationEntityStub = makeNotificationEntityStub()
    saveNotificationRepositoryMock = mock<SaveNotificationRepository>()
    saveNotificationRepositoryMock.save.mockResolvedValue(
      notificationEntityStub,
    )
  })

  beforeEach(() => {
    saveNotificationRepositoryMock.save.mockClear()
  })

  beforeEach(() => {
    saveNotificationRepositorySpy = vi.spyOn(
      saveNotificationRepositoryMock,
      'save',
    )
    sut = new SendNotificationUseCase(saveNotificationRepositoryMock)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: faker.string.uuid(),
      title: 'Welcome',
      content: 'Welcome to the platform!',
    })

    expect(saveNotificationRepositorySpy).toHaveBeenCalledTimes(1)
    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveProperty('notification')
  })
})
