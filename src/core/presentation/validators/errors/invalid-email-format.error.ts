import { ValidationError } from '@/core/presentation/validators/errors/validation.error'
import { buildErrorMessage } from '@/core/presentation/validators/helpers/build-error-message.helper'

export class InvalidEmailFormatError extends ValidationError<string> {
  constructor(
    public readonly field: string,
    public readonly value: string,
  ) {
    super(
      buildErrorMessage({
        field,
        value,
        reason: 'is not a valid email!',
      }),
    )
  }
}
