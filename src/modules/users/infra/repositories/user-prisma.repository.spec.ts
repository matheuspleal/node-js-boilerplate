import { mockDeep, type DeepMockProxy } from 'vitest-mock-extended'

import { DomainEvents } from '@/core/domain/events/domain-events'
import { type PrismaClient } from '@/core/infra/repositories/prisma/generated/client'
import { PrismaConnectionManager } from '@/core/infra/repositories/prisma/prisma-connection-manager'
import { UserMapper } from '@/modules/users/infra/repositories/mappers/user.mapper'
import { UserPrismaRepository } from '@/modules/users/infra/repositories/user-prisma.repository'

import { makeUserEntityStub } from '#/modules/users/domain/@mocks/user-entity.stub'

describe('UserPrismaRepository', () => {
  let prismaClient: DeepMockProxy<PrismaClient>
  let repository: UserPrismaRepository

  beforeEach(() => {
    prismaClient = mockDeep<PrismaClient>()
    vi.spyOn(PrismaConnectionManager, 'getInstance').mockReturnValue(
      prismaClient,
    )
    repository = new UserPrismaRepository()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()
  })

  describe('save', () => {
    it('should dispatch domain events for the aggregate after upsert', async () => {
      const user = makeUserEntityStub()
      prismaClient.user.upsert.mockResolvedValue(UserMapper.toPersistence(user))
      const dispatchSpy = vi.spyOn(DomainEvents, 'dispatchEventsForAggregate')

      await repository.save(user)

      expect(prismaClient.user.upsert).toHaveBeenCalledTimes(1)
      expect(dispatchSpy).toHaveBeenCalledWith(user.id)
      expect(prismaClient.user.upsert.mock.invocationCallOrder[0]).toBeLessThan(
        dispatchSpy.mock.invocationCallOrder[0],
      )
    })
  })
})
