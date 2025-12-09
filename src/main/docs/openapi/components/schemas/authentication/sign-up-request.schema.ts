import { type OpenAPIV3_1 } from 'openapi-types'

export const signUpRequestSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'John Doe',
    },
    email: {
      type: 'string',
      example: 'john.doe@domain.com',
    },
    password: {
      type: 'string',
      example: 'P@ssw0rd!123',
    },
    birthdate: {
      type: 'string',
      example: '2000-01-01',
    },
  },
  required: ['name', 'email', 'password', 'birthdate'],
}
