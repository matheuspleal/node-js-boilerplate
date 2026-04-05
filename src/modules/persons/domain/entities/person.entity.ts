import { AggregateRoot } from '@/core/domain/aggregate-root'
import { DomainError } from '@/core/domain/errors/domain.error'
import { type UniqueEntityId } from '@/core/domain/unique-entity.id'
import { Either, left, right } from '@/core/shared/either'
import { type Optional } from '@/core/shared/types/optional.type'
import { MINIMUM_AGE } from '@/modules/persons/domain/constants/minimum-age.const'
import { InvalidAgeError } from '@/modules/persons/domain/errors/invalid-age.error'
import { PersonCreatedEvent } from '@/modules/persons/domain/events/person-created.event'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate.vo'

export interface PersonProps {
  name: string
  birthdate: BirthdateVO
  createdAt: Date
  updatedAt: Date
}

export type PersonInput = Optional<PersonProps, 'createdAt' | 'updatedAt'>

export class PersonEntity extends AggregateRoot<PersonProps> {
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
    if (age < MINIMUM_AGE) {
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
    person.addDomainEvent(new PersonCreatedEvent(person.id))
    return right(person)
  }

  static reconstitute(props: PersonProps, id: UniqueEntityId): PersonEntity {
    return new PersonEntity(props, id)
  }
}
