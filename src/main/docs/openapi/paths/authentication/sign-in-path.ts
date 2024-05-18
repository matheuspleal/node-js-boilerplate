import { type OpenAPIV3_1 } from 'openapi-types'

export const signInPath: OpenAPIV3_1.PathItemObject = {
  post: {
    tags: ['Authentication'],
    summary: 'Sign In User',
    description:
      'This endpoint can be used for any registered user to **sign in** to the API',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/signInRequest',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/accessToken',
            },
          },
        },
      },
      400: {
        $ref: '#/components/responses/badRequest',
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
