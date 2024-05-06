import { type Validator } from '@/core/presentation/validators/contracts/validator'
import { type ValidatorRule } from '@/core/presentation/validators/contracts/validator-rule'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'

export class CompositeValidator implements Validator {
  constructor(private readonly validators: ValidatorRule[]) {}

  run(): ValidationError[] | undefined {
    const errors: ValidationError[] = []
    for (const validator of this.validators) {
      const error = validator.validate()
      if (error !== undefined) {
        errors.push(error)
      }
    }
    return errors.length > 0 ? errors : undefined
  }
}
