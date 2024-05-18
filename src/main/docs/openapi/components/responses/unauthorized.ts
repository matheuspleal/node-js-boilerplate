import { type OpenAPIV3_1 } from 'openapi-types'

export const unauthorized: OpenAPIV3_1.ResponseObject = {
  description: 'Invalid Credentials',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/error',
      },
    },
  },
}
