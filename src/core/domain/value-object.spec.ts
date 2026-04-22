import { ValueObject } from '@/core/domain/value-object'
import { Either, left, right } from '@/core/shared/either'

interface FakeValueProps {
  value: string
}

class FakeValueObject extends ValueObject<FakeValueProps> {
  protected constructor(props: FakeValueProps) {
    super(props)
  }

  private static isValid(value: string) {
    return value.trim() !== ''
  }

  toValue() {
    return this.props.value
  }

  toString() {
    return this.props.value
  }

  public static create(props: FakeValueProps): Either<Error, FakeValueObject> {
    if (!FakeValueObject.isValid(props.value)) {
      return left(new Error('Invalid value'))
    }
    return right(new FakeValueObject(props))
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

  it('should not be able to create an instance with invalid value', () => {
    const fakeValueObjectResult = FakeValueObject.create({
      value: fakeEmptyValue,
    })

    expect(fakeValueObjectResult.isLeft()).toBe(true)
    expect(fakeValueObjectResult.value).toBeInstanceOf(Error)
  })

  it('should be able to create an instance', () => {
    const fakeValueObjectResult = FakeValueObject.create({ value: fakeValue })
    sut = fakeValueObjectResult.value as FakeValueObject

    expect(fakeValueObjectResult.isRight()).toBe(true)
    expect(sut).toBeInstanceOf(ValueObject)
  })

  it('should be able to compare two instances and return false when any property is different', () => {
    const fakeValueObjectResult = FakeValueObject.create({ value: fakeValue })
    sut = fakeValueObjectResult.value as FakeValueObject
    const fakeValueObjectToCompareResult = FakeValueObject.create({
      value: 'fake-different-value',
    })
    const fakeValueObjectToCompare =
      fakeValueObjectToCompareResult.value as FakeValueObject

    expect(fakeValueObjectResult.isRight()).toBe(true)
    expect(sut.equals(fakeValueObjectToCompare)).toBe(false)
  })

  it('should be able to compare two instances and return true when all properties are equal', () => {
    const fakeValueObjectResult = FakeValueObject.create({ value: fakeValue })
    sut = fakeValueObjectResult.value as FakeValueObject
    const fakeValueObjectToCompareResult = FakeValueObject.create({
      value: fakeValue,
    })
    const fakeValueObjectToCompare =
      fakeValueObjectToCompareResult.value as FakeValueObject

    expect(fakeValueObjectResult.isRight()).toBe(true)
    expect(sut.equals(fakeValueObjectToCompare)).toBe(true)
  })

  it.each([[null, undefined]])(
    'should be able to compare two instances and return false when one of the instances is "%s"',
    (value) => {
      const fakeValueObjectResult = FakeValueObject.create({ value: fakeValue })
      sut = fakeValueObjectResult.value as FakeValueObject

      expect(sut.equals(value as any as FakeValueObject)).toBe(false)
    },
  )

  it('should be able to compare two instances and return false when the props are undefined', () => {
    const fakeValueObjectResult = FakeValueObject.create({ value: fakeValue })
    sut = fakeValueObjectResult.value as FakeValueObject
    const fakeValueObjectWithUndefinedProps = {
      props: undefined,
    } as unknown as FakeValueObject

    expect(sut.equals(fakeValueObjectWithUndefinedProps)).toBe(false)
  })

  it('should be able to use extended value object methods', () => {
    const fakeValueObjectResult = FakeValueObject.create({ value: fakeValue })
    sut = fakeValueObjectResult.value as FakeValueObject

    expect(fakeValueObjectResult.isRight()).toBe(true)
    expect(sut.toValue()).toEqual(fakeValue)
    expect(sut.toString()).toEqual(fakeValue)
  })
})
