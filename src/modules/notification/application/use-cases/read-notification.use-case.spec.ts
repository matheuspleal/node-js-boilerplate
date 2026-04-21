import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { type FindNotificationByIdRepository } from '@/modules/notification/application/repositories/find-notification-by-id.repository'
import { type SaveNotificationRepository } from '@/modules/notification/application/repositories/save-notification.repository'
import { ReadNotificationUseCase } from '@/modules/notification/application/use-cases/read-notification.use-case'
import { type NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'
import { NotificationNotFoundError } from '@/modules/notification/domain/errors/notification-not-found.error'

import { makeNotificationEntityStub } from '#/modules/notification/domain/@mocks/notification-entity.stub'

describe('ReadNotificationUseCase', () => {
  let sut: ReadNotificationUseCase
  let notificationEntityStub: NotificationEntity
  let findNotificationByIdRepositoryMock: MockProxy<FindNotificationByIdRepository>
  let findNotificationByIdRepositorySpy: MockInstance
  let saveNotificationRepositoryMock: MockProxy<SaveNotificationRepository>
  let saveNotificationRepositorySpy: MockInstance

  beforeAll(() => {
    notificationEntityStub = makeNotificationEntityStub()
    findNotificationByIdRepositoryMock = mock<FindNotificationByIdRepository>()
    findNotificationByIdRepositoryMock.findById.mockResolvedValue(
      notificationEntityStub,
    )
    saveNotificationRepositoryMock = mock<SaveNotificationRepository>()
    saveNotificationRepositoryMock.save.mockResolvedValue(
      notificationEntityStub,
    )
  })

  beforeEach(() => {
    findNotificationByIdRepositoryMock.findById.mockClear()
    saveNotificationRepositoryMock.save.mockClear()
  })

  beforeEach(() => {
    findNotificationByIdRepositorySpy = vi.spyOn(
      findNotificationByIdRepositoryMock,
      'findById',
    )
    saveNotificationRepositorySpy = vi.spyOn(
      saveNotificationRepositoryMock,
      'save',
    )
    sut = new ReadNotificationUseCase({
      findById: findNotificationByIdRepositoryMock.findById,
      save: saveNotificationRepositoryMock.save,
    })
  })

  it('should return NotificationNotFoundError when notification does not exist', async () => {
    findNotificationByIdRepositoryMock.findById.mockResolvedValueOnce(null)
    const id = 'fake-non-existent-id'

    const result = await sut.execute({ id })

    expect(findNotificationByIdRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findNotificationByIdRepositorySpy).toHaveBeenCalledWith(id)
    expect(saveNotificationRepositorySpy).not.toHaveBeenCalled()
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotificationNotFoundError)
  })

  it('should be able to mark a notification as read', async () => {
    const id = notificationEntityStub.id.toString()

    const result = await sut.execute({ id })

    expect(findNotificationByIdRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findNotificationByIdRepositorySpy).toHaveBeenCalledWith(id)
    expect(saveNotificationRepositorySpy).toHaveBeenCalledTimes(1)
    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveProperty('notification')
  })
})
