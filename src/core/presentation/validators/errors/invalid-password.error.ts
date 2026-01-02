import { ValidationError } from '@/core/presentation/validators/errors/validation.error'
import { buildErrorMessage } from '@/core/presentation/validators/helpers/build-error-message.helper'

export class InvalidPasswordError extends ValidationError<string> {
  public readonly value = undefined

  constructor(public readonly field = 'password') {
    super(
      buildErrorMessage({
        field,
        reason:
          'must contain between 8 and 20 characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character!',
      }),
    )
  }
}
