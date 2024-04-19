import { IsValidUUIDRule } from '@/core/presentation/validators/rules/is-valid-uuid-rule'
import { RequiredRule } from '@/core/presentation/validators/rules/required-rule'
import {
  Validator,
  ValidatorFieldProps,
} from '@/core/presentation/validators/validator'

export class BuilderValidator {
  private constructor(
    private readonly fields: ValidatorFieldProps[],
    private readonly validators: Validator[] = [],
  ) {}

  static of(fields: ValidatorFieldProps[]): BuilderValidator {
    return new BuilderValidator(fields)
  }

  isValidUUID(): BuilderValidator {
    this.validators.push(new IsValidUUIDRule(this.fields))
    return this
  }

  required(): BuilderValidator {
    this.validators.push(new RequiredRule(this.fields))
    return this
  }

  build(): Validator[] {
    return this.validators
  }
}
