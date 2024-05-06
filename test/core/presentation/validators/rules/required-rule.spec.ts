import { type Validator } from '@/core/presentation/validators/contracts/validator-rule'
import { RequiredError } from '@/core/presentation/validators/errors/required-error'
import { RequiredRule } from '@/core/presentation/validators/rules/required-rule'

import { makeFakeFieldStub } from '#/core/presentation/@mocks/fake-field-stub'

describe('RequiredRule', () => {
  let sut: RequiredRule

  it('should be able to return RequiredError when field is empty', () => {
    const field: Validator.Field = makeFakeFieldStub({ withValue: false })
    sut = new RequiredRule(field)

    const validation = sut.validate()

    expect(validation?.message).toEqual(
      `The field "${field.name}" is required!`,
    )
    expect(validation).toBeInstanceOf(RequiredError)
  })

  it('should be able to return undefined when field is not empty', () => {
    const field: Validator.Field = makeFakeFieldStub({ withValue: true })
    sut = new RequiredRule(field)

    const validation = sut.validate()

    expect(validation).toBeUndefined()
  })
})
