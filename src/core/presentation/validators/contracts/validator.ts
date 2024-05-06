import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'

export interface Validator {
  run(): ValidationError[] | undefined
}
