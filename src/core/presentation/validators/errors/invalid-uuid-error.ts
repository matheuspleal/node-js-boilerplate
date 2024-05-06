import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'
import { buildErrorMessage } from '@/core/presentation/validators/helpers/build-error-message'

export class InvalidUUIDError extends Error implements ValidationError<string> {
  constructor(
    readonly field: string,
    readonly value: string,
  ) {
    super(
      buildErrorMessage({
        field,
        value,
        reason: 'is invalid id!',
      }),
    )
    this.name = 'InvalidUUIDError'
  }
}
