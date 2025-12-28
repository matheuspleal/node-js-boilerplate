import { DomainError } from '@/core/domain/errors/domain.error'

export class InvalidDomainError extends DomainError {
  constructor(domain: string) {
    const allowedDomains = ['foo', 'bar', 'baz']
    super(
      `The domain "${domain}" is not valid. It must be one of the following: ${allowedDomains.join(', ')}.`,
    )
  }
}
