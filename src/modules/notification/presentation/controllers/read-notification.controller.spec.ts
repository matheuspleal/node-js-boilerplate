import { faker } from '@faker-js/faker'
import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { StatusCode } from '@/core/presentation/helpers/http.helper'
import { left, right } from '@/core/shared/either'
import { type NotificationDTO } from '@/modules/notification/application/use-cases/dtos/notification.dto'
import { NotificationMapper } from '@/modules/notification/application/use-cases/mappers/notification.mapper'
import { type ReadNotificationUseCase } from '@/modules/notification/application/use-cases/read-notification.use-case'
import { NotificationNotFoundError } from '@/modules/notification/domain/errors/notification-not-found.error'
import { ReadNotificationController } from '@/modules/notification/presentation/controllers/read-notification.controller'

import { makeNotificationEntityStub } from '#/modules/notification/domain/@mocks/notification-entity.stub'

describe('ReadNotificationController', () => {
  let sut: ReadNotificationController
  let notificationDTOStub: NotificationDTO
  let readNotificationUseCaseMock: MockProxy<ReadNotificationUseCase>
  let readNotificationUseCaseSpy: MockInstance

  beforeAll(() => {
    const entity = makeNotificationEntityStub()
    notificationDTOStub = NotificationMapper.toDTO(entity)
    readNotificationUseCaseMock = mock<ReadNotificationUseCase>()
    readNotificationUseCaseMock.execute.mockResolvedValue(
      right({ notification: notificationDTOStub }),
    )
  })

  beforeEach(() => {
    readNotificationUseCaseMock.execute.mockClear()
  })

  beforeEach(() => {
    readNotificationUseCaseSpy = vi.spyOn(
      readNotificationUseCaseMock,
      'execute',
    )
    sut = new ReadNotificationController(readNotificationUseCaseMock)
  })

  it('should be able to return InvalidUUIDError when id is invalid', async () => {
    const response = await sut.handle({ id: 'invalid-uuid' })

    expect(readNotificationUseCaseSpy).not.toHaveBeenCalled()
    expect(response.statusCode).toEqual(StatusCode.BAD_REQUEST)
  })

  it('should be able to return NotificationNotFoundError when not found', async () => {
    const id = faker.string.uuid()
    readNotificationUseCaseMock.execute.mockResolvedValueOnce(
      left(new NotificationNotFoundError(id)),
    )

    const response = await sut.handle({ id })

    expect(readNotificationUseCaseSpy).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toEqual(StatusCode.NOT_FOUND)
  })

  it('should be able to mark notification as read', async () => {
    const id = notificationDTOStub.id

    const response = await sut.handle({ id })

    expect(readNotificationUseCaseSpy).toHaveBeenCalledTimes(1)
    expect(readNotificationUseCaseSpy).toHaveBeenCalledWith({ id })
    expect(response).toEqual({
      statusCode: StatusCode.OK,
      data: { notification: notificationDTOStub },
    })
  })
})
