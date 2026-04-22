import {
  buildErrorMessage,
  type BuildMessageProps,
} from '@/core/presentation/validators/helpers/build-error-message.helper'

describe('buildErrorMessage', () => {
  it('should be able to build error message with field, value and reason', () => {
    const props: BuildMessageProps<string> = {
      field: 'email',
      value: 'invalid-email',
      reason: 'is not a valid email!',
    }

    const result = buildErrorMessage(props)

    expect(result).toBe(
      'The field "email" with value "invalid-email" is not a valid email!',
    )
  })

  it('should be able to build error message with field and reason when value is undefined', () => {
    const props: BuildMessageProps<undefined> = {
      field: 'password',
      value: undefined,
      reason: 'is required!',
    }

    const result = buildErrorMessage(props)

    expect(result).toBe('The field "password" is required!')
  })

  it('should be able to build error message without value property', () => {
    const props: BuildMessageProps<undefined> = {
      field: 'name',
      reason: 'must be at least 3 characters!',
    }

    const result = buildErrorMessage(props)

    expect(result).toBe('The field "name" must be at least 3 characters!')
  })

  it('should be able to convert non-string value to string', () => {
    const props: BuildMessageProps<number> = {
      field: 'age',
      value: 15,
      reason: 'must be at least 18!',
    }

    const result = buildErrorMessage(props)

    expect(result).toBe('The field "age" with value "15" must be at least 18!')
  })

  it('should be able to handle null value as falsy', () => {
    const props: BuildMessageProps<null> = {
      field: 'document',
      value: null,
      reason: 'is required!',
    }

    const result = buildErrorMessage(props)

    expect(result).toBe('The field "document" is required!')
  })

  it('should be able to handle empty string value', () => {
    const props: BuildMessageProps<string> = {
      field: 'username',
      value: '',
      reason: 'cannot be empty!',
    }

    const result = buildErrorMessage(props)

    expect(result).toBe('The field "username" cannot be empty!')
  })

  it('should be able to handle object value by converting to string', () => {
    const props: BuildMessageProps<object> = {
      field: 'config',
      value: { key: 'value' },
      reason: 'is invalid!',
    }

    const result = buildErrorMessage(props)

    expect(result).toBe(
      'The field "config" with value "[object Object]" is invalid!',
    )
  })
})
