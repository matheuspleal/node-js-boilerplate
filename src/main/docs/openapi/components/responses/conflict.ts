import { type OpenAPIV3_1 } from 'openapi-types'

export const conflict: OpenAPIV3_1.ResponseObject = {
  description: 'Conflict',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/error',
      },
    },
  },
}
