import { type OpenAPIV3_1 } from 'openapi-types'

export const pageOffsetParams: OpenAPIV3_1.ParameterObject = {
  name: 'page[offset]',
  description: 'Defines the starting offset for fetching records',
  in: 'query',
  required: false,
  example: 1,
}
