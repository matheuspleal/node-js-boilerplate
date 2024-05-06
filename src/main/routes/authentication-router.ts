import { type FastifyInstance } from 'fastify'

import { fastifyRouterAdapter } from '@/main/adapters/fastify-router-adapter'
import { makeSignInController } from '@/main/factories/users/presentation/controllers/sign-in-controller-factory'
import { makeSignUpController } from '@/main/factories/users/presentation/controllers/sign-up-controller-factory'
import { type SignIn } from '@/modules/users/presentation/controllers/sign-in-controller'
import { type SignUp } from '@/modules/users/presentation/controllers/sign-up-controller'

const signInRouterPrefix = '/signin'
const signUpRouterPrefix = '/signup'

export default async function authenticationRouter(app: FastifyInstance) {
  app.post(
    signInRouterPrefix,
    fastifyRouterAdapter<SignIn.Request, SignIn.Response>(
      makeSignInController(),
    ),
  )
  app.post(
    signUpRouterPrefix,
    fastifyRouterAdapter<SignUp.Request, SignUp.Response>(
      makeSignUpController(),
    ),
  )
}
