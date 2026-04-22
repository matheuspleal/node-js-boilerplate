import { type Validator } from '@/core/presentation/validators/contracts/validator-rule.contract'
import { InvalidDateError } from '@/core/presentation/validators/errors/invalid-date.error'
import { IsValidDateRule } from '@/core/presentation/validators/rules/is-valid-date.rule'

import { makeFakeFieldStub } from '#/core/presentation/@mocks/fake-field.stub'

describe('IsValidDateRule', () => {
  let sut: IsValidDateRule

  it.each([
    '2024-01-15',
    '2024-01-15T10:30:00.000Z',
    '1999-12-31T23:59:59Z',
    new Date('2024-01-15').toISOString(),
  ])(
    'should be able to return undefined when field is valid date string "%s"',
    (value) => {
      const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
      sut = new IsValidDateRule({ name, value })

      const validation = sut.validate()

      expect(validation).toBeUndefined()
    },
  )

  it('should be able to return undefined when field value is a valid Date instance', () => {
    const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
    sut = new IsValidDateRule({ name, value: new Date('2024-01-15') })

    const validation = sut.validate()

    expect(validation).toBeUndefined()
  })

  it('should be able to return InvalidDateError when field value is an invalid Date instance', () => {
    const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
    sut = new IsValidDateRule({ name, value: new Date('not-a-date') })

    const validation = sut.validate()

    expect(validation).toBeInstanceOf(InvalidDateError)
  })

  it.each(['not-a-date', '2024-13-01', 'abc', '', '   '])(
    'should be able to return InvalidDateError when field is invalid string "%s"',
    (value) => {
      const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
      sut = new IsValidDateRule({ name, value })

      const validation = sut.validate()

      expect(validation).toBeInstanceOf(InvalidDateError)
    },
  )

  it.each([null, undefined, 123, {}, []])(
    'should be able to return InvalidDateError when field value is not a string or Date (%s)',
    (value) => {
      const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
      sut = new IsValidDateRule({ name, value })

      const validation = sut.validate()

      expect(validation).toBeInstanceOf(InvalidDateError)
    },
  )
})
