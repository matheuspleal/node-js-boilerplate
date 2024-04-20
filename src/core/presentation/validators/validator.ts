import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'

export interface ValidatorFieldProps {
  name: string
  value: any
}

export interface Validator {
  validate(): ValidationError | undefined
}
