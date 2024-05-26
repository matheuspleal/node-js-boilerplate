import { type OpenAPIV3_1 } from 'openapi-types'

export const errorSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
    },
  },
  required: ['error'],
}
