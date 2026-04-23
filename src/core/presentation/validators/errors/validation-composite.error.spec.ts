import { ValidationCompositeError } from '@/core/presentation/validators/errors/validation-composite.error'
import { ValidationError } from '@/core/presentation/validators/errors/validation.error'

class FakeRequiredError extends ValidationError {
  constructor(
    public readonly field: string,
    public readonly value: any,
  ) {
    super(`The field "${field}" is required!`)
  }
}

class FakeInvalidFormatError extends ValidationError<string> {
  constructor(
    public readonly field: string,
    public readonly value: string,
  ) {
    super(`The field "${field}" has invalid format!`)
  }
}

class FakeMinLengthError extends ValidationError<string> {
  constructor(
    public readonly field: string,
    public readonly value: string,
  ) {
    super(`The field "${field}" is too short!`)
  }
}

describe('ValidationCompositeError', () => {
  it('should be able to create an instance with formatted errors', () => {
    const rawErrors: ValidationError[] = [
      new FakeRequiredError('email', undefined),
    ]

    const sut = new ValidationCompositeError(rawErrors)

    expect(sut.errors).toHaveLength(1)
    expect(sut.errors[0]).toEqual({
      field: 'email',
      value: undefined,
      reasons: [
        {
          name: 'FakeRequiredError',
          message: 'The field "email" is required!',
        },
      ],
    })
  })

  it('should be able to set the name as ValidationCompositeError', () => {
    const rawErrors: ValidationError[] = [
      new FakeRequiredError('name', undefined),
    ]

    const sut = new ValidationCompositeError(rawErrors)

    expect(sut.name).toBe('ValidationCompositeError')
  })

  it('should be an instance of Error', () => {
    const rawErrors: ValidationError[] = [
      new FakeRequiredError('password', undefined),
    ]

    const sut = new ValidationCompositeError(rawErrors)

    expect(sut).toBeInstanceOf(Error)
  })

  it('should be able to group multiple errors by field and value', () => {
    const rawErrors: ValidationError[] = [
      new FakeInvalidFormatError('email', 'invalid-email'),
      new FakeMinLengthError('email', 'invalid-email'),
    ]

    const sut = new ValidationCompositeError(rawErrors)

    expect(sut.errors).toHaveLength(1)
    expect(sut.errors[0]).toEqual({
      field: 'email',
      value: 'invalid-email',
      reasons: [
        {
          name: 'FakeInvalidFormatError',
          message: 'The field "email" has invalid format!',
        },
        {
          name: 'FakeMinLengthError',
          message: 'The field "email" is too short!',
        },
      ],
    })
  })

  it('should be able to separate errors with different fields', () => {
    const rawErrors: ValidationError[] = [
      new FakeRequiredError('email', undefined),
      new FakeRequiredError('password', undefined),
    ]

    const sut = new ValidationCompositeError(rawErrors)

    expect(sut.errors).toHaveLength(2)
    expect(sut.errors[0].field).toBe('email')
    expect(sut.errors[1].field).toBe('password')
  })

  it('should be able to separate errors with same field but different values', () => {
    const rawErrors: ValidationError[] = [
      new FakeInvalidFormatError('email', 'first@invalid'),
      new FakeInvalidFormatError('email', 'second@invalid'),
    ]

    const sut = new ValidationCompositeError(rawErrors)

    expect(sut.errors).toHaveLength(2)
    expect(sut.errors[0].value).toBe('first@invalid')
    expect(sut.errors[1].value).toBe('second@invalid')
  })

  it('should be able to handle empty errors array', () => {
    const rawErrors: ValidationError[] = []

    const sut = new ValidationCompositeError(rawErrors)

    expect(sut.errors).toHaveLength(0)
    expect(sut.errors).toEqual([])
  })

  it('should be able to handle multiple errors with mixed grouping', () => {
    const rawErrors: ValidationError[] = [
      new FakeRequiredError('email', undefined),
      new FakeInvalidFormatError('password', 'weak'),
      new FakeMinLengthError('password', 'weak'),
      new FakeRequiredError('name', undefined),
    ]

    const sut = new ValidationCompositeError(rawErrors)

    expect(sut.errors).toHaveLength(3)

    expect(sut.errors[0]).toEqual({
      field: 'email',
      value: undefined,
      reasons: [
        {
          name: 'FakeRequiredError',
          message: 'The field "email" is required!',
        },
      ],
    })

    expect(sut.errors[1]).toEqual({
      field: 'password',
      value: 'weak',
      reasons: [
        {
          name: 'FakeInvalidFormatError',
          message: 'The field "password" has invalid format!',
        },
        {
          name: 'FakeMinLengthError',
          message: 'The field "password" is too short!',
        },
      ],
    })

    expect(sut.errors[2]).toEqual({
      field: 'name',
      value: undefined,
      reasons: [
        {
          name: 'FakeRequiredError',
          message: 'The field "name" is required!',
        },
      ],
    })
  })
})
