import { apolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver-adapter'
import { makeFetchUsersController } from '@/main/factories/users/presentation/controllers/fetch-users-controller-factory'
import { makeGetUserByIdController } from '@/main/factories/users/presentation/controllers/get-user-by-id-controller-factory'
import { type FetchUsers } from '@/modules/users/presentation/controllers/fetch-users-controller'
import { type GetUsersById } from '@/modules/users/presentation/controllers/get-user-by-id-controller'

export default {
  Query: {
    async fetchUsers(parent: any, args: any, context: any, info: any) {
      return apolloServerResolverAdapter<
        FetchUsers.Request,
        FetchUsers.Response
      >(makeFetchUsersController(), {
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
        GetUsersById.Request,
        GetUsersById.Response
      >(makeGetUserByIdController(), {
        args: {
          id: args.userId,
        },
        context,
        requiresAuth: true,
      })
    },
  },
}
