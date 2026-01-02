import { PresentationError } from '@/core/presentation/errors/presentation.error'

export class InternalServerError extends PresentationError {
  constructor(error?: Error) {
    super('Server failed')
    this.stack = error?.stack
  }
}
