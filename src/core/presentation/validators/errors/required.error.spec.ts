import { PresentationError } from '@/core/presentation/errors/presentation.error'
import { RequiredError } from '@/core/presentation/validators/errors/required.error'
import { ValidationError } from '@/core/presentation/validators/errors/validation.error'

describe('RequiredError', () => {
  it('should be able to create an instance with correct message when value is undefined', () => {
    const sut = new RequiredError('email', undefined)

    expect(sut.message).toBe('The field "email" is required!')
  })

  it('should be able to create an instance with correct message when value is null', () => {
    const sut = new RequiredError('password', null)

    expect(sut.message).toBe('The field "password" is required!')
  })

  it('should be able to set field and value properties', () => {
    const field = 'username'
    const value = undefined

    const sut = new RequiredError(field, value)

    expect(sut.field).toBe(field)
    expect(sut.value).toBe(value)
  })

  it('should be able to set the name automatically based on the class name', () => {
    const sut = new RequiredError('name', undefined)

    expect(sut.name).toBe('RequiredError')
  })

  it('should be an instance of Error', () => {
    const sut = new RequiredError('field', undefined)

    expect(sut).toBeInstanceOf(Error)
  })

  it('should be an instance of PresentationError', () => {
    const sut = new RequiredError('field', undefined)

    expect(sut).toBeInstanceOf(PresentationError)
  })

  it('should be an instance of ValidationError', () => {
    const sut = new RequiredError('field', undefined)

    expect(sut).toBeInstanceOf(ValidationError)
  })

  it('should have a stack trace', () => {
    const sut = new RequiredError('field', undefined)

    expect(sut.stack).toBeDefined()
    expect(sut.stack).toContain('RequiredError')
  })
})
