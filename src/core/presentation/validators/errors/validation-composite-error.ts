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
  constructor(readonly errors: ValidationError[]) {
    super()
    this.message = JSON.stringify(this.format())
    this.name = 'ValidationCompositeError'
  }

  private format() {
    return this.errors.reduce(
      (acc: ValidationComposite.FormattedError[], currentError) => {
        const errorExists = acc.find(
          (error) =>
            error.field === currentError.field &&
            error.value === currentError.value,
        )
        if (!errorExists) {
          acc.push({
            field: currentError.field ?? undefined,
            value: currentError.value ?? undefined,
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
