/* eslint-disable @typescript-eslint/no-unused-vars */
import { apolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver.adapter'
import { makeFetchNotificationsByRecipientController } from '@/main/factories/notification/presentation/controllers/fetch-notifications-by-recipient-controller.factory'
import { makeReadNotificationController } from '@/main/factories/notification/presentation/controllers/read-notification-controller.factory'
import {
  type FetchNotificationsByRecipientControllerRequest,
  type FetchNotificationsByRecipientControllerResponse,
} from '@/modules/notification/presentation/controllers/fetch-notifications-by-recipient.controller'
import {
  type ReadNotificationControllerRequest,
  type ReadNotificationControllerResponse,
} from '@/modules/notification/presentation/controllers/read-notification.controller'

export default {
  Query: {
    async fetchNotificationsByRecipient(
      parent: any,
      args: any,
      context: any,
      info: any,
    ) {
      return apolloServerResolverAdapter<
        FetchNotificationsByRecipientControllerRequest,
        FetchNotificationsByRecipientControllerResponse
      >(makeFetchNotificationsByRecipientController(), {
        args: {
          recipientId: args.recipientId,
        },
        context,
        requiresAuth: true,
      })
    },
  },
  Mutation: {
    async readNotification(parent: any, args: any, context: any, info: any) {
      return apolloServerResolverAdapter<
        ReadNotificationControllerRequest,
        ReadNotificationControllerResponse
      >(makeReadNotificationController(), {
        args: {
          id: args.id,
        },
        context,
        requiresAuth: true,
      })
    },
  },
}
