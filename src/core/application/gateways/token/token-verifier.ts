export namespace TokenVerifier {
  export interface Input {
    token: string
  }
  export type Output = string
}

export interface TokenVerifierGateway {
  verify({ token }: TokenVerifier.Input): TokenVerifier.Output
}
