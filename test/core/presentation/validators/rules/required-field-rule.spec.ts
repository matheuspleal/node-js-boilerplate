import { RequiredError } from '@/core/presentation/validators/errors/required-error'
import { RequiredRule } from '@/core/presentation/validators/rules/required-rule'
import { type ValidatorFieldProps } from '@/core/presentation/validators/validator'

import {
  makeFakeCollectionFieldStub,
  makeFakeFieldStub,
} from '#/core/presentation/@mocks/fake-field-stub'

describe('RequiredRule', () => {
  let sut: RequiredRule
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

  it('should be able to return RequiredError when all fields are empty', () => {
    const expectNotFilledFields = listOfNotFilledFields.map(
      (field) => field.name,
    )

    sut = new RequiredRule([...listOfNotFilledFields])

    const validation = sut.validate()

    expect(validation?.listOfFields).toHaveLength(5)
    expect(validation?.listOfFields).toMatchObject(expectNotFilledFields)
    expect(validation).toBeInstanceOf(RequiredError)
  })

  it('should be able to return RequiredError when some field are empty', () => {
    const notFilledField = makeFakeFieldStub({ withValue: false })

    const expectedNotFilledFields = [notFilledField].map((field) => field.name)

    sut = new RequiredRule([notFilledField])

    const validation = sut.validate()

    expect(validation?.listOfFields).toHaveLength(1)
    expect(validation?.listOfFields).toMatchObject(expectedNotFilledFields)
    expect(validation).toBeInstanceOf(RequiredError)
  })

  it('should be able to return undefined when all fields are filled', () => {
    sut = new RequiredRule([...listOfFilledFields])

    const validation = sut.validate()

    expect(validation).toBeUndefined()
  })
})
