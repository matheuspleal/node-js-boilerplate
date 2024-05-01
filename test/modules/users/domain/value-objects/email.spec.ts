import { Email } from '@/modules/users/domain/value-objects/email'

describe('Email', () => {
  let sut: Email

  it('should be able to returns false when email has a invalid format', () => {
    const fakeInvalidEmail = 'fake-invalid-email'
    sut = new Email(fakeInvalidEmail)

    const isValid = sut.isValid()

    expect(isValid).toBe(false)
    expect(sut.toValue()).toEqual(fakeInvalidEmail)
    expect(sut.toString()).toEqual(fakeInvalidEmail)
  })

  it.each([
    'fake-invalid-email@fake-domain.net',
    'fake-invalid-email@fake-domain.com.br',
  ])(
    'should be able to returns false when email does not have a valid top-level domain',
    (email) => {
      sut = new Email(email)

      const isValid = sut.isValid()

      expect(isValid).toBe(false)
    },
  )

  it.each([
    'fake-valid-email@fake-domain.com',
    'fake-valid-email@fake-domain.org',
  ])(
    'should be able to returns true when email has a valid top-level domain',
    (email) => {
      sut = new Email(email)

      const isValid = sut.isValid()

      expect(isValid).toBe(true)
    },
  )
})
