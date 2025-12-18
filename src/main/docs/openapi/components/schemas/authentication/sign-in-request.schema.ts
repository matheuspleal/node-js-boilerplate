import { type OpenAPIV3_1 } from 'openapi-types'

export const signInRequestSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      example: 'john.doe@domain.com',
    },
    password: {
      type: 'string',
      example: 'P@ssw0rd!123',
    },
  },
  required: ['email', 'password'],
}
