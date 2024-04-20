import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'
import { type Validator } from '@/core/presentation/validators/validator'

export class CompositeValidator implements Validator {
  constructor(private readonly validators: Validator[]) {}

  validate(): ValidationError | undefined {
    for (const validator of this.validators) {
      const error = validator.validate()
      if (error !== undefined) {
        return error
      }
    }
  }
}
