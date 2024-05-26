import { type OpenAPIV3_1 } from 'openapi-types'

export const userResponseSchema: OpenAPIV3_1.SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: '678862ec-3ee7-4a90-96f8-30ed2f719bd8',
    },
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
    age: {
      type: 'number',
      example: 24,
    },
    createdAt: {
      type: 'string',
      example: '2024-01-01T12:00:00.000Z',
    },
    updatedAt: {
      type: 'string',
      example: '2024-01-01T12:00:00.000Z',
    },
  },
  required: [
    'id',
    'name',
    'email',
    'password',
    'age',
    'createdAt',
    'updatedAt',
  ],
}
