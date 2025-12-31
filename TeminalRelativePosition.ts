export class TerminalRelativePosition {
  constructor(
    protected _top: number,
    protected _left: number
  ) { }

  get left() {
    const cols = process.stdout.columns
    return Math.floor(cols * this._left)
  }

  get top() {
    const rows = process.stdout.rows
    return Math.floor(rows * this._top)
  }

}