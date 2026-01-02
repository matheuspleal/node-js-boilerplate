import { PresentationError } from '@/core/presentation/errors/presentation.error'
import { ValidationError } from '@/core/presentation/validators/errors/validation.error'

class FakeValidationError extends ValidationError<string> {
  constructor(
    public readonly field: string,
    public readonly value: string,
  ) {
    super(`The field "${field}" with value "${value}" is not valid.`)
  }
}

class AnotherFakeValidationError extends ValidationError {
  public readonly field = 'anotherField'
  public readonly value = undefined

  constructor() {
    super('Another fake validation error message.')
  }
}

describe('ValidationError', () => {
  it('should be able to create an instance with the correct message', () => {
    const fakeField = 'email'
    const fakeValue = 'invalid-email'

    const sut = new FakeValidationError(fakeField, fakeValue)

    expect(sut.message).toBe(
      `The field "${fakeField}" with value "${fakeValue}" is not valid.`,
    )
  })

  it('should be able to set the name automatically based on the class name', () => {
    const sut = new FakeValidationError('field', 'value')

    expect(sut.name).toBe('FakeValidationError')
  })

  it('should be able to set different names for different error classes', () => {
    const fakeValidationError = new FakeValidationError('field', 'value')
    const anotherFakeValidationError = new AnotherFakeValidationError()

    expect(fakeValidationError.name).toBe('FakeValidationError')
    expect(anotherFakeValidationError.name).toBe('AnotherFakeValidationError')
  })

  it('should be an instance of Error', () => {
    const sut = new FakeValidationError('field', 'value')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should be an instance of PresentationError', () => {
    const sut = new FakeValidationError('field', 'value')

    expect(sut).toBeInstanceOf(PresentationError)
  })

  it('should be an instance of ValidationError', () => {
    const sut = new FakeValidationError('field', 'value')

    expect(sut).toBeInstanceOf(ValidationError)
  })

  it('should have field and value properties', () => {
    const fakeField = 'email'
    const fakeValue = 'invalid-email'

    const sut = new FakeValidationError(fakeField, fakeValue)

    expect(sut.field).toBe(fakeField)
    expect(sut.value).toBe(fakeValue)
  })

  it('should allow undefined value', () => {
    const sut = new AnotherFakeValidationError()

    expect(sut.field).toBe('anotherField')
    expect(sut.value).toBeUndefined()
  })

  it('should have a stack trace', () => {
    const sut = new FakeValidationError('field', 'value')

    expect(sut.stack).toBeDefined()
    expect(sut.stack).toContain('FakeValidationError')
  })
})
