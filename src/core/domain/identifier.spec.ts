import { Identifier } from '@/core/domain/identifier'

describe('Identifier', () => {
  let sut: Identifier<string>
  let fakeValue: string

  beforeAll(() => {
    fakeValue = 'fake-value'
  })

  it('should be able to create a Identifier', () => {
    sut = new Identifier<string>(fakeValue)

    expect(sut.toValue()).toBe(fakeValue)
    expect(sut.toString()).toBe(fakeValue)
  })

  it('should be able to compare two instances of Identifier and return false', () => {
    sut = new Identifier<string>(fakeValue)
    const identifierToCompare = new Identifier<string>('different-value')

    expect(sut.equals(identifierToCompare)).toBe(false)
  })

  it.each([[null, undefined]])(
    'should be able to compare two instances of Identifier and return false when one of the instances is "%s"',
    (value) => {
      sut = new Identifier<string>(fakeValue)

      expect(sut.equals(value as any as Identifier<string>)).toBe(false)
    },
  )

  it('should be able to compare two instances of Identifier and return false when the value is not an instance of Identifier', () => {
    sut = new Identifier<string>(fakeValue)

    expect(sut.equals(fakeValue as any as Identifier<string>)).toBe(false)
  })

  it('should be able to compare two instances of Identifier and return true', () => {
    sut = new Identifier<string>(fakeValue)
    const identifierToCompare = new Identifier<string>(fakeValue)

    expect(sut.equals(identifierToCompare)).toBe(true)
  })

  it('should be able to compare two instances of Identifier and return true', () => {
    sut = new Identifier<string>(fakeValue)

    expect(sut.equals(sut)).toBe(true)
  })
})
