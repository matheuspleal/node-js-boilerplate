import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'
import { buildErrorMessage } from '@/core/presentation/validators/helpers/build-error-message'

export class RequiredError extends Error implements ValidationError {
  constructor(
    readonly field: string,
    readonly value: any,
  ) {
    super(
      buildErrorMessage({
        field,
        value,
        reason: 'is required!',
      }),
    )
    this.name = 'RequiredError'
  }
}
