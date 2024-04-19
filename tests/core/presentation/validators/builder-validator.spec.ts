import { BuilderValidator } from '@/core/presentation/validators/builder-validator'
import { IsValidUUIDRule } from '@/core/presentation/validators/rules/is-valid-uuid-rule'
import { RequiredRule } from '@/core/presentation/validators/rules/required-rule'

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
    ])
      .required()
      .isValidUUID()

    const validators = builderValidator.build()
    const [requiredRule, isValidUUID] = validators

    expect(builderValidator).toBeInstanceOf(BuilderValidator)
    expect(validators).toHaveLength(2)
    expect(requiredRule).toBeInstanceOf(RequiredRule)
    expect(isValidUUID).toBeInstanceOf(IsValidUUIDRule)
  })
})
