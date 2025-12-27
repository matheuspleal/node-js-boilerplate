import { type DomainError } from '@/core/domain/errors/domain.error'

export class InvalidDomainError extends Error implements DomainError {
  constructor(domain: string) {
    const allowedDomains = ['foo', 'bar', 'baz']
    super(
      `The domain "${domain}" is not valid. It must be one of the following: ${allowedDomains.join(', ')}.`,
    )
    this.name = 'InvalidDomainError'
  }
}
