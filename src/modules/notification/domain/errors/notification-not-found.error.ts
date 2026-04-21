import { DomainError } from '@/core/domain/errors/domain.error'

export class NotificationNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Notification with id "${id}" not found.`)
  }
}
