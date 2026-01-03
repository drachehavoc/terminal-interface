// --- INTERFACES & TYPES ---

export interface TTermSquare {
  top: number
  left: number
  bottom: number
  right: number
  height: number
  width: number
}

export type TCoordinate = {
  row: number
  col: number
}

export type TSize = {
  height: number,
  width: number,
}

// --- IMPLEMENTATIONS ---

export class TermFixedCoord implements TCoordinate {
  constructor(
    public row: number,
    public col: number
  ) { }
}

export class TermResponsiveCoord implements TCoordinate {
  #decimalPercentageV
  #decimalPercentageH

  constructor(
    decimalPercentageV: number,
    decimalPercentageH: number
  ) {
    this.#decimalPercentageV = decimalPercentageV
    this.#decimalPercentageH = decimalPercentageH
  }

  get row(): number {
    return Math.round((process.stdout.rows - 1) * this.#decimalPercentageV)
  }

  get col(): number {
    return Math.round((process.stdout.columns - 1) * this.#decimalPercentageH)
  }
}

export class TermSize implements TSize {
  constructor(
    public height: number,
    public width: number
  ) { }
}

export class TermSquareBySize {
  constructor(
    public topLeft: TermFixedCoord,
    public size: TermSize
  ) { }

  get top() {
    return this.topLeft.row
  }

  get left() {
    return this.topLeft.col
  }

  get bottom() {
    return this.topLeft.row + this.size.height - 1
  }

  get right() {
    return this.topLeft.col + this.size.width - 1
  }

  get height() {
    return this.size.height
  }

  get width() {
    return this.size.width
  }
}

export class TermSquareByCorners {
  constructor(
    public topLeft: TermFixedCoord,
    public bottomRight: TermFixedCoord
  ) { }

  get top() {
    return this.topLeft.row
  }

  get left() {
    return this.topLeft.col
  }

  get bottom() {
    return this.bottomRight.row
  }

  get right() {
    return this.bottomRight.col
  }

  get height() {
    return this.bottomRight.row - this.topLeft.row + 1
  }

  get width() {
    return this.bottomRight.col - this.topLeft.col + 1
  }
}

// --- FACTORIES ---

export function square(
  topLeft: TermFixedCoord,
  bottomRightOrSize: TCoordinate | TSize) {
  if (bottomRightOrSize instanceof TermFixedCoord) {
    return new TermSquareByCorners(topLeft, bottomRightOrSize)
  }

  if (bottomRightOrSize instanceof TermResponsiveCoord) {
    return new TermSquareByCorners(topLeft, bottomRightOrSize)
  }

  if (bottomRightOrSize instanceof TermSize) {
    return new TermSquareBySize(topLeft, bottomRightOrSize)
  }

  throw new Error('Invalid argument for bottomRightOrSize')
}

export const coord = {
  fixed: (...args: ConstructorParameters<typeof TermFixedCoord>) =>
    new TermFixedCoord(...args),

  responsive: (...args: ConstructorParameters<typeof TermResponsiveCoord>) =>
    new TermResponsiveCoord(...args)
}

export function size(height: number, width: number) {
  return new TermSize(height, width)
}
