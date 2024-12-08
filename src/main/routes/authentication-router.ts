import { type FastifyInstance } from 'fastify'

import { fastifyRouterAdapter } from '@/main/adapters/fastify-router-adapter'
import { makeSignInController } from '@/main/factories/users/presentation/controllers/sign-in-controller-factory'
import { makeSignUpController } from '@/main/factories/users/presentation/controllers/sign-up-controller-factory'
import {
  type SignInControllerRequest,
  type SignInControllerResponse,
} from '@/modules/users/presentation/controllers/sign-in-controller'
import {
  type SignUpControllerRequest,
  type SignUpControllerResponse,
} from '@/modules/users/presentation/controllers/sign-up-controller'

const signInRouterPrefix = '/sign-in'
const signUpRouterPrefix = '/sign-up'

export default async function authenticationRouter(app: FastifyInstance) {
  app.post(
    signInRouterPrefix,
    fastifyRouterAdapter<SignInControllerRequest, SignInControllerResponse>(
      makeSignInController(),
    ),
  )
  app.post(
    signUpRouterPrefix,
    fastifyRouterAdapter<SignUpControllerRequest, SignUpControllerResponse>(
      makeSignUpController(),
    ),
  )
}
