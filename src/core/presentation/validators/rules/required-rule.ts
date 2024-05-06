import {
  type ValidatorRule,
  type Validator,
} from '@/core/presentation/validators/contracts/validator-rule'
import { RequiredError } from '@/core/presentation/validators/errors/required-error'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'

export class RequiredRule implements ValidatorRule {
  constructor(private readonly field: Validator.Field) {}

  validate(): ValidationError | undefined {
    if (this.field.value === null || this.field.value === undefined) {
      return new RequiredError(this.field.name, this.field.value)
    }
  }
}
