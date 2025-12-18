export namespace TokenGenerator {
  export interface Input {
    payload: Record<string, any>
    expiresInMs: number
  }
  export type Output = string
}

export interface TokenGeneratorGateway {
  generate({
    payload,
    expiresInMs,
  }: TokenGenerator.Input): TokenGenerator.Output
}
