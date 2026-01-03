// --- INTERFACES & TYPES ---

export interface TTermSquare {
  top: number
  left: number
  bottom: number
  right: number
  height: number
  width: number
  topLeft: TCoordinate
  topRight: TCoordinate
  bottomRight: TCoordinate
  bottomLeft: TCoordinate
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

export class TermSumCoord implements TCoordinate {
  #coords
  constructor(
    ...coords: TCoordinate[]  
  ) { 
    this.#coords = coords
  }

  get row(): number {
    return this.#coords.reduce((sum, coord) => sum + coord.row, 0)
  }

  get col(): number {
    return this.#coords.reduce((sum, coord) => sum + coord.col, 0)
  }
}

export class TermSize implements TSize {
  constructor(
    public height: number,
    public width: number
  ) { }
}

export class TermSquareBySize implements TTermSquare {
  #topLeft
  #topRight
  #bottomLeft
  #bottomRight
  
  constructor(
    topLeft: TermFixedCoord,
    public size: TermSize
  ) { 
    this.#topLeft = topLeft
    this.#topRight = {
      get row() { return topLeft.row },
      get col() { return topLeft.col + size.width - 1 },
    }
    this.#bottomLeft = {
      get row() { return topLeft.row + size.height - 1 },
      get col() { return topLeft.col },
    }
    this.#bottomRight = {
      get row() { return topLeft.row + size.height - 1 },
      get col() { return topLeft.col + size.width - 1 },
    }
  }

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

  get topLeft() {
    return this.#topLeft
  }

  get topRight() {
    return this.#topRight
  }

  get bottomRight() {
    return this.#bottomRight
  }

  get bottomLeft() {
    return this.#bottomLeft
  }
}

export class TermSquareByCorners implements TTermSquare {
  #topLeft
  #topRight
  #bottomLeft
  #bottomRight

  constructor(
    topLeft: TermFixedCoord,
    bottomRight: TermFixedCoord
  ) {
    this.#topLeft = topLeft
    this.#topRight = {
      get row() { return topLeft.row },
      get col() { return bottomRight.col },
    }
    this.#bottomLeft = {
      get row() { return bottomRight.row },
      get col() { return topLeft.col },
    }
    this.#bottomRight = bottomRight
  }

  get top() {
    return this.#topLeft.row
  }

  get left() {
    return this.#topLeft.col
  }

  get bottom() {
    return this.#bottomRight.row
  }

  get right() {
    return this.#bottomRight.col
  }

  get height() {
    return this.#bottomRight.row - this.#topLeft.row + 1
  }

  get width() {
    return this.#bottomRight.col - this.#topLeft.col + 1
  }

  get topLeft() {
    return this.#topLeft
  }

  get topRight() {
    return this.#topRight
  }

  get bottomRight() {
    return this.#bottomRight
  }

  get bottomLeft() {
    return this.#bottomLeft
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
    new TermResponsiveCoord(...args),

  sum: (...args: ConstructorParameters<typeof TermSumCoord>) =>
    new TermSumCoord(...args),
}

export function size(height: number, width: number) {
  return new TermSize(height, width)
}
