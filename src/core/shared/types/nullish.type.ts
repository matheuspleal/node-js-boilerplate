/**
 * Make some type nullish
 *
 * @example
 * ```typescript
 * type User {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * const user: Nullish<User> = null
 * const user: Nullish<User> = undefined
 * ```
 **/

export type Nullish<T> = T | null | undefined
