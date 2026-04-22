import {
  type ValidatorRule,
  type Validator,
} from '@/core/presentation/validators/contracts/validator-rule.contract'
import { InvalidEmailFormatError } from '@/core/presentation/validators/errors/invalid-email-format.error'
import { ValidationError } from '@/core/presentation/validators/errors/validation.error'

export class IsEmailRule implements ValidatorRule {
  private readonly emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

  constructor(private readonly field: Validator.Field) {}

  validate(): ValidationError | undefined {
    if (
      typeof this.field.value !== 'string' ||
      !this.emailRegExp.test(this.field.value)
    ) {
      return new InvalidEmailFormatError(this.field.name, this.field.value)
    }
  }
}
