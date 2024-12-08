import { UniqueEntityIdVO } from '@/core/domain/value-objects/unique-entity-id-vo'

export abstract class Entity<T> {
  private readonly _id: UniqueEntityIdVO
  protected props: T

  get id() {
    return this._id
  }

  protected constructor(props: T, id?: UniqueEntityIdVO) {
    this._id = id ?? new UniqueEntityIdVO()
    this.props = props
  }

  public equals(entity: Entity<any>): boolean {
    if (entity === this) {
      return true
    }
    if (entity.id === this.id) {
      return true
    }
    return false
  }
}
