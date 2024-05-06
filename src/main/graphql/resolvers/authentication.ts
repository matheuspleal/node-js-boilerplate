import { apolloServerResolverAdapter } from '@/main/adapters/apollo-server-resolver-adapter'
import { makeSignInController } from '@/main/factories/users/presentation/controllers/sign-in-controller-factory'
import { makeSignUpController } from '@/main/factories/users/presentation/controllers/sign-up-controller-factory'
import { type SignIn } from '@/modules/users/presentation/controllers/sign-in-controller'

export default {
  Query: {
    async signIn(parent: any, args: any) {
      return apolloServerResolverAdapter<SignIn.Request, SignIn.Response>(
        makeSignInController(),
        args,
      )
    },
  },
  Mutation: {
    async signUp(parent: any, args: any) {
      return apolloServerResolverAdapter(makeSignUpController(), args)
    },
  },
}
