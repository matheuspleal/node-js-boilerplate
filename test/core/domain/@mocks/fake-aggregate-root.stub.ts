import { AggregateRoot } from '@/core/domain/aggregate-root'
import { type DomainEvent } from '@/core/domain/events/domain-event'
import { type UniqueEntityId } from '@/core/domain/unique-entity.id'

interface FakeAggregateProps {
  name: string
}

export class FakeAggregateRoot extends AggregateRoot<FakeAggregateProps> {
  get name(): string {
    return this.props.name
  }

  publishDomainEvent(event: DomainEvent): void {
    this.addDomainEvent(event)
  }

  static create(props: FakeAggregateProps, id?: UniqueEntityId) {
    return new FakeAggregateRoot(props, id)
  }
}
