import { type Validator } from '@/core/presentation/validators/contracts/validator-rule.contract'
import { InvalidEmailFormatError } from '@/core/presentation/validators/errors/invalid-email-format.error'
import { IsEmailRule } from '@/core/presentation/validators/rules/is-email.rule'

import { makeFakeFieldStub } from '#/core/presentation/@mocks/fake-field.stub'

describe('IsEmailRule', () => {
  let sut: IsEmailRule

  it.each([
    'user@example.com',
    'a+tag@domain.co.uk',
    'first.last@sub.domain.io',
    'x@y.zz',
  ])('should be able to return undefined when field is "%s"', (value) => {
    const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
    sut = new IsEmailRule({ name, value })

    const validation = sut.validate()

    expect(validation).toBeUndefined()
  })

  it.each([
    'user',
    'user@',
    '@domain.com',
    'user@domain',
    'user@.com',
    'user@domain..com',
    '',
    ' user@example.com',
    'user@example.com ',
  ])(
    'should be able to return InvalidEmailFormatError when field is "%s"',
    (value) => {
      const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
      sut = new IsEmailRule({ name, value })

      const validation = sut.validate()

      expect(validation).toBeInstanceOf(InvalidEmailFormatError)
      expect(validation?.message).toEqual(
        value
          ? `The field "${name}" with value "${value}" is not a valid email!`
          : `The field "${name}" is not a valid email!`,
      )
    },
  )

  it.each([null, undefined, 123, {}, []])(
    'should be able to return InvalidEmailFormatError when field value is not a string (%s)',
    (value) => {
      const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
      sut = new IsEmailRule({ name, value })

      const validation = sut.validate()

      expect(validation).toBeInstanceOf(InvalidEmailFormatError)
    },
  )
})
