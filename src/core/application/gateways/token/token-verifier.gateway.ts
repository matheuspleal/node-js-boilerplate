export namespace TokenVerifier {
  export interface Input {
    token: string
  }
  export interface Output {
    sub: string
  }
}

export interface TokenVerifierGateway {
  verify({ token }: TokenVerifier.Input): TokenVerifier.Output
}
