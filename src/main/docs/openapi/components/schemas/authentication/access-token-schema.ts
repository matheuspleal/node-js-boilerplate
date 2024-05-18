import { type OpenAPIV3_1 } from 'openapi-types'

export const accessTokenSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
    },
  },
  required: ['accessToken'],
}
