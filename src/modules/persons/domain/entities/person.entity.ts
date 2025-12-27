import { Entity } from '@/core/domain/entity'
import { DomainError } from '@/core/domain/errors/domain.error'
import { type UniqueEntityId } from '@/core/domain/unique-entity.id'
import { Either, left, right } from '@/core/shared/either'
import { type Optional } from '@/core/shared/types/optional.type'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate.vo'
import { InvalidAgeError } from '@/modules/users/domain/errors/invalid-age.error'

export interface PersonProps {
  name: string
  birthdate: BirthdateVO
  createdAt: Date
  updatedAt: Date
}

export type PersonInput = Optional<PersonProps, 'createdAt' | 'updatedAt'>

export class PersonEntity extends Entity<PersonProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
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
    props: PersonInput,
    id?: UniqueEntityId,
  ): Either<DomainError, PersonEntity> {
    const age = props.birthdate.getCurrentAgeInYears()
    if (age < 18) {
      return left(new InvalidAgeError(age))
    }
    const person = new PersonEntity(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
    return right(person)
  }
}
