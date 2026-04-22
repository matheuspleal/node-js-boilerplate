import { PresentationError } from '@/core/presentation/errors/presentation.error'
import { InvalidUUIDError } from '@/core/presentation/validators/errors/invalid-uuid.error'
import { ValidationError } from '@/core/presentation/validators/errors/validation.error'

describe('InvalidUUIDError', () => {
  it('should be able to create an instance with correct message', () => {
    const sut = new InvalidUUIDError('id', 'invalid-uuid-value')

    expect(sut.message).toBe(
      'The field "id" with value "invalid-uuid-value" is invalid id!',
    )
  })

  it('should be able to set field and value properties', () => {
    const field = 'personId'
    const value = 'not-a-uuid'

    const sut = new InvalidUUIDError(field, value)

    expect(sut.field).toBe(field)
    expect(sut.value).toBe(value)
  })

  it('should be able to set the name automatically based on the class name', () => {
    const sut = new InvalidUUIDError('id', 'invalid')

    expect(sut.name).toBe('InvalidUUIDError')
  })

  it('should be an instance of Error', () => {
    const sut = new InvalidUUIDError('id', 'invalid')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should be an instance of PresentationError', () => {
    const sut = new InvalidUUIDError('id', 'invalid')

    expect(sut).toBeInstanceOf(PresentationError)
  })

  it('should be an instance of ValidationError', () => {
    const sut = new InvalidUUIDError('id', 'invalid')

    expect(sut).toBeInstanceOf(ValidationError)
  })

  it('should have a stack trace', () => {
    const sut = new InvalidUUIDError('id', 'invalid')

    expect(sut.stack).toBeDefined()
    expect(sut.stack).toContain('InvalidUUIDError')
  })
})
