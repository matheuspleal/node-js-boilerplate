import { type OpenAPIV3_1 } from 'openapi-types'

export const fetchPersonsPath: OpenAPIV3_1.PathItemObject = {
  get: {
    tags: ['Person'],
    summary: 'Fetch Persons',
    description: 'This endpoint is to fetch persons by any authorized user',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        $ref: '#/components/parameters/pageOffset',
      },
      {
        $ref: '#/components/parameters/pageLimit',
      },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/fetchPersonsResponse',
            },
          },
        },
      },
      401: {
        $ref: '#/components/responses/unauthorized',
      },
      500: {
        $ref: '#/components/responses/serverError',
      },
    },
  },
}
