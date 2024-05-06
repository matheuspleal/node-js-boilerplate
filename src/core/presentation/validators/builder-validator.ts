import {
  type Validator,
  type ValidatorRule,
} from '@/core/presentation/validators/contracts/validator-rule'
import { IsValidPasswordRule } from '@/core/presentation/validators/rules/is-valid-password-rule'
import { IsValidUUIDRule } from '@/core/presentation/validators/rules/is-valid-uuid-rule'
import { RequiredRule } from '@/core/presentation/validators/rules/required-rule'

export class BuilderValidator {
  private constructor(
    private readonly field: Validator.Field,
    private readonly validators: ValidatorRule[] = [],
  ) {}

  static of(field: Validator.Field): BuilderValidator {
    return new BuilderValidator(field)
  }

  isValidUUID(): this {
    this.validators.push(new IsValidUUIDRule(this.field))
    return this
  }

  isValidPassword(): this {
    this.validators.push(new IsValidPasswordRule(this.field))
    return this
  }

  required(): this {
    this.validators.push(new RequiredRule(this.field))
    return this
  }

  build(): ValidatorRule[] {
    return this.validators
  }
}
