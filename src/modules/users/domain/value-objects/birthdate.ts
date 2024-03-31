export class Birthdate {
  private readonly birthdate: Date
  private UTC_FIRST_YEAR = 1970

  constructor(birthdate: string | Date) {
    this.birthdate = new Date(birthdate)
  }

  isValid() {
    const currentDate = new Date()
    const isPastDate = this.birthdate.getTime() < currentDate.getTime()
    return isPastDate
  }

  toValue() {
    return this.birthdate
  }

  toString() {
    return this.birthdate.toISOString()
  }

  getCurrentAgeInYears(): number {
    const currentDate = new Date()
    const timeDifferenceInMilliseconds =
      currentDate.getTime() - this.birthdate.getTime()
    const ageInMilliseconds = new Date(timeDifferenceInMilliseconds)
    const age = Math.abs(
      ageInMilliseconds.getUTCFullYear() - this.UTC_FIRST_YEAR,
    )
    return age
  }
}
