import { type OpenAPIV3_1 } from 'openapi-types'

export const getPersonByIdPath: OpenAPIV3_1.PathItemObject = {
  get: {
    tags: ['Person'],
    summary: 'Get Person by Id',
    description: 'This endpoint is to get person by id by any authorized user',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        $ref: '#/components/parameters/personId',
      },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/personResponse',
            },
          },
        },
      },
      401: {
        $ref: '#/components/responses/unauthorized',
      },
      404: {
        $ref: '#/components/responses/notFound',
      },
      500: {
        $ref: '#/components/responses/serverError',
      },
    },
  },
}
