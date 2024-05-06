import { type ConfigError } from '@/core/shared/config/errors/config-error'

export class FailedToConvertEnvVariableError
  extends Error
  implements ConfigError
{
  constructor(
    public readonly key: string,
    public readonly type: string,
  ) {
    super(`Failed to convert env "${key}" to type "${type}"`)
  }
}
