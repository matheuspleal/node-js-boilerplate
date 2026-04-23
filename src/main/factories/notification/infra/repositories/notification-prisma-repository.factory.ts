import { NotificationPrismaRepository } from '@/modules/notification/infra/repositories/notification-prisma.repository'

export function makeNotificationPrismaRepository() {
  return new NotificationPrismaRepository()
}
