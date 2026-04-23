import { type OpenAPIV3_1 } from 'openapi-types'

export const fetchUsersResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    count: {
      type: 'number',
      example: 100,
    },
    users: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/userResponse',
      },
    },
  },
  required: ['count', 'users'],
}
