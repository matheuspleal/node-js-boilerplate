import { Entity } from '@/core/domain/entities/entity'
import { type UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { type Optional } from '@/core/shared/types/optional'
import { BirthdateVO } from '@/modules/users/domain/value-objects/birthdate-vo'
import { EmailVO } from '@/modules/users/domain/value-objects/email-vo'

export interface UserProps {
  name: string
  email: EmailVO
  password: string
  birthdate: BirthdateVO
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

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
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
      Omit<UserProps, 'email' | 'password' | 'birthdate'>,
      'createdAt' | 'updatedAt'
    > & {
      email: string
      password: string
      birthdate: Date
    },
    id?: UniqueEntityIdVO,
  ): UserEntity {
    const user = new UserEntity(
      {
        ...props,
        email: new EmailVO(props.email),
        birthdate: new BirthdateVO(props.birthdate),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
    return user
  }
}
