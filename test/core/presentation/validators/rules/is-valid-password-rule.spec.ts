import { type Validator } from '@/core/presentation/validators/contracts/validator-rule'
import { InvalidPasswordError } from '@/core/presentation/validators/errors/invalid-password-error'
import { IsValidPasswordRule } from '@/core/presentation/validators/rules/is-valid-password-rule'

import { makeFakeFieldStub } from '#/core/presentation/@mocks/fake-field-stub'
import { plaintextPasswordStub } from '#/modules/users/application/@mocks/password-stub'

describe('IsValidPasswordRule', () => {
  let sut: IsValidPasswordRule

  it('should be able to return InvalidPasswordError when field is invalid UUID', () => {
    const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
    const value = 'fake_invalid_password'

    sut = new IsValidPasswordRule({ name, value })

    const validation = sut.validate()

    expect(validation?.message).toEqual(
      `The field "${name}" must contain between 8 and 20 characters and must contain at least one uppercase character, one lowercase character, one numeric character and one special character!`,
    )
    expect(validation).toBeInstanceOf(InvalidPasswordError)
  })

  it('should be able to return undefined when field is valid password', () => {
    const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
    const value = plaintextPasswordStub
    sut = new IsValidPasswordRule({ name, value })

    const validation = sut.validate()

    expect(validation).toBeUndefined()
  })
})
