import type { TFutureNumber, TStrictFutureNumber } from "./@types"

export function getCorrectTypeOfFutureNumber(compute: TFutureNumber): TStrictFutureNumber {
  if (typeof compute === 'number') 
    return { value: compute }
  if (typeof compute === 'function')
    return { get value() { return compute() } }
  if (typeof compute === 'object') {
    if ('value' in compute)
      return compute
    if (Object.getOwnPropertyDescriptor(compute, 'value')?.get)
      return compute
  }
  throw new TypeError('Invalid type for lazy numeric computation')
}

export function getResultOfFutureNumber(compute: TFutureNumber): number {
  if (typeof compute === 'number') 
    return compute
  if (typeof compute === 'function') 
    return compute()
  if (typeof compute === 'object') {
    if ('value' in compute)
      return compute.value
    if (Object.getOwnPropertyDescriptor(compute, 'value')?.get)
      return (compute as any).value
  }
  throw new TypeError('Invalid type for lazy numeric computation')
}

export class FutureNumber implements TStrictFutureNumber {
 #getter

  constructor(compute: TFutureNumber) {
    const lazy = getCorrectTypeOfFutureNumber(compute)
    this.#getter = () => lazy.value
  }

  get value(): number {
    return this.#getter()
  }
}

export class FuturePercent implements TStrictFutureNumber {
  #part; #whole; #rounding

  constructor(arg: {
    part: TFutureNumber,
    whole: TFutureNumber,
    rounding?: (value: number, args: { part: number, whole: number }) => number
  }) {
    this.#part = getCorrectTypeOfFutureNumber(arg.part)
    this.#whole = getCorrectTypeOfFutureNumber(arg.whole)
    this.#rounding = arg.rounding || (v => v)
  }

  get value(): number {
    const part = this.#part.value
    const whole = this.#whole.value
    const value = whole * part
    return this.#rounding(value, { part, whole })
  }
}

export class FutureSum implements TStrictFutureNumber {
  #values
  
  constructor(...values: TFutureNumber[]) {
    this.#values = values.map(v => getCorrectTypeOfFutureNumber(v))
  }

  get value(): number {
    return this.#values.reduce((sum, v) => sum + v.value, 0)
  }
}

export const future = {
  number : (...args: ConstructorParameters<typeof FutureNumber>)  => new FutureNumber(...args),
  percent: (...args: ConstructorParameters<typeof FuturePercent>) => new FuturePercent(...args),
  sum    : (...args: ConstructorParameters<typeof FutureSum>)     => new FutureSum(...args),
}