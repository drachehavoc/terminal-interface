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

  // Static factory methods for quick instance creation
  static at(top: number, left: number): TerminalResponsivePosition {
    return new TerminalResponsivePosition({ top, left })
  }

  static center(): TerminalResponsivePosition {
    return new TerminalResponsivePosition({ top: 0.5, left: 0.5 })
  }

  static topLeft(): TerminalResponsivePosition {
    return new TerminalResponsivePosition({ top: 0, left: 0 })
  }

  static topRight(): TerminalResponsivePosition {
    return new TerminalResponsivePosition({ top: 0, left: 1 })
  }

  static bottomLeft(): TerminalResponsivePosition {
    return new TerminalResponsivePosition({ top: 1, left: 0 })
  }

  static bottomRight(): TerminalResponsivePosition {
    return new TerminalResponsivePosition({ top: 1, left: 1 })
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

  // Static factory method for quick relative position creation with offsets
  static from(
    position: TerminalPosition,
    offsets: { top?: number, left?: number }
  ): TerminalRelativePosition {
    const topOffset = offsets.top
    const leftOffset = offsets.left
    return new TerminalRelativePosition({
      position,
      top: topOffset !== undefined ? (rel) => rel.top + topOffset : undefined,
      left: leftOffset !== undefined ? (rel) => rel.left + leftOffset : undefined,
    })
  }

  // Convenience methods for common relative positions
  static above(position: TerminalPosition, offset: number = 1): TerminalRelativePosition {
    return new TerminalRelativePosition({
      position,
      top: (rel) => rel.top - offset,
    })
  }

  static below(position: TerminalPosition, offset: number = 1): TerminalRelativePosition {
    return new TerminalRelativePosition({
      position,
      top: (rel) => rel.top + offset,
    })
  }

  static leftOf(position: TerminalPosition, offset: number = 1): TerminalRelativePosition {
    return new TerminalRelativePosition({
      position,
      left: (rel) => rel.left - offset,
    })
  }

  static rightOf(position: TerminalPosition, offset: number = 1): TerminalRelativePosition {
    return new TerminalRelativePosition({
      position,
      left: (rel) => rel.left + offset,
    })
  }
}