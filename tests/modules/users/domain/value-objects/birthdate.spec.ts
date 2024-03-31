import { faker } from '@faker-js/faker'

import { Birthdate } from '@/modules/users/domain/value-objects/birthdate'

import { ISODateRegExp } from '#/modules/users/domain/value-objects/@helpers/iso-date-regexp'

describe('Birthdate', () => {
  let sut: Birthdate

  it('should be able to returns false when birthdate has a invalid string format', () => {
    const fakeInvalidBirthdate = '01/2000/01'
    sut = new Birthdate(fakeInvalidBirthdate)

    const isValid = sut.isValid()

    expect(isValid).toBe(false)
    expect(sut.toValue()).toBeInstanceOf(Date)
    expect(sut.toValue().getDate()).toBe(NaN)
    expect(() => sut.toString()).toThrowError(RangeError)
  })

  it('should be able to returns false when birthdate has a invalid date format', () => {
    const fakeInvalidBirthdate = new Date('01/2000/01')
    sut = new Birthdate(fakeInvalidBirthdate)

    const isValid = sut.isValid()

    expect(isValid).toBe(false)
    expect(sut.toValue()).toBeInstanceOf(Date)
    expect(sut.toValue().getDate()).toBe(NaN)
    expect(() => sut.toString()).toThrowError(RangeError)
  })

  it('should be able to returns false when birthdate is a future date', () => {
    const fakeFutureDate = faker.date.future()
    sut = new Birthdate(fakeFutureDate)

    const isValid = sut.isValid()

    expect(isValid).toBe(false)
    expect(sut.toValue()).toBeInstanceOf(Date)
  })

  it('should be able to returns true when the birthdate is passed and have a valid string format', () => {
    const fakeValidBirthdate = faker.date.birthdate().toISOString()
    sut = new Birthdate(fakeValidBirthdate)

    const isValid = sut.isValid()

    expect(isValid).toBe(true)
    expect(sut.toValue()).toBeInstanceOf(Date)
    expect(sut.toString()).toMatch(ISODateRegExp)
  })

  it('should be able to returns true when the birthdate is passed and have a valid date format', () => {
    const fakeValidBirthdate = faker.date.birthdate()
    sut = new Birthdate(fakeValidBirthdate)

    const isValid = sut.isValid()

    expect(isValid).toBe(true)
    expect(sut.toValue()).toBeInstanceOf(Date)
    expect(sut.toString()).toMatch(ISODateRegExp)
  })
})
