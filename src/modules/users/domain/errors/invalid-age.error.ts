import { DomainError } from '@/core/domain/errors/domain.error'
import { MINIMUM_AGE } from '@/modules/users/domain/constants/minimum-age.const'

export class InvalidAgeError extends DomainError {
  constructor(age: number) {
    super(
      `The age "${age}" is not valid. It must be at least ${MINIMUM_AGE} years old.`,
    )
  }
}
