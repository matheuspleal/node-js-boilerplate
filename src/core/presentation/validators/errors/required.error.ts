import { ValidationError } from '@/core/presentation/validators/errors/validation.error'
import { buildErrorMessage } from '@/core/presentation/validators/helpers/build-error-message.helper'

export class RequiredError extends ValidationError {
  constructor(
    public readonly field: string,
    public readonly value: any,
  ) {
    super(
      buildErrorMessage({
        field,
        value,
        reason: 'is required!',
      }),
    )
  }
}
