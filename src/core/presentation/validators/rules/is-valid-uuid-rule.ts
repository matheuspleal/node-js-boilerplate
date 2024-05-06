import {
  type ValidatorRule,
  type Validator,
} from '@/core/presentation/validators/contracts/validator-rule'
import { InvalidUUIDError } from '@/core/presentation/validators/errors/invalid-uuid-error'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'

export class IsValidUUIDRule implements ValidatorRule {
  private readonly UUIDRegExp =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

  constructor(private readonly field: Validator.Field) {}

  validate(): ValidationError | undefined {
    if (!this.UUIDRegExp.test(this.field.value)) {
      return new InvalidUUIDError(this.field.name, this.field.value)
    }
  }
}
