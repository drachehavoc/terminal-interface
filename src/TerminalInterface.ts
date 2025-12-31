export class TerminalPosition {
  constructor(
    public top: number,
    public left: number
  ) { }
}

export class TerminalResponsivePosition {
  #top; #left
  
  constructor(args: {
    top: number,
    left: number,
  }) { 
    this.#top = args.top
    this.#left = args.left
  }

  get left() {
    const cols = process.stdout.columns
    return Math.round(cols * this.#left)
  }

  get top() {
    const rows = process.stdout.rows
    return Math.round(rows * this.#top)
  }
}

export class TerminalRelativePosition  {
  #rel; #top; #left

  constructor(arg: {
    position: TerminalPosition,
    top?: (relative: TerminalPosition) => number,
    left?:(relative: TerminalPosition) => number,
  }) { 
    this.#rel = arg.position
    this.#top = arg.top ?? ((rel) => rel.top)
    this.#left = arg.left ?? ((rel) => rel.left)
  }

  get left() {
    return this.#left(this.#rel)
  }

  get top() {
    return this.#top(this.#rel)
  }
}