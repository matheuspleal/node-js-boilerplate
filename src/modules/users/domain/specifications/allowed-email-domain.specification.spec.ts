import { AllowedEmailDomainSpecification } from '@/modules/users/domain/specifications/allowed-email-domain.specification'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'

describe('AllowedEmailDomainSpecification', () => {
  let sut: AllowedEmailDomainSpecification

  beforeAll(() => {
    sut = new AllowedEmailDomainSpecification()
  })

  it('should be satisfied when email domain is allowed', () => {
    const email = EmailVO.reconstitute('john@foo.com')

    expect(sut.isSatisfiedBy(email)).toBe(true)
  })

  it('should not be satisfied when email domain is not allowed', () => {
    const email = EmailVO.reconstitute('john@example.com')

    expect(sut.isSatisfiedBy(email)).toBe(false)
  })
})
