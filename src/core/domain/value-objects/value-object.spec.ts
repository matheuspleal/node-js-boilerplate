import { ValueObject } from '@/core/domain/value-objects/value-object'

interface FakeValueProps {
  value: string
}

class FakeValueObject extends ValueObject<FakeValueProps> {
  isValid() {
    return this.props.value.trim() !== ''
  }

  toValue() {
    return this.props.value
  }

  toString() {
    return this.props.value
  }
}

describe('ValueObject', () => {
  let sut: FakeValueObject
  let fakeValue: string
  let fakeEmptyValue: string

  beforeAll(() => {
    fakeValue = 'fake-value'
    fakeEmptyValue = ' '
  })

  it('should be able to create an instance of Value Object', () => {
    sut = new FakeValueObject({ value: fakeValue })

    expect(sut).toBeInstanceOf(ValueObject)
  })

  it('should be able to compare two instances of Value Objects and return false when any property is different', () => {
    sut = new FakeValueObject({ value: fakeValue })
    const fakeValueObjectToCompare = new FakeValueObject({
      value: 'fake-different-value',
    })

    expect(sut.equals(fakeValueObjectToCompare)).toEqual(false)
  })

  it('should be able to compare two instances of Value Objects and return true when all properties are equal', () => {
    sut = new FakeValueObject({ value: fakeValue })
    const fakeValueObjectToCompare = new FakeValueObject({
      value: fakeValue,
    })

    expect(sut.equals(fakeValueObjectToCompare)).toEqual(true)
  })

  it('should be able to use extended value object methods (flow 1)', () => {
    sut = new FakeValueObject({ value: fakeValue })

    expect(sut.isValid()).toEqual(true)
    expect(sut.toValue()).toEqual(fakeValue)
    expect(sut.toString()).toEqual(fakeValue)
  })

  it('should be able to use extended value object methods (flow 2)', () => {
    sut = new FakeValueObject({ value: fakeEmptyValue })

    expect(sut.isValid()).toEqual(false)
    expect(sut.toValue()).toEqual(fakeEmptyValue)
    expect(sut.toString()).toEqual(fakeEmptyValue)
  })
})
