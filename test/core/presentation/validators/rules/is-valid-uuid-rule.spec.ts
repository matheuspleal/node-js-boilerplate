import { randomUUID } from 'node:crypto'

import { type Validator } from '@/core/presentation/validators/contracts/validator-rule'
import { InvalidUUIDError } from '@/core/presentation/validators/errors/invalid-uuid-error'
import { IsValidUUIDRule } from '@/core/presentation/validators/rules/is-valid-uuid-rule'

import { makeFakeFieldStub } from '#/core/presentation/@mocks/fake-field-stub'

describe('IsValidUUIDRule', () => {
  let sut: IsValidUUIDRule

  it('should be able to return InvalidUUIDError when field is invalid UUID', () => {
    const field: Validator.Field = makeFakeFieldStub({ withValue: true })
    sut = new IsValidUUIDRule(field)

    const validation = sut.validate()

    expect(validation?.message).toEqual(
      `The field "${field.name}" with value "${field.value}" is invalid id!`,
    )
    expect(validation).toBeInstanceOf(InvalidUUIDError)
  })

  it('should be able to return undefined when field is valid UUID', () => {
    const { name }: Validator.Field = makeFakeFieldStub({ withValue: true })
    const value = randomUUID()
    sut = new IsValidUUIDRule({ name, value })

    const validation = sut.validate()

    expect(validation).toBeUndefined()
  })
})
