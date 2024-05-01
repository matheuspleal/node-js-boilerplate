import { CompositeValidator } from '@/core/presentation/validators/composite-validator'
import { RequiredRule } from '@/core/presentation/validators/rules/required-rule'

import { makeFakeCollectionFieldStub } from '#/core/presentation/@mocks/fake-field-stub'
import { makeFakeCollectionValidatorStub } from '#/core/presentation/@mocks/fake-validators-stub'

describe('CompositeValidator', () => {
  let sut: CompositeValidator

  it('should be able to execute a list of validators and return ValidationError if one of the validations returns error', () => {
    sut = new CompositeValidator(
      makeFakeCollectionValidatorStub({ length: 1, withValue: false }),
    )

    const validation = sut.validate()

    expect(validation).toBeInstanceOf(Error)
  })

  it('should be able to execute a list of validators and return undefined if all validations return undefined', () => {
    sut = new CompositeValidator([
      new RequiredRule(
        makeFakeCollectionFieldStub({ length: 2, withValue: true }),
      ),
    ])

    const validations = sut.validate()

    expect(validations).toBeUndefined()
  })
})
