import { PresentationError } from '@/core/presentation/errors/presentation.error'
import { InvalidEmailFormatError } from '@/core/presentation/validators/errors/invalid-email-format.error'
import { ValidationError } from '@/core/presentation/validators/errors/validation.error'

describe('InvalidEmailFormatError', () => {
  it('should be able to create an instance with correct message', () => {
    const sut = new InvalidEmailFormatError('email', 'not-an-email')

    expect(sut.message).toBe(
      'The field "email" with value "not-an-email" is not a valid email!',
    )
  })

  it('should be able to set field and value properties', () => {
    const field = 'email'
    const value = 'broken@'

    const sut = new InvalidEmailFormatError(field, value)

    expect(sut.field).toBe(field)
    expect(sut.value).toBe(value)
  })

  it('should be able to set the name automatically based on the class name', () => {
    const sut = new InvalidEmailFormatError('email', 'invalid')

    expect(sut.name).toBe('InvalidEmailFormatError')
  })

  it('should be an instance of Error', () => {
    const sut = new InvalidEmailFormatError('email', 'invalid')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should be an instance of PresentationError', () => {
    const sut = new InvalidEmailFormatError('email', 'invalid')

    expect(sut).toBeInstanceOf(PresentationError)
  })

  it('should be an instance of ValidationError', () => {
    const sut = new InvalidEmailFormatError('email', 'invalid')

    expect(sut).toBeInstanceOf(ValidationError)
  })

  it('should have a stack trace', () => {
    const sut = new InvalidEmailFormatError('email', 'invalid')

    expect(sut.stack).toBeDefined()
    expect(sut.stack).toContain('InvalidEmailFormatError')
  })
})
