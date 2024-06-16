import { Entity } from '@/core/domain/entities/entity'
import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { type Optional } from '@/core/shared/types/optional'
import { EmailVO } from '@/modules/users/domain/value-objects/email-vo'

export interface UserProps {
  personId: UniqueEntityIdVO
  email: EmailVO
  password: string
  createdAt: Date
  updatedAt: Date
}

export class UserEntity extends Entity<UserProps> {
  get personId() {
    return this.personId
  }

  set personId(personId: string) {
    this.personId = new UniqueEntityIdVO(personId).toValue()
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
    props: Optional<Omit<UserProps, 'email'>, 'createdAt' | 'updatedAt'> & {
      email: string
    },
    id?: UniqueEntityIdVO,
  ): UserEntity {
    const user = new UserEntity(
      {
        ...props,
        email: new EmailVO({ value: props.email }),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
    return user
  }
}
