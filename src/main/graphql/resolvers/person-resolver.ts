import { apolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver-adapter'
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

export default {
  Query: {
    async fetchUsers(parent: any, args: any, context: any, info: any) {
      return apolloServerResolverAdapter<
        FetchPersonsControllerRequest,
        FetchPersonsControllerResponse
      >(makeFetchPersonsController(), {
        args: {
          'page[offset]': args?.params?.offset,
          'page[limit]': args?.params?.limit,
        },
        context,
        requiresAuth: true,
      })
    },
    async getUserById(parent: any, args: any, context: any, info: any) {
      return apolloServerResolverAdapter<
        GetPersonByIdControllerRequest,
        GetPersonByIdControllerResponse
      >(makeGetPersonByIdController(), {
        args: {
          id: args.userId,
        },
        context,
        requiresAuth: true,
      })
    },
  },
}
