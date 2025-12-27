import { InvalidEmailError } from '@/modules/users/domain/errors/invalid-email.error'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'

describe('EmailVO', () => {
  it('should not be able to create an instance of EmailVO with invalid value', () => {
    const fakeInvalidEmail = 'fake-invalid-email'
    const emailVOResult = EmailVO.create({ value: fakeInvalidEmail })

    expect(emailVOResult.isLeft()).toBe(true)
    expect(emailVOResult.value).toBeInstanceOf(InvalidEmailError)
  })

  it('should not be able to create an instance of EmailVO with invalid not normalized value', () => {
    const fakeInvalidEmail = 'Fake-Invalid-Email'
    const emailVOResult = EmailVO.create({ value: fakeInvalidEmail })

    expect(emailVOResult.isLeft()).toBe(true)
    expect(emailVOResult.value).toBeInstanceOf(InvalidEmailError)
  })

  it('should be able to create an instance of EmailVO with valid value', () => {
    const fakeValidEmail = 'john.doe@example.com'
    const emailVOResult = EmailVO.create({ value: fakeValidEmail })
    const emailVO = emailVOResult.value as EmailVO

    expect(emailVOResult.isRight()).toBe(true)
    expect(emailVOResult.value).toBeInstanceOf(EmailVO)
    expect(emailVOResult.value.toString()).toEqual(fakeValidEmail)
    expect(emailVO.username).toEqual('john.doe')
    expect(emailVO.domain).toEqual('example')
    expect(emailVO.tld).toEqual('com')
  })

  it('should be able to create an instance of EmailVO with valid not normalized value', () => {
    const fakeValidEmail = 'John.Doe@example.com'
    const emailVOResult = EmailVO.create({ value: fakeValidEmail })
    const emailVO = emailVOResult.value as EmailVO

    expect(emailVOResult.isRight()).toBe(true)
    expect(emailVOResult.value).toBeInstanceOf(EmailVO)
    expect(emailVOResult.value.toString()).toEqual('john.doe@example.com')
    expect(emailVO.username).toEqual('john.doe')
    expect(emailVO.domain).toEqual('example')
    expect(emailVO.tld).toEqual('com')
  })

  // it.each([
  //   'fake-invalid-email@fake-domain.net',
  //   'fake-invalid-email@fake-domain.com.br',
  // ])(
  //   'should not be able to create an instance of EmailVO with invalid value',
  //   (email) => {
  //     const emailVOResult = EmailVO.create({ value: email })

  //     expect(emailVOResult.isLeft()).toBe(true)
  //     expect(emailVOResult.value).toBeInstanceOf(InvalidEmailError)
  //   },
  // )

  // it.each([
  //   'fake-valid-email@fake-domain.com',
  //   'fake-valid-email@fake-domain.org',
  // ])(
  //   'should be able to create an instance of EmailVO with valid value',
  //   (email) => {
  //     const emailVOResult = EmailVO.create({ value: email })

  //     expect(emailVOResult.isRight()).toBe(true)
  //     expect(emailVOResult.value).toBeInstanceOf(EmailVO)
  //   },
  // )
})
