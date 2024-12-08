import { type OpenAPIV3_1 } from 'openapi-types'

export const filterLimitParams: OpenAPIV3_1.ParameterObject = {
  name: 'filter[limit]',
  description: 'Limit',
  in: 'query',
  required: false,
  example: 20,
}
