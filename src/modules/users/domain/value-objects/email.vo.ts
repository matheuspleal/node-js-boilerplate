import { DomainError } from '@/core/domain/errors/domain.error'
import { ValueObject } from '@/core/domain/value-object'
import { Either, left, right } from '@/core/shared/either'
import { InvalidEmailError } from '@/modules/users/domain/errors/invalid-email.error'

interface EmailProps {
  value: string
  username: string
  domain: string
  tld: string
}

interface CreateEmailInput {
  value: string
}

export class EmailVO extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX =
    /^(?<username>[^\s@]+)@(?<domain>[^.\s@]+)\.(?<tld>[^\s@]+)$/i

  protected constructor(props: EmailProps) {
    super(props)
  }

  private static normalize(value: string): string {
    return value.trim().toLowerCase()
  }

  private static parse(value: string) {
    const match = value.match(this.EMAIL_REGEX)
    if (!match?.groups) return null
    return {
      username: match.groups.username,
      domain: match.groups.domain,
      tld: match.groups.tld,
    }
  }

  get username(): string {
    return this.props.username
  }

  get domain(): string {
    return this.props.domain
  }

  get tld(): string {
    return this.props.tld
  }

  toValue(): string {
    return this.props.value
  }

  toString(): string {
    return this.props.value
  }

  static create(input: CreateEmailInput): Either<DomainError, EmailVO> {
    const normalized = this.normalize(input.value)
    const parsed = this.parse(normalized)
    if (!parsed) {
      return left(new InvalidEmailError(input.value))
    }
    return right(
      new EmailVO({
        value: normalized,
        username: parsed.username,
        domain: parsed.domain,
        tld: parsed.tld,
      }),
    )
  }
}
