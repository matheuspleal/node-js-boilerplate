import { InvalidPasswordError } from '@/core/presentation/validators/errors/invalid-password-error'
import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'
import {
  type Validator,
  type ValidatorFieldProps,
} from '@/core/presentation/validators/validator'

export class IsValidPasswordRule implements Validator {
  private readonly passwordRegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,20}$/

  constructor(private readonly fields: ValidatorFieldProps[]) {}

  validate(): ValidationError | undefined {
    const invalidPasswordFields: string[] = []
    for (const { name, value } of this.fields) {
      if (!this.passwordRegExp.test(value)) {
        invalidPasswordFields.push(name)
      }
    }
    if (invalidPasswordFields.length > 0) {
      return new InvalidPasswordError(invalidPasswordFields)
    }
  }
}
