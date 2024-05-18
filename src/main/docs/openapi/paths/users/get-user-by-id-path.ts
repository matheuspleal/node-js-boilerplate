import { type OpenAPIV3_1 } from 'openapi-types'

export const getUserByIdPath: OpenAPIV3_1.PathItemObject = {
  get: {
    tags: ['User'],
    summary: 'Get User by Id',
    description: 'This route is to get an user by id',
    security: [
      {
        bearerAuth: [],
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
