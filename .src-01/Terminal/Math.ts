export type TCoordinate = {
  y: number,
  x: number,
}

export type TSize = {
  height: number,
  width: number,
}

export class FixedCoord implements TCoordinate {
  constructor(
    public y: number,
    public x: number) { }
}

export class DynamicCoord implements TCoordinate {
  #getY
  #getX

  constructor(
    getY: (() => number) | number,
    getX: (() => number) | number
  ) {
    this.#getY = (getY instanceof Function) ? getY : () => getY
    this.#getX = (getX instanceof Function) ? getX : () => getX
  }

  get y(): number {
    return this.#getY()
  }

  get x(): number {
    return this.#getX()
  }
}

export class ResponsiveCoord implements TCoordinate {
  #decimalPercentageV
  #decimalPercentageH

  constructor(
    decimalPercentageV: number,
    decimalPercentageH: number
  ) {
    this.#decimalPercentageV = decimalPercentageV
    this.#decimalPercentageH = decimalPercentageH
  }

  get y(): number {
    return Math.round((process.stdout.rows - 1) * this.#decimalPercentageV)
  }

  get x(): number {
    return Math.round((process.stdout.columns - 1) * this.#decimalPercentageH)
  }
}

export class SumCoord implements TCoordinate {
  #coords

  constructor(...coords: TCoordinate[]) {
    this.#coords = coords
  }

  get y(): number {
    const total = process.stdout.rows - 1
    const res = Math.floor(this.#coords.reduce((sum, coord) => sum + coord.y, 0))
    return res > total ? total : res
  }

  get x(): number {
    const total = process.stdout.columns - 1
    const res = Math.floor(this.#coords.reduce((sum, coord) => sum + coord.x, 0))
    return res > total ? total : res
  }
}

export class MultiplyCoord implements TCoordinate {
  #coords
  constructor(...coords: TCoordinate[]) {
    this.#coords = coords
  }

  get y(): number {
    const total = process.stdout.rows - 1
    const res = Math.floor(this.#coords.reduce((prod, coord) => prod * coord.y, 1))
    return res > total ? total : res
  }

  get x(): number {
    const total = process.stdout.columns - 1
    const res = Math.floor(this.#coords.reduce((prod, coord) => prod * coord.x, 1))
    return res > total ? total : res
  }
}

export class Square {
  #topRight: TCoordinate
  #bottomLeft: TCoordinate
  #sizeAsCoord: TCoordinate

  constructor(
    private _topLeft: TCoordinate,
    private _bottomRight: TCoordinate
  ) {
    this.#topRight = {
      get y() { return _topLeft.y },
      get x() { return _bottomRight.x },
    }

    this.#bottomLeft = {
      get y() { return _bottomRight.y },
      get x() { return _topLeft.x },
    }

    const self = this
    this.#sizeAsCoord = {
      get y() { return self.height },
      get x() { return self.width },
    }
  }

  get coordTopLeft() {
    return this._topLeft
  }

  get coordTopRight() {
    return this.#topRight
  }

  get coordBottomRight() {
    return this._bottomRight
  }

  get coordBottomLeft() {
    return this.#bottomLeft
  }

  get left() {
    return this._topLeft.x
  }

  get top() {
    return this._topLeft.y
  }

  get right() {
    return this._bottomRight.x
  }

  get bottom() {
    return this._bottomRight.y
  }

  get width() {
    return this.right - this.left
  }

  get height() {
    return this.bottom - this.top
  }

  get sizeAsCoord(): TCoordinate {
    return this.#sizeAsCoord
  }

  cloneTranslatedBy(coord: TCoordinate, sizeAsCoord?: TCoordinate | null): Square {
    return new Square(
      new SumCoord(this.coordTopLeft, coord),
      sizeAsCoord
        ? new SumCoord(this.coordTopLeft, sizeAsCoord, coord)
        : new SumCoord(this.coordBottomRight, coord)
    )
  }
}

export const coord = Object.freeze({
  fixed: (...args: ConstructorParameters<typeof FixedCoord>) => new FixedCoord(...args),
  responsive: (...args: ConstructorParameters<typeof ResponsiveCoord>) => new ResponsiveCoord(...args),
  dynamic: (...args: ConstructorParameters<typeof DynamicCoord>) => new DynamicCoord(...args),
  sum: (...args: ConstructorParameters<typeof SumCoord>) => new SumCoord(...args),
  multiply: (...args: ConstructorParameters<typeof MultiplyCoord>) => new MultiplyCoord(...args),
  square: (...args: ConstructorParameters<typeof Square>) => new Square(...args),
  top: (top: number) => new FixedCoord(top, 0),
  left: (left: number) => new FixedCoord(0, left),
  zero: () => new FixedCoord(0, 0),
  half: () => new ResponsiveCoord(0.5, 0.5),
  full: () => new ResponsiveCoord(1, 1),
})