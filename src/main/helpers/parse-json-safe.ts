export function parseJSONSafe(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}
