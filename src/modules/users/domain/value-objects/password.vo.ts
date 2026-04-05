import { DomainError } from '@/core/domain/errors/domain.error'
import { ValueObject } from '@/core/domain/value-object'
import { Either, left, right } from '@/core/shared/either'
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/modules/users/domain/constants/password-constraints.const'
import { InvalidPasswordError } from '@/modules/users/domain/errors/invalid-password.error'

interface PasswordProps {
  value: string
}

interface CreatePasswordInput {
  value: string
}

export class PasswordVO extends ValueObject<PasswordProps> {
  private static readonly PASSWORD_REGEX = new RegExp(
    `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=]).{${PASSWORD_MIN_LENGTH},${PASSWORD_MAX_LENGTH}}$`,
  )

  protected constructor(props: PasswordProps) {
    super(props)
  }

  toValue(): string {
    return this.props.value
  }

  toString(): string {
    return this.props.value
  }

  static create(input: CreatePasswordInput): Either<DomainError, PasswordVO> {
    if (!PasswordVO.PASSWORD_REGEX.test(input.value)) {
      return left(new InvalidPasswordError())
    }
    return right(new PasswordVO({ value: input.value }))
  }

  static reconstitute(hash: string): PasswordVO {
    return new PasswordVO({ value: hash })
  }
}
