import { CompositeValidator } from '@/core/presentation/validators/composite-validator'
import { RequiredRule } from '@/core/presentation/validators/rules/required-rule'

import { makeFakeFieldStub } from '#/core/presentation/@mocks/fake-field-stub'
import { makeFakeCollectionValidatorStub } from '#/core/presentation/@mocks/fake-validators-stub'

describe('CompositeValidator', () => {
  let sut: CompositeValidator

  it('should be able to run a list of validators and return the ValidationError collection if only one of the validations returns error', () => {
    sut = new CompositeValidator(
      makeFakeCollectionValidatorStub({ length: 1, withValue: false }),
    )

    const validations = sut.run()

    validations?.forEach((error) => {
      expect(error).toBeInstanceOf(Error)
    })
  })

  it('should be able to run a list of validators and return undefined if all validations returns undefined', () => {
    sut = new CompositeValidator([
      new RequiredRule(makeFakeFieldStub({ withValue: true })),
    ])

    const validations = sut.run()

    expect(validations).toBeUndefined()
  })
})
