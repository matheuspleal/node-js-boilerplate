import { DomainError } from '@/core/domain/errors/domain.error'

class FakeDomainError extends DomainError {
  constructor(value: string) {
    super(`The value "${value}" is not valid.`)
  }
}

class AnotherFakeDomainError extends DomainError {
  constructor() {
    super('Another fake domain error message.')
  }
}

describe('DomainError', () => {
  it('should be able to create an instance with the correct message', () => {
    const fakeValue = 'fake-value'

    const sut = new FakeDomainError(fakeValue)

    expect(sut.message).toBe(`The value "${fakeValue}" is not valid.`)
  })

  it('should be able to set the name automatically based on the class name', () => {
    const sut = new FakeDomainError('fake-value')

    expect(sut.name).toBe('FakeDomainError')
  })

  it('should be able to set different names for different error classes', () => {
    const fakeDomainError = new FakeDomainError('fake-value')
    const anotherFakeDomainError = new AnotherFakeDomainError()

    expect(fakeDomainError.name).toBe('FakeDomainError')
    expect(anotherFakeDomainError.name).toBe('AnotherFakeDomainError')
  })

  it('should be an instance of Error', () => {
    const sut = new FakeDomainError('fake-value')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should be an instance of DomainError', () => {
    const sut = new FakeDomainError('fake-value')

    expect(sut).toBeInstanceOf(DomainError)
  })

  it('should have a stack trace', () => {
    const sut = new FakeDomainError('fake-value')

    expect(sut.stack).toBeDefined()
    expect(sut.stack).toContain('FakeDomainError')
  })
})
