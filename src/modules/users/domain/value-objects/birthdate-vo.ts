export class BirthdateVO {
  private readonly value: Date
  private readonly UTC_FIRST_YEAR = 1970

  constructor(value: string | Date) {
    this.value = new Date(value)
  }

  isValid() {
    const currentDate = new Date()
    const isPastDate = this.value.getTime() < currentDate.getTime()
    return isPastDate
  }

  toValue() {
    return this.value
  }

  toString() {
    return this.value.toISOString()
  }

  getCurrentAgeInYears(): number {
    const currentDate = new Date()
    const timeDifferenceInMilliseconds =
      currentDate.getTime() - this.value.getTime()
    const ageInMilliseconds = new Date(timeDifferenceInMilliseconds)
    const age = Math.abs(
      ageInMilliseconds.getUTCFullYear() - this.UTC_FIRST_YEAR,
    )
    return age
  }
}
