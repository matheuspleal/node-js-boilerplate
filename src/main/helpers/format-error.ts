import { parseJSONSafe } from '@/main/helpers/parse-json-safe'

export function formatError(message: string) {
  const parsedMessage = parseJSONSafe(message)
  return parsedMessage === message
    ? { error: message }
    : { errors: parsedMessage }
}
