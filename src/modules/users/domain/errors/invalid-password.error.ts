import { DomainError } from '@/core/domain/errors/domain.error'
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/modules/users/domain/constants/password-constraints.const'

export class InvalidPasswordError extends DomainError {
  constructor() {
    super(
      `The password must contain between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character.`,
    )
  }
}
