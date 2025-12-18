export interface CountPersonsRepository {
  count(): Promise<number>
}
