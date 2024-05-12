import { type ValidationError } from '@/core/presentation/validators/errors/validation-error'

export namespace ValidationComposite {
  export interface Reason {
    name: string
    message: string
  }
  export interface FormattedError {
    field?: string
    value?: unknown
    reasons: Reason[]
  }
}

export class ValidationCompositeError extends Error {
  public readonly errors: ValidationComposite.FormattedError[]

  constructor(rawErrors: ValidationError[]) {
    super()
    this.name = 'ValidationCompositeError'
    this.errors = this.format(rawErrors)
  }

  private format(rawErrors: ValidationError[]) {
    return rawErrors.reduce(
      (acc: ValidationComposite.FormattedError[], currentError) => {
        const errorExists = acc.find(
          (error) =>
            error.field === currentError.field &&
            error.value === currentError.value,
        )
        if (!errorExists) {
          acc.push({
            field: currentError.field,
            value: currentError.value,
            reasons: [
              { name: currentError.name, message: currentError.message },
            ],
          })
          return acc
        }
        errorExists.reasons.push({
          name: currentError.name,
          message: currentError.message,
        })
        return acc
      },
      [],
    )
  }
}
