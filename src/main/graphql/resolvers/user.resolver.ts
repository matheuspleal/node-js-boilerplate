/* eslint-disable @typescript-eslint/no-unused-vars */
import { apolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver.adapter'
import { makeFetchUsersController } from '@/main/factories/users/presentation/controllers/fetch-users-controller.factory'
import { makeGetUserByIdController } from '@/main/factories/users/presentation/controllers/get-user-by-id-controller.factory'
import {
  type FetchUsersControllerRequest,
  type FetchUsersControllerResponse,
} from '@/modules/users/presentation/controllers/fetch-users.controller'
import {
  type GetUserByIdControllerRequest,
  type GetUserByIdControllerResponse,
} from '@/modules/users/presentation/controllers/get-user-by-id.controller'

export default {
  Query: {
    async fetchUsers(parent: any, args: any, context: any, info: any) {
      return apolloServerResolverAdapter<
        FetchUsersControllerRequest,
        FetchUsersControllerResponse
      >(makeFetchUsersController(), {
        args: {
          'page[number]': args?.params?.number,
          'page[size]': args?.params?.size,
        },
        context,
        requiresAuth: true,
      })
    },
    async getUserById(parent: any, args: any, context: any, info: any) {
      return apolloServerResolverAdapter<
        GetUserByIdControllerRequest,
        GetUserByIdControllerResponse
      >(makeGetUserByIdController(), {
        args: {
          id: args.id,
        },
        context,
        requiresAuth: true,
      })
    },
  },
}
