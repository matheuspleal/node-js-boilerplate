import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/domain/unique-entity.id'
import {
  NotificationEntity,
  type NotificationInput,
  type NotificationProps,
} from '@/modules/notification/domain/entities/notification.entity'

import { type CollectionStubProps } from '#/@types/collection-stub-props.type'

export type NotificationInputProps = NotificationInput & { id?: string }

export interface NotificationEntityProps {
  notificationInput?: Partial<NotificationInputProps>
}

export function makeNotificationInputStub(
  notificationInput?: Partial<NotificationInputProps>,
): NotificationInputProps {
  return {
    id: notificationInput?.id ?? faker.string.uuid(),
    recipientId:
      notificationInput?.recipientId ?? new UniqueEntityId(faker.string.uuid()),
    title: notificationInput?.title ?? faker.lorem.sentence(),
    content: notificationInput?.content ?? faker.lorem.paragraph(),
    readAt: notificationInput?.readAt ?? null,
    createdAt: notificationInput?.createdAt ?? faker.date.recent(),
  }
}

export function makeNotificationEntityStub(
  props?: NotificationEntityProps,
): NotificationEntity {
  const { id, ...rest } = makeNotificationInputStub({
    ...props?.notificationInput,
  })
  const notificationProps: NotificationProps = {
    recipientId: rest.recipientId,
    title: rest.title,
    content: rest.content,
    readAt: rest.readAt ?? null,
    createdAt: rest.createdAt ?? new Date(),
  }
  return NotificationEntity.reconstitute(
    notificationProps,
    new UniqueEntityId(id),
  )
}

export function makeNotificationEntityCollectionStub({
  notificationInput,
  length = 20,
}: NotificationEntityProps & CollectionStubProps): NotificationEntity[] {
  return Array.from({ length }).map(() =>
    makeNotificationEntityStub({ notificationInput }),
  )
}
