import { PresentationError } from '@/core/presentation/errors/presentation.error'

export abstract class ValidationError<T = unknown> extends PresentationError {
  abstract readonly field?: string
  abstract readonly value?: T

  constructor(message: string) {
    super(message)
  }
}
