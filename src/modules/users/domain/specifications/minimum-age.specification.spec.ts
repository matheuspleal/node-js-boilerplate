import { MinimumAgeSpecification } from '@/modules/users/domain/specifications/minimum-age.specification'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate.vo'

describe('MinimumAgeSpecification', () => {
  let sut: MinimumAgeSpecification

  beforeAll(() => {
    sut = new MinimumAgeSpecification()
  })

  it('should be satisfied when age is at least minimum', () => {
    const birthYear = new Date().getFullYear() - 25
    const birthdate = BirthdateVO.reconstitute(new Date(birthYear, 0, 1))

    expect(sut.isSatisfiedBy(birthdate)).toBe(true)
  })

  it('should be satisfied when age is exactly minimum', () => {
    const birthYear = new Date().getFullYear() - 18
    const birthdate = BirthdateVO.reconstitute(new Date(birthYear, 0, 1))

    expect(sut.isSatisfiedBy(birthdate)).toBe(true)
  })

  it('should not be satisfied when age is below minimum', () => {
    const birthdate = BirthdateVO.reconstitute(new Date())

    expect(sut.isSatisfiedBy(birthdate)).toBe(false)
  })
})
