import { type OpenAPIV3_1 } from 'openapi-types'

export const serverError: OpenAPIV3_1.ResponseObject = {
  description: 'Server Failed',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/error',
      },
    },
  },
}
