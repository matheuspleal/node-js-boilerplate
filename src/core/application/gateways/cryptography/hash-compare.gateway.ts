export namespace HashCompare {
  export interface Input {
    plaintext: string
    digest: string
  }

  export type Output = boolean
}

export interface HashCompareGateway {
  compare({ plaintext, digest }: HashCompare.Input): Promise<HashCompare.Output>
}
