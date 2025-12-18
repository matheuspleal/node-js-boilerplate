export namespace HashGenerator {
  export interface Input {
    plaintext: string
  }

  export type Output = string
}

export interface HashGeneratorGateway {
  hash({ plaintext }: HashGenerator.Input): Promise<HashGenerator.Output>
}
