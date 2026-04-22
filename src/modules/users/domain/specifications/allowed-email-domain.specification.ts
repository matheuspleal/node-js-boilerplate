import { Specification } from '@/core/domain/specifications/specification'
import { ALLOWED_EMAIL_DOMAINS } from '@/modules/users/domain/constants/allowed-email-domains.const'
import { type EmailVO } from '@/modules/users/domain/value-objects/email.vo'

export class AllowedEmailDomainSpecification extends Specification<EmailVO> {
  isSatisfiedBy(email: EmailVO): boolean {
    return (ALLOWED_EMAIL_DOMAINS as readonly string[]).includes(email.domain)
  }
}
