import { type OpenAPIV3_1 } from 'openapi-types'

export const pageLimitParams: OpenAPIV3_1.ParameterObject = {
  name: 'page[limit]',
  description: 'Specifies the maximum number of records returned per page',
  in: 'query',
  required: false,
  example: 20,
}
