import {
  type ValidatorRule,
  type Validator,
} from '@/core/presentation/validators/contracts/validator-rule'
import { InvalidPasswordError } from '@/core/presentation/validators/errors/invalid-password-error'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'

export class IsValidPasswordRule implements ValidatorRule {
  private readonly passwordRegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,20}$/

  constructor(private readonly input: Validator.Field) {}

  validate(): ValidationError | undefined {
    if (!this.passwordRegExp.test(this.input.value)) {
      return new InvalidPasswordError(this.input.name)
    }
  }
}
