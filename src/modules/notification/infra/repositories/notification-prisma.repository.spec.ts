import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended'

import { DomainEvents } from '@/core/domain/events/domain-events'
import { type PrismaClient } from '@/core/infra/repositories/prisma/generated/client'
import { PrismaConnectionManager } from '@/core/infra/repositories/prisma/prisma-connection-manager'
import { NotificationMapper } from '@/modules/notification/infra/repositories/mappers/notification.mapper'
import { NotificationPrismaRepository } from '@/modules/notification/infra/repositories/notification-prisma.repository'

import { makeNotificationEntityStub } from '#/modules/notification/domain/@mocks/notification-entity.stub'

describe('NotificationPrismaRepository', () => {
  let prismaClient: DeepMockProxy<PrismaClient>
  let repository: NotificationPrismaRepository

  beforeEach(() => {
    prismaClient = mockDeep<PrismaClient>()
    vi.spyOn(PrismaConnectionManager, 'getInstance').mockReturnValue(
      prismaClient,
    )
    repository = new NotificationPrismaRepository()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()
  })

  describe('save', () => {
    it('should dispatch domain events for the aggregate after upsert', async () => {
      const notification = makeNotificationEntityStub()
      prismaClient.notification.upsert.mockResolvedValue(
        NotificationMapper.toPersistence(notification),
      )
      const dispatchSpy = vi.spyOn(DomainEvents, 'dispatchEventsForAggregate')

      await repository.save(notification)

      expect(prismaClient.notification.upsert).toHaveBeenCalledTimes(1)
      expect(dispatchSpy).toHaveBeenCalledWith(notification.id)
      expect(
        prismaClient.notification.upsert.mock.invocationCallOrder[0],
      ).toBeLessThan(dispatchSpy.mock.invocationCallOrder[0])
    })
  })
})
