import { InvalidPasswordError } from '@/modules/users/domain/errors/invalid-password.error'
import { PasswordVO } from '@/modules/users/domain/value-objects/password.vo'

import { hashedPasswordStub } from '#/modules/users/application/@mocks/password.stub'

describe('PasswordVO', () => {
  it('should not be able to create an instance with a password too short', () => {
    const result = PasswordVO.create({ value: 'Ab1@' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPasswordError)
  })

  it('should not be able to create an instance with a password too long', () => {
    const result = PasswordVO.create({
      value: 'Ab1@Xxxxxxxxxxxxxxxxxxx',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPasswordError)
  })

  it('should not be able to create an instance without an uppercase character', () => {
    const result = PasswordVO.create({ value: 'abcdefg1@' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPasswordError)
  })

  it('should not be able to create an instance without a lowercase character', () => {
    const result = PasswordVO.create({ value: 'ABCDEFG1@' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPasswordError)
  })

  it('should not be able to create an instance without a numeric character', () => {
    const result = PasswordVO.create({ value: 'Abcdefgh@' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPasswordError)
  })

  it('should not be able to create an instance without a special character', () => {
    const result = PasswordVO.create({ value: 'Abcdefg12' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPasswordError)
  })

  it('should be able to create an instance with a valid password', () => {
    const result = PasswordVO.create({ value: 'P@ssw0rd!' })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeInstanceOf(PasswordVO)
    if (result.isRight()) {
      expect(result.value.toValue()).toEqual('P@ssw0rd!')
      expect(result.value.toString()).toEqual('P@ssw0rd!')
    }
  })

  it('should be able to reconstitute an instance from a hash', () => {
    const passwordVO = PasswordVO.reconstitute(hashedPasswordStub)

    expect(passwordVO).toBeInstanceOf(PasswordVO)
    expect(passwordVO.toValue()).toEqual(hashedPasswordStub)
  })

  it('should be able to compare two equal PasswordVO instances', () => {
    const passwordVO1 = PasswordVO.reconstitute(hashedPasswordStub)
    const passwordVO2 = PasswordVO.reconstitute(hashedPasswordStub)

    expect(passwordVO1.equals(passwordVO2)).toBe(true)
  })

  it('should be able to compare two different PasswordVO instances', () => {
    const passwordVO1 = PasswordVO.reconstitute(hashedPasswordStub)
    const passwordVO2 = PasswordVO.reconstitute('different-hash')

    expect(passwordVO1.equals(passwordVO2)).toBe(false)
  })
})
