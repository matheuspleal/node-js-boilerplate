import { type OpenAPIV3_1 } from 'openapi-types'

export const badRequest: OpenAPIV3_1.ResponseObject = {
  description: 'Bad Request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/error',
      },
    },
  },
}
