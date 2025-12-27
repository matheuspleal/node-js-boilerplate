import { Entity } from '@/core/domain/entity'
import { DomainError } from '@/core/domain/errors/domain.error'
import { type UniqueEntityId } from '@/core/domain/unique-entity.id'
import { Either, left, right } from '@/core/shared/either'
import { Optional } from '@/core/shared/types/optional.type'
import { InvalidDomainError } from '@/modules/users/domain/errors/invalid-domain.error'
import { EmailVO } from '@/modules/users/domain/value-objects/email.vo'

export interface UserProps {
  personId: UniqueEntityId
  email: EmailVO
  password: string
  createdAt: Date
  updatedAt: Date
}

export type UserInput = Optional<UserProps, 'createdAt' | 'updatedAt'>

export class UserEntity extends Entity<UserProps> {
  get personId(): UniqueEntityId {
    return this.props.personId
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: UserInput,
    id?: UniqueEntityId,
  ): Either<DomainError, UserEntity> {
    const allowedDomains = ['foo', 'bar', 'baz']
    const { email, ...rest } = props
    if (!allowedDomains.includes(email.domain)) {
      return left(new InvalidDomainError(email.domain))
    }
    const user = new UserEntity(
      {
        ...rest,
        email,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
    return right(user)
  }
}
