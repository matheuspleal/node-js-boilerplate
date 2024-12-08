import { Entity } from '@/core/domain/entities/entity'
import { type UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'
import { type Optional } from '@/core/shared/types/optional'
import { BirthdateVO } from '@/modules/persons/domain/value-objects/birthdate-vo'

export interface PersonProps {
  name: string
  birthdate: BirthdateVO
  createdAt: Date
  updatedAt: Date
}

export type PersonInput = Optional<
  Omit<PersonProps, 'birthdate'>,
  'createdAt' | 'updatedAt'
> & {
  birthdate: Date
}

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

  static create(props: PersonInput, id?: UniqueEntityIdVO): PersonEntity {
    const user = new PersonEntity(
      {
        ...props,
        birthdate: new BirthdateVO({ value: props.birthdate }),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
    return user
  }
}
