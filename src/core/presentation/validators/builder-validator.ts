import { RequiredFieldRule } from '@/core/presentation/validators/rules/required-field-rule'
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

  required(): BuilderValidator {
    this.validators.push(new RequiredFieldRule(this.fields))
    return this
  }

  build(): Validator[] {
    return this.validators
  }
}
