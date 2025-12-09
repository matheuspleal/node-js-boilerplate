/**
 * Make some type nullable
 *
 * @example
 * ```typescript
 * type User {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * const user: Nullable<User> = null
 * ```
 **/

export type Nullable<T> = T | null
