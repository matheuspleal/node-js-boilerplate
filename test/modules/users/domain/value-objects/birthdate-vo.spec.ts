import { faker } from '@faker-js/faker'

import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate-vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'

describe('BirthdateVO', () => {
  let sut: BirthdateVO

  it('should be able to returns false when birthdate has a invalid string format', () => {
    const fakeInvalidBirthdate = '01/2000/01'
    sut = new BirthdateVO(fakeInvalidBirthdate)

    const isValid = sut.isValid()

    expect(isValid).toBe(false)
    expect(sut.toValue()).toBeInstanceOf(Date)
    expect(sut.toValue().getDate()).toBe(NaN)
    expect(() => sut.toString()).toThrowError(RangeError)
  })

  it('should be able to returns false when birthdate has a invalid date format', () => {
    const fakeInvalidBirthdate = new Date('01/2000/01')
    sut = new BirthdateVO(fakeInvalidBirthdate)

    const isValid = sut.isValid()

    expect(isValid).toBe(false)
    expect(sut.toValue()).toBeInstanceOf(Date)
    expect(sut.toValue().getDate()).toBe(NaN)
    expect(() => sut.toString()).toThrowError(RangeError)
  })

  it('should be able to returns false when birthdate is a future date', () => {
    const fakeFutureDate = faker.date.future()
    sut = new BirthdateVO(fakeFutureDate)

    const isValid = sut.isValid()

    expect(isValid).toBe(false)
    expect(sut.toValue()).toBeInstanceOf(Date)
  })

  it('should be able to returns true when the birthdate is passed and have a valid string format', () => {
    const fakeValidBirthdate = faker.date.birthdate().toISOString()
    sut = new BirthdateVO(fakeValidBirthdate)

    const isValid = sut.isValid()

    expect(isValid).toBe(true)
    expect(sut.toValue()).toBeInstanceOf(Date)
    expect(sut.toString()).toMatch(ISODateRegExp)
  })

  it('should be able to returns true when the birthdate is passed and have a valid date format', () => {
    const fakeValidBirthdate = faker.date.birthdate()
    sut = new BirthdateVO(fakeValidBirthdate)

    const isValid = sut.isValid()

    expect(isValid).toBe(true)
    expect(sut.toValue()).toBeInstanceOf(Date)
    expect(sut.toString()).toMatch(ISODateRegExp)
  })
})
