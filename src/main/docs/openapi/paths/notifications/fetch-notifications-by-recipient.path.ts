import { type OpenAPIV3_1 } from 'openapi-types'

export const fetchNotificationsByRecipientPath: OpenAPIV3_1.PathItemObject = {
  get: {
    tags: ['Notification'],
    summary: 'Fetch Notifications by Recipient',
    description:
      'This endpoint is to fetch notifications by recipient id by any authorized user',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        $ref: '#/components/parameters/recipientId',
      },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/fetchNotificationsResponse',
            },
          },
        },
      },
      401: {
        $ref: '#/components/responses/unauthorized',
      },
      500: {
        $ref: '#/components/responses/serverError',
      },
    },
  },
}
