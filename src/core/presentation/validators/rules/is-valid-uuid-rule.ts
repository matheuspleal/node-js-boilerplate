import { InvalidUUIDError } from '@/core/presentation/validators/errors/invalid-uuid-error'
import { ValidationError } from '@/core/presentation/validators/errors/validation-error'
import {
  Validator,
  ValidatorFieldProps,
} from '@/core/presentation/validators/validator'

export class IsValidUUIDRule implements Validator {
  private readonly UUIDRegExp =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

  constructor(private readonly fields: ValidatorFieldProps[]) {}

  validate(): ValidationError | undefined {
    const invalidUUIDFields: string[] = []
    for (const { name, value } of this.fields) {
      if (!this.UUIDRegExp.test(value)) {
        invalidUUIDFields.push(name)
      }
    }
    if (invalidUUIDFields.length > 0) {
      return new InvalidUUIDError(invalidUUIDFields)
    }
  }
}
