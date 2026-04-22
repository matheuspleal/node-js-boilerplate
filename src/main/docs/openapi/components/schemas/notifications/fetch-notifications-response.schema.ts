import { type OpenAPIV3_1 } from 'openapi-types'

export const fetchNotificationsResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    count: {
      type: 'number',
      example: 10,
    },
    notifications: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/notificationResponse',
      },
    },
  },
  required: ['count', 'notifications'],
}
