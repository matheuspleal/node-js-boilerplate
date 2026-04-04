import { DomainError } from '@/core/domain/errors/domain.error'
import { ALLOWED_EMAIL_DOMAINS } from '@/modules/users/domain/constants/allowed-email-domains.const'

export class InvalidDomainError extends DomainError {
  constructor(domain: string) {
    super(
      `The domain "${domain}" is not valid. It must be one of the following: ${ALLOWED_EMAIL_DOMAINS.join(', ')}.`,
    )
  }
}
