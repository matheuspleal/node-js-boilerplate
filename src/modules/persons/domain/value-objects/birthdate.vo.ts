import { DomainError } from '@/core/domain/errors/domain.error'
import { ValueObject } from '@/core/domain/value-object'
import { Either, left, right } from '@/core/shared/either'
import { InvalidBirthdateError } from '@/modules/persons/domain/errors/invalid-birthdate.error'

interface BirthdateProps {
  value: Date
}

interface CreateBirthdateInput {
  value: string | Date
}

export class BirthdateVO extends ValueObject<BirthdateProps> {
  private static readonly UTC_FIRST_YEAR = 1970

  protected constructor(props: BirthdateProps) {
    super(props)
  }

  private static isValidDate(date: Date): boolean {
    return !isNaN(date.getTime())
  }

  private static isPastDate(date: Date): boolean {
    const currentDate = new Date()
    return date.getTime() < currentDate.getTime()
  }

  private static isValid(date: Date): boolean {
    return BirthdateVO.isValidDate(date) && BirthdateVO.isPastDate(date)
  }

  toValue(): Date {
    return this.props.value
  }

  toString(): string {
    return this.props.value.toISOString()
  }

  getCurrentAgeInYears(): number {
    const currentDate = new Date()
    const timeDifferenceInMilliseconds =
      currentDate.getTime() - this.props.value.getTime()
    const ageInMilliseconds = new Date(timeDifferenceInMilliseconds)
    const age = Math.abs(
      ageInMilliseconds.getUTCFullYear() - BirthdateVO.UTC_FIRST_YEAR,
    )
    return age
  }

  public static create(
    props: CreateBirthdateInput,
  ): Either<DomainError, BirthdateVO> {
    const date = new Date(props.value)
    date.setUTCHours(0, 0, 0, 0)
    if (!BirthdateVO.isValid(date)) {
      return left(new InvalidBirthdateError(props.value))
    }
    return right(new BirthdateVO({ value: date }))
  }
}
