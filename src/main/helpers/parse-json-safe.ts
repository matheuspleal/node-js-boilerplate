export function parseJSONSafe<T = any>(value: string): T | string {
  try {
    return JSON.parse(value) as T
  } catch {
    return value
  }
}
