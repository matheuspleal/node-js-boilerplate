import { BuilderValidator } from '@/core/presentation/validators/builder.validator'
import { IsEmailRule } from '@/core/presentation/validators/rules/is-email.rule'
import { IsValidPasswordRule } from '@/core/presentation/validators/rules/is-valid-password.rule'
import { IsValidUUIDRule } from '@/core/presentation/validators/rules/is-valid-uuid.rule'
import { RequiredRule } from '@/core/presentation/validators/rules/required.rule'

import { makeFakeFieldStub } from '#/core/presentation/@mocks/fake-field.stub'

describe('BuilderValidator', () => {
  it('should be able to return a list of validators from BuilderValidator', () => {
    const builderValidator = BuilderValidator.of({
      ...makeFakeFieldStub({ withValue: false }),
    })
      .required()
      .isValidUUID()
      .isValidPassword()
      .isEmail()

    const validators = builderValidator.build()
    const [requiredRule, isValidUUID, isValidPassword, isEmail] = validators

    expect(builderValidator).toBeInstanceOf(BuilderValidator)
    expect(validators).toHaveLength(4)
    expect(requiredRule).toBeInstanceOf(RequiredRule)
    expect(isValidUUID).toBeInstanceOf(IsValidUUIDRule)
    expect(isValidPassword).toBeInstanceOf(IsValidPasswordRule)
    expect(isEmail).toBeInstanceOf(IsEmailRule)
  })
})
