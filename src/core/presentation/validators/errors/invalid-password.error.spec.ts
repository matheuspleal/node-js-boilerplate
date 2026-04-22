import { PresentationError } from '@/core/presentation/errors/presentation.error'
import { InvalidPasswordError } from '@/core/presentation/validators/errors/invalid-password.error'
import { ValidationError } from '@/core/presentation/validators/errors/validation.error'

describe('InvalidPasswordError', () => {
  it('should be able to create an instance with correct message using default field', () => {
    const sut = new InvalidPasswordError()

    expect(sut.message).toBe(
      'The field "password" must contain between 8 and 20 characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character!',
    )
  })

  it('should be able to create an instance with custom field name', () => {
    const sut = new InvalidPasswordError('confirmPassword')

    expect(sut.message).toBe(
      'The field "confirmPassword" must contain between 8 and 20 characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character!',
    )
  })

  it('should be able to set field property with default value', () => {
    const sut = new InvalidPasswordError()

    expect(sut.field).toBe('password')
  })

  it('should be able to set field property with custom value', () => {
    const sut = new InvalidPasswordError('newPassword')

    expect(sut.field).toBe('newPassword')
  })

  it('should be able to set value property as undefined', () => {
    const sut = new InvalidPasswordError()

    expect(sut.value).toBeUndefined()
  })

  it('should be able to set the name automatically based on the class name', () => {
    const sut = new InvalidPasswordError()

    expect(sut.name).toBe('InvalidPasswordError')
  })

  it('should be an instance of Error', () => {
    const sut = new InvalidPasswordError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should be an instance of PresentationError', () => {
    const sut = new InvalidPasswordError()

    expect(sut).toBeInstanceOf(PresentationError)
  })

  it('should be an instance of ValidationError', () => {
    const sut = new InvalidPasswordError()

    expect(sut).toBeInstanceOf(ValidationError)
  })

  it('should have a stack trace', () => {
    const sut = new InvalidPasswordError()

    expect(sut.stack).toBeDefined()
    expect(sut.stack).toContain('InvalidPasswordError')
  })
})
