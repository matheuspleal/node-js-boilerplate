import { type OpenAPIV3_1 } from 'openapi-types'

export const pageSizeParams: OpenAPIV3_1.ParameterObject = {
  name: 'page[size]',
  description: 'Specifies the number of records returned per page',
  in: 'query',
  required: false,
  example: 20,
}
