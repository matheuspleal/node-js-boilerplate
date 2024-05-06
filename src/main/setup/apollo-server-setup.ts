import { ApolloServer, type BaseContext } from '@apollo/server'
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify'
import { type FastifyInstance } from 'fastify'

import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'

export async function apolloServerSetup(app: FastifyInstance): Promise<void> {
  const apolloServer = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(app)],
  })
  await apolloServer.start()
  app.register(fastifyApollo(apolloServer))
}
