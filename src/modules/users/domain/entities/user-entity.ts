import { Entity } from '@/core/domain/entities/entity'
import { type UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id'
import { type Optional } from '@/core/shared/types/optional'
import { Birthdate } from '@/modules/users/domain/value-objects/birthdate'
import { Email } from '@/modules/users/domain/value-objects/email'

export interface UserProps {
  name: string
  email: Email
  birthdate: Birthdate
  createdAt: Date
  updatedAt: Date
}

export class UserEntity extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email() {
    return this.props.email
  }

  get birthdate() {
    return this.props.birthdate
  }

  get age() {
    return this.props.birthdate.getCurrentAgeInYears()
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
    props: Optional<
      Omit<UserProps, 'email' | 'birthdate'>,
      'createdAt' | 'updatedAt'
    > & {
      email: string
      birthdate: Date
    },
    id?: UniqueEntityId,
  ): UserEntity {
    const user = new UserEntity(
      {
        ...props,
        birthdate: new Birthdate(new Date(props.birthdate)),
        email: new Email(props.email),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
    return user
  }
}
