import { PresentationError } from '@/core/presentation/errors/presentation.error'

class FakePresentationError extends PresentationError {
  constructor(value: string) {
    super(`The value "${value}" is not valid.`)
  }
}

class AnotherFakePresentationError extends PresentationError {
  constructor() {
    super('Another fake presentation error message.')
  }
}

describe('PresentationError', () => {
  it('should be able to create an instance with the correct message', () => {
    const fakeValue = 'fake-value'

    const sut = new FakePresentationError(fakeValue)

    expect(sut.message).toBe(`The value "${fakeValue}" is not valid.`)
  })

  it('should be able to set the name automatically based on the class name', () => {
    const sut = new FakePresentationError('fake-value')

    expect(sut.name).toBe('FakePresentationError')
  })

  it('should be able to set different names for different error classes', () => {
    const fakePresentationError = new FakePresentationError('fake-value')
    const anotherFakePresentationError = new AnotherFakePresentationError()

    expect(fakePresentationError.name).toBe('FakePresentationError')
    expect(anotherFakePresentationError.name).toBe(
      'AnotherFakePresentationError',
    )
  })

  it('should be an instance of Error', () => {
    const sut = new FakePresentationError('fake-value')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should be an instance of PresentationError', () => {
    const sut = new FakePresentationError('fake-value')

    expect(sut).toBeInstanceOf(PresentationError)
  })

  it('should have a stack trace', () => {
    const sut = new FakePresentationError('fake-value')

    expect(sut.stack).toBeDefined()
    expect(sut.stack).toContain('FakePresentationError')
  })
})
