import { DomainError } from '@/core/domain/errors/domain.error'

export class InvalidBirthdateError extends DomainError {
  constructor(birthdate: string | Date) {
    const birthdateString =
      birthdate instanceof Date && !isNaN(birthdate.getTime())
        ? birthdate.toISOString()
        : String(birthdate)
    super(
      `The birthdate "${birthdateString}" is not valid. It must be a valid past date.`,
    )
  }
}
