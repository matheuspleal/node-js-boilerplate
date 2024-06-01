export class EmailVO {
  constructor(private readonly value: string) {}

  isValid() {
    const valueRegExp =
      /^(?<username>[^\s@]+)@(?<domain>[^\s@]+)\.(?<tld>com|org)$/i
    const result = this.value.match(valueRegExp)
    return !!result
  }

  toValue() {
    return this.value
  }

  toString() {
    return this.value
  }
}
