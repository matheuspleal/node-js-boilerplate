import { type ConfigError } from '@/core/shared/config/errors/config-error'

export class EnvVariableNotProvidedError extends Error implements ConfigError {
  constructor(
    public readonly key: string,
    public readonly type: string,
  ) {
    super(
      `Environment variable with key "${key}" and type "${type}" is not provided`,
    )
  }
}
