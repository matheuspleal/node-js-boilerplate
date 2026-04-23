export interface GracefulShutdownLogger {
  info: (message: string) => void
  error: (err: unknown) => void
}

export interface GracefulShutdownDeps {
  logger: GracefulShutdownLogger
  close: () => Promise<void>
  disconnect: () => Promise<void>
  exit?: (code: number) => void
  timeoutMs?: number
}

export function createGracefulShutdown(deps: GracefulShutdownDeps) {
  const exit = deps.exit ?? ((code: number) => process.exit(code))
  const timeoutMs = deps.timeoutMs ?? 10_000
  return async function gracefulShutdown(signal: string): Promise<void> {
    deps.logger.info(`Received ${signal}, shutting down gracefully`)
    const forceExit = setTimeout(() => exit(1), timeoutMs)
    try {
      await deps.close()
      await deps.disconnect()
      clearTimeout(forceExit)
      exit(0)
    } catch (err) {
      deps.logger.error(err)
      clearTimeout(forceExit)
      exit(1)
    }
  }
}
