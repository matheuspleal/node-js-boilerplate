import { type OpenAPIV3_1 } from 'openapi-types'

export const fetchUsersPath: OpenAPIV3_1.PathItemObject = {
  get: {
    tags: ['User'],
    summary: 'Fetch Users',
    description: 'This route is to fetch users',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        $ref: '#/components/parameters/filterOffset',
      },
      {
        $ref: '#/components/parameters/filterLimit',
      },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/fetchUsersResponse',
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
