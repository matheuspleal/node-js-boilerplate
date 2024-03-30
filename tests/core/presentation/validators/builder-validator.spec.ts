import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { RequiredFieldRule } from '@/core/presentation/validators/rules/required-field-rule'

import { makeFakeCollectionFieldStub } from '#/core/presentation/@mocks/fake-field-stub'

describe('BuilderValidator', () => {
  it('should be able to return a list of validators from BuilderValidator', () => {
    const builderValidator = BuilderValidator.of([
      ...makeFakeCollectionFieldStub({
        length: 5,
        withValue: false,
      }),
      ...makeFakeCollectionFieldStub({
        length: 5,
        withValue: true,
      }),
    ]).required()

    const validators = builderValidator.build()
    const [requiredFieldRule] = validators

    expect(builderValidator).toBeInstanceOf(BuilderValidator)
    expect(validators).toHaveLength(1)
    expect(requiredFieldRule).toBeInstanceOf(RequiredFieldRule)
  })
})
