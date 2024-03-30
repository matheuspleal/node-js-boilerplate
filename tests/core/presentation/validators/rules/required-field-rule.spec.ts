import { RequiredFieldError } from '@/core/presentation/validators/errors/required-field-error'
import { RequiredFieldRule } from '@/core/presentation/validators/rules/required-field-rule'
import { ValidatorFieldProps } from '@/core/presentation/validators/validator'

import {
  makeFakeCollectionFieldStub,
  makeFakeFieldStub,
} from '#/core/presentation/@mocks/fake-field-stub'

describe('RequiredFieldRule', () => {
  let sut: RequiredFieldRule
  let listOfNotFilledFields: ValidatorFieldProps[]
  let listOfFilledFields: ValidatorFieldProps[]

  beforeAll(() => {
    listOfNotFilledFields = makeFakeCollectionFieldStub({
      length: 5,
      withValue: false,
    })
    listOfFilledFields = makeFakeCollectionFieldStub({
      length: 5,
      withValue: true,
    })
  })

  it('should be able to return RequiredFieldError when all fields are empty', () => {
    const expectNotFilledFields = listOfNotFilledFields.map(
      (field) => field.name,
    )

    sut = new RequiredFieldRule([...listOfNotFilledFields])

    const validation = sut.validate()

    expect(validation?.listOfFields).toHaveLength(5)
    expect(validation?.listOfFields).toMatchObject(expectNotFilledFields)
    expect(validation).toBeInstanceOf(RequiredFieldError)
  })

  it('should be able to return RequiredFieldError when some field are empty', () => {
    const notFilledField = makeFakeFieldStub({ withValue: false })

    const expectedNotFilledFields = [notFilledField].map((field) => field.name)

    sut = new RequiredFieldRule([notFilledField])

    const validation = sut.validate()

    expect(validation?.listOfFields).toHaveLength(1)
    expect(validation?.listOfFields).toMatchObject(expectedNotFilledFields)
    expect(validation).toBeInstanceOf(RequiredFieldError)
  })

  it('should be able to return undefined when all fields are filled', () => {
    sut = new RequiredFieldRule([...listOfFilledFields])

    const validation = sut.validate()

    expect(validation).toBeUndefined()
  })
})
