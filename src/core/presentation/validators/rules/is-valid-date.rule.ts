import {
  type ValidatorRule,
  type Validator,
} from '@/core/presentation/validators/contracts/validator-rule.contract'
import { InvalidDateError } from '@/core/presentation/validators/errors/invalid-date.error'
import { ValidationError } from '@/core/presentation/validators/errors/validation.error'

export class IsValidDateRule implements ValidatorRule {
  constructor(private readonly field: Validator.Field) {}

  validate(): ValidationError | undefined {
    const { value } = this.field

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return new InvalidDateError(this.field.name, String(value))
      }
      return
    }

    if (typeof value !== 'string' || value.trim() === '') {
      return new InvalidDateError(this.field.name, value)
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return new InvalidDateError(this.field.name, value)
    }
  }
}
