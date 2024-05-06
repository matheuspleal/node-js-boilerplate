export class Email {
  constructor(private readonly email: string) {}

  isValid() {
    const emailRegExp =
      /^(?<username>[^\s@]+)@(?<domain>[^\s@]+)\.(?<tld>com|org)$/i
    const result = this.email.match(emailRegExp)
    return !!result
  }

  toValue() {
    return this.email
  }

  toString() {
    return this.email
  }
}
