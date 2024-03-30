/**
 * Make some property optional on type
 *
 * @example
 * ```typescript
 * type User {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * const user: Optional<User, 'id' | 'email'> = {
 *  name: 'John Doe';
 *  email: 'johndoe@email.com';
 * }
 * ```
 **/

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
