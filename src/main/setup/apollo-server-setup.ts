import { ApolloServer } from '@apollo/server'
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'
import { type FastifyInstance } from 'fastify'

import {
  authContext,
  type AuthContext,
} from '@/main/graphql/contexts/contracts/auth-context'
import { formatApolloResponse } from '@/main/graphql/plugins/format-apollo-response'
import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'

export async function apolloServerSetup(app: FastifyInstance): Promise<void> {
  const apolloServer = new ApolloServer<AuthContext>({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(app), formatApolloResponse],
  })
  await apolloServer.start()
  app.register(fastifyApollo(apolloServer), {
    path: '/api/graphql',
    context: authContext,
  })
}
