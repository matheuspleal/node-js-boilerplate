import { type OpenAPIV3_1 } from 'openapi-types'

export const readNotificationPath: OpenAPIV3_1.PathItemObject = {
  patch: {
    tags: ['Notification'],
    summary: 'Read Notification',
    description:
      'This endpoint is to mark a notification as read by any authorized user',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        $ref: '#/components/parameters/notificationId',
      },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/notificationResponse',
            },
          },
        },
      },
      401: {
        $ref: '#/components/responses/unauthorized',
      },
      404: {
        $ref: '#/components/responses/notFound',
      },
      500: {
        $ref: '#/components/responses/serverError',
      },
    },
  },
}
