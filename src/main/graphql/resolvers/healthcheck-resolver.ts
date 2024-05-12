export default {
  Query: {
    async healthcheck(parent: any, args: any, context: any, info: any) {
      return { message: 'Ok!' }
    },
  },
}
