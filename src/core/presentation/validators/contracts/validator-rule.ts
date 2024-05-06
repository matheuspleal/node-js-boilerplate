import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'

export namespace Validator {
  export interface Field {
    name: string
    value: any
  }
}

export interface ValidatorRule {
  validate(): ValidationError | undefined
}
