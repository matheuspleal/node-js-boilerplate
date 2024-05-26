import { type OpenAPIV3_1 } from 'openapi-types'

export const getUserByIdPath: OpenAPIV3_1.PathItemObject = {
  get: {
    tags: ['User'],
    summary: 'Get User by Id',
    description: 'This endpoint is to get user by id by any authorized user',
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        $ref: '#/components/parameters/userId',
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
      404: {
        $ref: '#/components/responses/notFound',
      },
      500: {
        $ref: '#/components/responses/serverError',
      },
    },
  },
}
