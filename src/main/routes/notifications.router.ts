import { type FastifyInstance } from 'fastify'

import { fastifyHandlerAdapter } from '@/main/adapters/fastify-handler.adapter'
import { fastifyRouterAdapter } from '@/main/adapters/fastify-router.adapter'
import { makeAuthenticationMiddleware } from '@/main/factories/core/presentation/middlewares/authentication.middleware.factory'
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

const notificationRouterPrefix = '/notifications'

export default async function notificationRouter(app: FastifyInstance) {
  app.get(
    `${notificationRouterPrefix}/recipient/:recipientId`,
    {
      preHandler: [fastifyHandlerAdapter(makeAuthenticationMiddleware())],
    },
    fastifyRouterAdapter<
      FetchNotificationsByRecipientControllerRequest,
      FetchNotificationsByRecipientControllerResponse
    >(makeFetchNotificationsByRecipientController()),
  )
  app.patch(
    `${notificationRouterPrefix}/:id/read`,
    {
      preHandler: [fastifyHandlerAdapter(makeAuthenticationMiddleware())],
    },
    fastifyRouterAdapter<
      ReadNotificationControllerRequest,
      ReadNotificationControllerResponse
    >(makeReadNotificationController()),
  )
}
