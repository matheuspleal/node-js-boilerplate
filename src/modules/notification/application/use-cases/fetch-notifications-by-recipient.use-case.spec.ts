import { faker } from '@faker-js/faker'
import { type MockInstance } from 'vitest'
import { type MockProxy, mock } from 'vitest-mock-extended'

import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import { type CountNotificationsByRecipientIdRepository } from '@/modules/notification/application/repositories/count-notifications-by-recipient-id.repository'
import { type FindManyNotificationsByRecipientIdRepository } from '@/modules/notification/application/repositories/find-many-notifications-by-recipient-id.repository'
import { FetchNotificationsByRecipientUseCase } from '@/modules/notification/application/use-cases/fetch-notifications-by-recipient.use-case'
import { NotificationMapper } from '@/modules/notification/application/use-cases/mappers/notification.mapper'
import { type NotificationEntity } from '@/modules/notification/domain/entities/notification.entity'

import { makeNotificationEntityCollectionStub } from '#/modules/notification/domain/@mocks/notification-entity.stub'

describe('FetchNotificationsByRecipientUseCase', () => {
  let sut: FetchNotificationsByRecipientUseCase
  let recipientId: string
  let notificationsStub: NotificationEntity[]
  let countRepositoryMock: MockProxy<CountNotificationsByRecipientIdRepository>
  let countRepositorySpy: MockInstance
  let findManyRepositoryMock: MockProxy<FindManyNotificationsByRecipientIdRepository>
  let findManyRepositorySpy: MockInstance

  beforeAll(() => {
    recipientId = faker.string.uuid()
    notificationsStub = makeNotificationEntityCollectionStub({
      notificationInput: { recipientId: new UniqueEntityId(recipientId) },
      length: 5,
    })
    countRepositoryMock = mock<CountNotificationsByRecipientIdRepository>()
    countRepositoryMock.countByRecipientId.mockResolvedValue(5)
    findManyRepositoryMock =
      mock<FindManyNotificationsByRecipientIdRepository>()
    findManyRepositoryMock.findManyByRecipientId.mockResolvedValue(
      notificationsStub,
    )
  })

  beforeEach(() => {
    countRepositoryMock.countByRecipientId.mockClear()
    findManyRepositoryMock.findManyByRecipientId.mockClear()
  })

  beforeEach(() => {
    countRepositorySpy = vi.spyOn(countRepositoryMock, 'countByRecipientId')
    findManyRepositorySpy = vi.spyOn(
      findManyRepositoryMock,
      'findManyByRecipientId',
    )
    sut = new FetchNotificationsByRecipientUseCase({
      countByRecipientId: countRepositoryMock.countByRecipientId,
      findManyByRecipientId: findManyRepositoryMock.findManyByRecipientId,
    })
  })

  it('should be able to fetch notifications by recipient id', async () => {
    const result = await sut.execute({ recipientId })

    expect(countRepositorySpy).toHaveBeenCalledTimes(1)
    expect(countRepositorySpy).toHaveBeenCalledWith(recipientId)
    expect(findManyRepositorySpy).toHaveBeenCalledTimes(1)
    expect(findManyRepositorySpy).toHaveBeenCalledWith(recipientId)
    expect(result.isRight()).toBe(true)
    expect(result.value.count).toEqual(5)
    expect(result.value.notifications).toEqual(
      NotificationMapper.toCollectionDTO(notificationsStub),
    )
  })
})
