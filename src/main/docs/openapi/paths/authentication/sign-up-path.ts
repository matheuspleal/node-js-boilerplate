import { type OpenAPIV3_1 } from 'openapi-types'

export const signUpPath: OpenAPIV3_1.PathItemObject = {
  post: {
    tags: ['Authentication'],
    summary: 'Sign Up User',
    description:
      'This endpoint can be used for any user to **sign up** to the API',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/signUpRequest',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Created',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/signUpResponse',
            },
          },
        },
      },
      400: {
        $ref: '#/components/responses/badRequest',
      },
      409: {
        $ref: '#/components/responses/conflict',
      },
      500: {
        $ref: '#/components/responses/serverError',
      },
    },
  },
}
