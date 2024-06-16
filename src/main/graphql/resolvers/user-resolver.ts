import { apolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver-adapter'
import { makeSignInController } from '@/main/factories/users/presentation/controllers/sign-in-controller-factory'
import { makeSignUpController } from '@/main/factories/users/presentation/controllers/sign-up-controller-factory'
import {
  type SignInControllerRequest,
  type SignInControllerResponse,
} from '@/modules/users/presentation/controllers/sign-in-controller'

export default {
  Query: {
    async signIn(parent: any, args: any, context: any, info: any) {
      return apolloServerResolverAdapter<
        SignInControllerRequest,
        SignInControllerResponse
      >(makeSignInController(), {
        args,
        context,
      })
    },
  },
  Mutation: {
    async signUp(parent: any, args: any, context: any, info: any) {
      return apolloServerResolverAdapter(makeSignUpController(), {
        args,
        context,
      })
    },
  },
}
