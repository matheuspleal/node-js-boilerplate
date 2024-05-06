import { EnvVariableNotProvidedError } from '@/core/shared/config/errors/env-variable-not-provided-error'
import { FailedToConvertEnvVariableError } from '@/core/shared/config/errors/failed-to-convert-env-variable-error'
import { env } from '@/core/shared/config/helpers/env'
import { EnvVariableEnum } from '@/core/shared/config/types/env-variable-enum'

const envVariableTypes = [
  EnvVariableEnum.BOOLEAN,
  EnvVariableEnum.NUMBER,
  EnvVariableEnum.STRING,
]

describe('env', () => {
  it.each(envVariableTypes)(
    'should be able to throws EnvVariableNotProvidedError when %s env is not provided e default value is not set',
    (type) => {
      expect(() => {
        if (type === EnvVariableEnum.BOOLEAN) {
          return env<boolean>({
            key: 'NON_EXISTENT_KEY',
            type: EnvVariableEnum.BOOLEAN,
          })
        }
        if (type === EnvVariableEnum.NUMBER) {
          return env<number>({
            key: 'NON_EXISTENT_KEY',
            type: EnvVariableEnum.NUMBER,
          })
        }
        return env<string>({
          key: 'NON_EXISTENT_KEY',
          type: EnvVariableEnum.STRING,
        })
      }).toThrowError(EnvVariableNotProvidedError)
    },
  )

  it.each(envVariableTypes)(
    'should be able to return %s env value when key is provided and default value is not set',
    (type) => {
      if (type === EnvVariableEnum.BOOLEAN) {
        process.env.FAKE_ENV_FOR_TEST = 'true'

        const trueValue = env<boolean>({
          key: 'FAKE_ENV_FOR_TEST',
          type: EnvVariableEnum.BOOLEAN,
        })

        process.env.FAKE_ENV_FOR_TEST = 'false'

        const falseValue = env<boolean>({
          key: 'FAKE_ENV_FOR_TEST',
          type: EnvVariableEnum.BOOLEAN,
        })

        expect(trueValue).toEqual(true)
        expect(falseValue).toEqual(false)
      }

      if (type === EnvVariableEnum.NUMBER) {
        process.env.FAKE_ENV_FOR_TEST = '10'

        const numberValue = env<number>({
          key: 'FAKE_ENV_FOR_TEST',
          type: EnvVariableEnum.NUMBER,
        })

        expect(numberValue).toEqual(10)
      }

      if (type === EnvVariableEnum.STRING) {
        process.env.FAKE_ENV_FOR_TEST = 'fake_value'

        const stringValue = env<string>({
          key: 'FAKE_ENV_FOR_TEST',
          type: EnvVariableEnum.STRING,
        })

        expect(stringValue).toEqual('fake_value')
      }
    },
  )

  it.each(envVariableTypes)(
    'should be able to return %s env value when key is not provided and default value is set',
    (type) => {
      if (type === EnvVariableEnum.BOOLEAN) {
        const trueValue = env<boolean>({
          key: 'NON_EXISTENT_KEY',
          defaultValue: true,
        })

        const falseValue = env<boolean>({
          key: 'NON_EXISTENT_KEY',
          defaultValue: false,
        })

        expect(trueValue).toEqual(true)
        expect(falseValue).toEqual(false)
      }
      if (type === EnvVariableEnum.NUMBER) {
        const numberValue = env<number>({
          key: 'NON_EXISTENT_KEY',
          defaultValue: 10,
        })

        expect(numberValue).toEqual(10)
      }
      if (type === EnvVariableEnum.STRING) {
        const stringValue = env<string>({
          key: 'NON_EXISTENT_KEY',
          defaultValue: 'fake_value',
        })

        expect(stringValue).toEqual('fake_value')
      }
    },
  )

  it.each([EnvVariableEnum.BOOLEAN, EnvVariableEnum.NUMBER])(
    'should be able to throws FailedToConvertEnvVariableError when %s env is provided with wrong type',
    (type) => {
      expect(() => {
        if (type === EnvVariableEnum.BOOLEAN) {
          process.env.FAKE_ENV_FOR_TEST = 'fake_string'

          return env<boolean>({
            key: 'FAKE_ENV_FOR_TEST',
            type: EnvVariableEnum.BOOLEAN,
          })
        }

        process.env.FAKE_ENV_FOR_TEST = 'fake_number'

        return env<number>({
          key: 'FAKE_ENV_FOR_TEST',
          type: EnvVariableEnum.NUMBER,
        })
      }).toThrowError(FailedToConvertEnvVariableError)
    },
  )
})
