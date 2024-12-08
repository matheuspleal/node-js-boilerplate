import { type OpenAPIV3_1 } from 'openapi-types'

export const userIdParam: OpenAPIV3_1.ParameterObject = {
  name: 'id',
  description: 'User identifier',
  in: 'path',
  required: true,
  example: '931d9967-dd98-4705-b616-6ba16b6f133d',
}
