import { type OpenAPIV3_1 } from 'openapi-types'

export const notFound: OpenAPIV3_1.ResponseObject = {
  description: 'Not Found',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/error',
      },
    },
  },
}
