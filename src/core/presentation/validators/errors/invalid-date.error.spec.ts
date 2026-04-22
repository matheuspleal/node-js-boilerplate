import { PresentationError } from '@/core/presentation/errors/presentation.error'
import { InvalidDateError } from '@/core/presentation/validators/errors/invalid-date.error'
import { ValidationError } from '@/core/presentation/validators/errors/validation.error'

describe('InvalidDateError', () => {
  it('should be able to create an instance with correct message', () => {
    const sut = new InvalidDateError('birthdate', 'not-a-date')

    expect(sut.message).toBe(
      'The field "birthdate" with value "not-a-date" is not a valid date!',
    )
  })

  it('should be able to set field and value properties', () => {
    const field = 'birthdate'
    const value = '2024-13-01'

    const sut = new InvalidDateError(field, value)

    expect(sut.field).toBe(field)
    expect(sut.value).toBe(value)
  })

  it('should be able to set the name automatically based on the class name', () => {
    const sut = new InvalidDateError('birthdate', 'invalid')

    expect(sut.name).toBe('InvalidDateError')
  })

  it('should be an instance of Error', () => {
    const sut = new InvalidDateError('birthdate', 'invalid')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should be an instance of PresentationError', () => {
    const sut = new InvalidDateError('birthdate', 'invalid')

    expect(sut).toBeInstanceOf(PresentationError)
  })

  it('should be an instance of ValidationError', () => {
    const sut = new InvalidDateError('birthdate', 'invalid')

    expect(sut).toBeInstanceOf(ValidationError)
  })

  it('should have a stack trace', () => {
    const sut = new InvalidDateError('birthdate', 'invalid')

    expect(sut.stack).toBeDefined()
    expect(sut.stack).toContain('InvalidDateError')
  })
})
