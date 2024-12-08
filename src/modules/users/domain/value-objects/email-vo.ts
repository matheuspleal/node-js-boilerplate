import { ValueObject } from '@/core/domain/value-objects/value-object'

interface EmailProps {
  value: string
}

export class EmailVO extends ValueObject<EmailProps> {
  isValid() {
    const valueRegExp =
      /^(?<username>[^\s@]+)@(?<domain>[^\s@]+)\.(?<tld>com|org)$/i
    const result = this.props.value.match(valueRegExp)
    return !!result
  }

  toValue() {
    return this.props.value
  }

  toString() {
    return this.props.value
  }
}
