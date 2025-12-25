export abstract class ValueObject<Props> {
  protected props: Props

  constructor(props: Props) {
    this.props = props
  }

  public equals(vo: ValueObject<unknown>): boolean {
    if (vo === null || vo === undefined || vo.props === undefined) {
      return false
    }
    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
