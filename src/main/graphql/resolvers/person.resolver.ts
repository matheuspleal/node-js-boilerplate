/* eslint-disable @typescript-eslint/no-unused-vars */
import { apolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver.adapter'
import { makeFetchPersonsController } from '@/main/factories/persons/presentation/controllers/fetch-persons-controller.factory'
import { makeGetPersonByIdController } from '@/main/factories/persons/presentation/controllers/get-person-by-id-controller.factory'
import {
  type FetchPersonsControllerRequest,
  type FetchPersonsControllerResponse,
} from '@/modules/persons/presentation/controllers/fetch-persons.controller'
import {
  type GetPersonByIdControllerRequest,
  type GetPersonByIdControllerResponse,
} from '@/modules/persons/presentation/controllers/get-person-by-id.controller'

export default {
  Query: {
    async fetchPersons(parent: any, args: any, context: any, info: any) {
      return apolloServerResolverAdapter<
        FetchPersonsControllerRequest,
        FetchPersonsControllerResponse
      >(makeFetchPersonsController(), {
        args: {
          'page[number]': args?.params?.number,
          'page[size]': args?.params?.size,
        },
        context,
        requiresAuth: true,
      })
    },
    async getPersonById(parent: any, args: any, context: any, info: any) {
      return apolloServerResolverAdapter<
        GetPersonByIdControllerRequest,
        GetPersonByIdControllerResponse
      >(makeGetPersonByIdController(), {
        args: {
          id: args.id,
        },
        context,
        requiresAuth: true,
      })
    },
  },
}
