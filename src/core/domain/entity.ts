import { UniqueEntityId } from '@/core/domain/unique-entity.id'

export abstract class Entity<T> {
  private readonly _id: UniqueEntityId
  protected props: T

  get id() {
    return this._id
  }

  protected constructor(props: T, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  public equals(entity: Entity<any>): boolean {
    if (entity === this) {
      return true
    }
    if (entity.id.equals(this.id)) {
      return true
    }
    return false
  }
}
