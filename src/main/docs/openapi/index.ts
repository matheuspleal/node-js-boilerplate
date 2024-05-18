import { type OpenAPIV3_1 } from 'openapi-types'

import components from '@/main/docs/openapi/components-setup'
import paths from '@/main/docs/openapi/paths-setup'

export default {
  openapi: '3.1.0',
  info: {
    title: 'Node.js Skeleton API',
    description: 'API docs',
    version: '0.1.0',
    contact: {
      name: 'Matheus Leal',
      email: 'hi@matheuspleal.com',
      url: 'https://www.matheuspleal.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication related end-points',
    },
    {
      name: 'User',
      description: 'User related end-points',
    },
  ],
  externalDocs: {
    url: 'https://swagger.io',
    description: 'Find more info here',
  },
  paths,
  components,
} satisfies OpenAPIV3_1.Document
