export default {
  Query: {
    async healthCheck(parent: any, args: any, context: any, info: any) {
      return { message: 'Ok!' }
    },
  },
}
