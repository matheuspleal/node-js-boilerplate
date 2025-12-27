import { faker } from '@faker-js/faker'

import { InvalidBirthdateError } from '@/modules/persons/domain/errors/invalid-birthdate.error'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate.vo'

import { ISODateRegExp } from '#/core/domain/@helpers/iso-date-regexp'

describe('BirthdateVO', () => {
  it('should not be able to create an instance of BirthdateVO with invalid string format', () => {
    const fakeInvalidBirthdate = '01/2000/01'
    const birthdateVOResult = BirthdateVO.create({
      value: fakeInvalidBirthdate,
    })

    expect(birthdateVOResult.isLeft()).toBe(true)
    expect(birthdateVOResult.value).toBeInstanceOf(InvalidBirthdateError)
  })

  it('should not be able to create an instance of BirthdateVO with invalid date format', () => {
    const fakeInvalidBirthdate = new Date('01/2000/01')
    const birthdateVOResult = BirthdateVO.create({
      value: fakeInvalidBirthdate,
    })

    expect(birthdateVOResult.isLeft()).toBe(true)
    expect(birthdateVOResult.value).toBeInstanceOf(InvalidBirthdateError)
  })

  it('should not be able to create an instance of BirthdateVO with a future date', () => {
    const fakeFutureDate = faker.date.future()
    const birthdateVOResult = BirthdateVO.create({ value: fakeFutureDate })

    expect(birthdateVOResult.isLeft()).toBe(true)
    expect(birthdateVOResult.value).toBeInstanceOf(InvalidBirthdateError)
  })

  it('should be able to create an instance of BirthdateVO with a valid string format', () => {
    const fakeValidBirthdate = faker.date.birthdate().toISOString()
    const birthdateVOResult = BirthdateVO.create({ value: fakeValidBirthdate })

    expect(birthdateVOResult.isRight()).toBe(true)
    expect(birthdateVOResult.value).toBeInstanceOf(BirthdateVO)
    if (birthdateVOResult.isRight()) {
      expect(birthdateVOResult.value.toValue()).toBeInstanceOf(Date)
      expect(birthdateVOResult.value.toString()).toMatch(ISODateRegExp)
    }
  })

  it('should be able to create an instance of BirthdateVO with a valid date format', () => {
    const fakeValidBirthdate = faker.date.birthdate()
    const birthdateVOResult = BirthdateVO.create({ value: fakeValidBirthdate })

    expect(birthdateVOResult.isRight()).toBe(true)
    expect(birthdateVOResult.value).toBeInstanceOf(BirthdateVO)
    if (birthdateVOResult.isRight()) {
      expect(birthdateVOResult.value.toValue()).toBeInstanceOf(Date)
      expect(birthdateVOResult.value.toString()).toMatch(ISODateRegExp)
    }
  })

  it('should be able to calculate current age in years', () => {
    const birthYear = new Date().getFullYear() - 25
    const fakeValidBirthdate = new Date(birthYear, 0, 1)
    const birthdateVOResult = BirthdateVO.create({ value: fakeValidBirthdate })

    expect(birthdateVOResult.isRight()).toBe(true)
    if (birthdateVOResult.isRight()) {
      const age = birthdateVOResult.value.getCurrentAgeInYears()
      expect(age).toBeGreaterThanOrEqual(24)
      expect(age).toBeLessThanOrEqual(25)
    }
  })
})
