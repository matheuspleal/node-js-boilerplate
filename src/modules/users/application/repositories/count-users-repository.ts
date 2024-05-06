export interface CountUsersRepository {
  count(): Promise<number>
}
