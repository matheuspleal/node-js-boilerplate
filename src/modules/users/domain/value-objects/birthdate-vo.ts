import { ValueObject } from '@/core/domain/value-objects/value-object'

interface Value {
  value: string | Date
}

interface BirthdateProps {
  value: Date
}

export class BirthdateVO extends ValueObject<BirthdateProps> {
  private readonly UTC_FIRST_YEAR = 1970

  constructor(props: Value) {
    super({ value: new Date(props.value) })
  }

  isValid() {
    const currentDate = new Date()
    const isPastDate = this.props.value.getTime() < currentDate.getTime()
    return isPastDate
  }

  toValue() {
    return this.props.value
  }

  toString() {
    return this.props.value.toISOString()
  }

  getCurrentAgeInYears(): number {
    const currentDate = new Date()
    const timeDifferenceInMilliseconds =
      currentDate.getTime() - this.props.value.getTime()
    const ageInMilliseconds = new Date(timeDifferenceInMilliseconds)
    const age = Math.abs(
      ageInMilliseconds.getUTCFullYear() - this.UTC_FIRST_YEAR,
    )
    return age
  }
}
