import { RequiredError } from '@/core/presentation/validators/errors/required-error'
import { ValidationError } from '@/core/presentation/validators/errors/validation-error'
import {
  Validator,
  ValidatorFieldProps,
} from '@/core/presentation/validators/validator'

export class RequiredRule implements Validator {
  constructor(private readonly fields: ValidatorFieldProps[]) {}

  validate(): ValidationError | undefined {
    const fieldsNotFilled: string[] = []
    for (const { name, value } of this.fields) {
      if (value === null || value === undefined) {
        fieldsNotFilled.push(name)
      }
    }
    if (fieldsNotFilled.length > 0) {
      return new RequiredError(fieldsNotFilled)
    }
  }
}
