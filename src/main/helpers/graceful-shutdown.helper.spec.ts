import {
  createGracefulShutdown,
  type GracefulShutdownLogger,
} from '@/main/helpers/graceful-shutdown.helper'

describe('createGracefulShutdown', () => {
  let logger: GracefulShutdownLogger
  let exit: (code: number) => void

  beforeEach(() => {
    logger = {
      info: vi.fn<(message: string) => void>(),
      error: vi.fn<(err: unknown) => void>(),
    }
    exit = vi.fn<(code: number) => void>()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to close the app and disconnect prisma before exiting with code 0', async () => {
    const close = vi.fn().mockResolvedValue(undefined)
    const disconnect = vi.fn().mockResolvedValue(undefined)

    const shutdown = createGracefulShutdown({ logger, close, disconnect, exit })

    await shutdown('SIGTERM')

    expect(logger.info).toHaveBeenCalledWith(
      'Received SIGTERM, shutting down gracefully',
    )
    expect(close).toHaveBeenCalledTimes(1)
    expect(disconnect).toHaveBeenCalledTimes(1)
    expect(exit).toHaveBeenCalledWith(0)
  })

  it('should be able to invoke close before disconnect', async () => {
    const order: string[] = []
    const close = vi.fn().mockImplementation(async () => {
      order.push('close')
    })
    const disconnect = vi.fn().mockImplementation(async () => {
      order.push('disconnect')
    })

    const shutdown = createGracefulShutdown({ logger, close, disconnect, exit })

    await shutdown('SIGINT')

    expect(order).toEqual(['close', 'disconnect'])
  })

  it('should be able to exit with code 1 when close throws', async () => {
    const error = new Error('close failed')
    const close = vi.fn().mockRejectedValue(error)
    const disconnect = vi.fn().mockResolvedValue(undefined)

    const shutdown = createGracefulShutdown({ logger, close, disconnect, exit })

    await shutdown('SIGTERM')

    expect(logger.error).toHaveBeenCalledWith(error)
    expect(disconnect).not.toHaveBeenCalled()
    expect(exit).toHaveBeenCalledWith(1)
  })

  it('should be able to exit with code 1 when disconnect throws', async () => {
    const error = new Error('disconnect failed')
    const close = vi.fn().mockResolvedValue(undefined)
    const disconnect = vi.fn().mockRejectedValue(error)

    const shutdown = createGracefulShutdown({ logger, close, disconnect, exit })

    await shutdown('SIGTERM')

    expect(logger.error).toHaveBeenCalledWith(error)
    expect(exit).toHaveBeenCalledWith(1)
  })

  it('should be able to force exit with code 1 when shutdown exceeds timeout', async () => {
    vi.useFakeTimers()
    const close = vi.fn().mockImplementation(
      () =>
        new Promise<void>(() => {
          /* never resolves */
        }),
    )
    const disconnect = vi.fn().mockResolvedValue(undefined)

    const shutdown = createGracefulShutdown({
      logger,
      close,
      disconnect,
      exit,
      timeoutMs: 10_000,
    })

    void shutdown('SIGTERM')
    await vi.advanceTimersByTimeAsync(10_000)

    expect(exit).toHaveBeenCalledWith(1)
  })

  it('should be able to cancel the timeout when shutdown completes in time', async () => {
    vi.useFakeTimers()
    const close = vi.fn().mockResolvedValue(undefined)
    const disconnect = vi.fn().mockResolvedValue(undefined)

    const shutdown = createGracefulShutdown({
      logger,
      close,
      disconnect,
      exit,
      timeoutMs: 10_000,
    })

    await shutdown('SIGTERM')
    await vi.advanceTimersByTimeAsync(20_000)

    expect(exit).toHaveBeenCalledTimes(1)
    expect(exit).toHaveBeenCalledWith(0)
  })

  it('should be able to fall back to process.exit when no exit dependency is provided', async () => {
    const processExitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never)
    const close = vi.fn().mockResolvedValue(undefined)
    const disconnect = vi.fn().mockResolvedValue(undefined)

    const shutdown = createGracefulShutdown({ logger, close, disconnect })

    await shutdown('SIGTERM')

    expect(processExitSpy).toHaveBeenCalledWith(0)
    processExitSpy.mockRestore()
  })

  it('should be able to fall back to a default timeout when none is provided', async () => {
    vi.useFakeTimers()
    const close = vi.fn().mockImplementation(
      () =>
        new Promise<void>(() => {
          /* never resolves */
        }),
    )
    const disconnect = vi.fn().mockResolvedValue(undefined)

    const shutdown = createGracefulShutdown({ logger, close, disconnect, exit })

    void shutdown('SIGTERM')
    await vi.advanceTimersByTimeAsync(10_000)

    expect(exit).toHaveBeenCalledWith(1)
  })
})
