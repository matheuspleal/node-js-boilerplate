import { ApplicationError } from '@/core/application/errors/application.error'

class FakeApplicationError extends ApplicationError {
  constructor(value: string) {
    super(`The value "${value}" is not valid.`)
  }
}

class AnotherFakeApplicationError extends ApplicationError {
  constructor() {
    super('Another fake application error message.')
  }
}

describe('ApplicationError', () => {
  it('should be able to create an instance with the correct message', () => {
    const fakeValue = 'fake-value'

    const sut = new FakeApplicationError(fakeValue)

    expect(sut.message).toBe(`The value "${fakeValue}" is not valid.`)
  })

  it('should be able to set the name automatically based on the class name', () => {
    const sut = new FakeApplicationError('fake-value')

    expect(sut.name).toBe('FakeApplicationError')
  })

  it('should be able to set different names for different error classes', () => {
    const fakeApplicationError = new FakeApplicationError('fake-value')
    const anotherFakeApplicationError = new AnotherFakeApplicationError()

    expect(fakeApplicationError.name).toBe('FakeApplicationError')
    expect(anotherFakeApplicationError.name).toBe('AnotherFakeApplicationError')
  })

  it('should be an instance of Error', () => {
    const sut = new FakeApplicationError('fake-value')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should be an instance of ApplicationError', () => {
    const sut = new FakeApplicationError('fake-value')

    expect(sut).toBeInstanceOf(ApplicationError)
  })

  it('should have a stack trace', () => {
    const sut = new FakeApplicationError('fake-value')

    expect(sut.stack).toBeDefined()
    expect(sut.stack).toContain('FakeApplicationError')
  })
})
