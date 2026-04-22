import { Specification } from '@/core/domain/specifications/specification'

class IsPositiveSpec extends Specification<number> {
  isSatisfiedBy(candidate: number): boolean {
    return candidate > 0
  }
}

class IsEvenSpec extends Specification<number> {
  isSatisfiedBy(candidate: number): boolean {
    return candidate % 2 === 0
  }
}

describe('Specification', () => {
  let isPositive: IsPositiveSpec
  let isEven: IsEvenSpec

  beforeAll(() => {
    isPositive = new IsPositiveSpec()
    isEven = new IsEvenSpec()
  })

  describe('isSatisfiedBy', () => {
    it('should return true when candidate satisfies the specification', () => {
      expect(isPositive.isSatisfiedBy(5)).toBe(true)
      expect(isEven.isSatisfiedBy(4)).toBe(true)
    })

    it('should return false when candidate does not satisfy the specification', () => {
      expect(isPositive.isSatisfiedBy(-1)).toBe(false)
      expect(isEven.isSatisfiedBy(3)).toBe(false)
    })
  })

  describe('and', () => {
    it('should return true when both specifications are satisfied', () => {
      const isPositiveAndEven = isPositive.and(isEven)

      expect(isPositiveAndEven.isSatisfiedBy(4)).toBe(true)
    })

    it('should return false when only one specification is satisfied', () => {
      const isPositiveAndEven = isPositive.and(isEven)

      expect(isPositiveAndEven.isSatisfiedBy(3)).toBe(false)
      expect(isPositiveAndEven.isSatisfiedBy(-2)).toBe(false)
    })
  })

  describe('or', () => {
    it('should return true when at least one specification is satisfied', () => {
      const isPositiveOrEven = isPositive.or(isEven)

      expect(isPositiveOrEven.isSatisfiedBy(3)).toBe(true)
      expect(isPositiveOrEven.isSatisfiedBy(-2)).toBe(true)
    })

    it('should return false when no specification is satisfied', () => {
      const isPositiveOrEven = isPositive.or(isEven)

      expect(isPositiveOrEven.isSatisfiedBy(-3)).toBe(false)
    })
  })

  describe('not', () => {
    it('should return true when specification is not satisfied', () => {
      const isNotPositive = isPositive.not()

      expect(isNotPositive.isSatisfiedBy(-1)).toBe(true)
    })

    it('should return false when specification is satisfied', () => {
      const isNotPositive = isPositive.not()

      expect(isNotPositive.isSatisfiedBy(5)).toBe(false)
    })
  })

  describe('composition', () => {
    it('should be able to compose multiple specifications', () => {
      const isPositiveAndNotEven = isPositive.and(isEven.not())

      expect(isPositiveAndNotEven.isSatisfiedBy(3)).toBe(true)
      expect(isPositiveAndNotEven.isSatisfiedBy(4)).toBe(false)
      expect(isPositiveAndNotEven.isSatisfiedBy(-3)).toBe(false)
    })
  })
})
