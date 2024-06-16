import { type FastifyInstance } from 'fastify'

import { fastifyHandlerAdapter } from '@/main/adapters/fastify-handler-adapter'
import { fastifyRouterAdapter } from '@/main/adapters/fastify-router-adapter'
import { makeAuthenticationMiddleware } from '@/main/factories/core/presentation/middlewares/authentication-middleware-factory'
import { makeFetchPersonsController } from '@/main/factories/persons/presentation/controllers/fetch-persons-controller-factory'
import { makeGetPersonByIdController } from '@/main/factories/persons/presentation/controllers/get-person-by-id-controller-factory'
import {
  type FetchPersonsControllerRequest,
  type FetchPersonsControllerResponse,
} from '@/modules/persons/presentation/controllers/fetch-persons-controller'
import {
  type GetPersonByIdControllerRequest,
  type GetPersonByIdControllerResponse,
} from '@/modules/persons/presentation/controllers/get-person-by-id-controller'

const usersRouterPrefix = '/users'

export default async function usersRouter(app: FastifyInstance) {
  app.get(
    usersRouterPrefix,
    {
      preHandler: [fastifyHandlerAdapter(makeAuthenticationMiddleware())],
    },
    fastifyRouterAdapter<
      FetchPersonsControllerRequest,
      FetchPersonsControllerResponse
    >(makeFetchPersonsController()),
  )
  app.get(
    `${usersRouterPrefix}/:id`,
    {
      preHandler: [fastifyHandlerAdapter(makeAuthenticationMiddleware())],
    },
    fastifyRouterAdapter<
      GetPersonByIdControllerRequest,
      GetPersonByIdControllerResponse
    >(makeGetPersonByIdController()),
  )
}
