import { AggregateRoot } from '@/core/domain/aggregate-root'
import { type UniqueEntityId } from '@/core/domain/unique-entity.id'
import { Optional } from '@/core/shared/types/optional.type'
import { NotificationCreatedEvent } from '@/modules/notification/domain/events/notification-created.event'

export interface NotificationProps {
  recipientId: UniqueEntityId
  title: string
  content: string
  readAt: Date | null
  createdAt: Date
}

export type NotificationInput = Optional<
  NotificationProps,
  'readAt' | 'createdAt'
>

export class NotificationEntity extends AggregateRoot<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get readAt() {
    return this.props.readAt
  }

  get isRead(): boolean {
    return this.props.readAt !== null
  }

  get createdAt() {
    return this.props.createdAt
  }

  read(): void {
    this.props.readAt = new Date()
  }

  static create(
    props: NotificationInput,
    id?: UniqueEntityId,
  ): NotificationEntity {
    const notification = new NotificationEntity(
      {
        ...props,
        readAt: props.readAt ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    notification.addDomainEvent(new NotificationCreatedEvent(notification.id))
    return notification
  }

  static reconstitute(
    props: NotificationProps,
    id: UniqueEntityId,
  ): NotificationEntity {
    return new NotificationEntity(props, id)
  }
}
