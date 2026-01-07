import type { TFutureNumber, TLazyNumber } from "./@types"

export function resolveLazyNumber(compute: TFutureNumber): TLazyNumber {
  if (typeof compute === 'number') 
    return { value: compute }
  if (typeof compute === 'function') 
    return { get value() { return compute() } }
  if (typeof compute === 'object' && 'value' in compute)
    return compute
  if (compute === 'object' 
    && Object.getOwnPropertyDescriptor(compute, 'value')?.get)
    return compute
  throw new TypeError('Invalid type for lazy numeric computation')
}

export function resolveValueLazyNumber(compute: TFutureNumber): number {
  if (typeof compute === 'number') 
    return compute
  if (typeof compute === 'function') 
    return compute()
  if (typeof compute === 'object' && 'value' in compute)
    return compute.value
  if (compute === 'object' 
    && Object.getOwnPropertyDescriptor(compute, 'value')?.get)
    return (compute as any).value
  throw new TypeError('Invalid type for lazy numeric computation')
}

export class FutureNumber implements TLazyNumber {
 #getter

  constructor(compute: TFutureNumber) {
    const lazy = resolveLazyNumber(compute)
    this.#getter = () => lazy.value
  }

  get value(): number {
    return this.#getter()
  }
}

export class FuturePercent implements TLazyNumber {
  #part; #total

  constructor(arg: {
    part: TFutureNumber,
    total: TFutureNumber
  }) {
    this.#part = resolveLazyNumber(arg.part)
    this.#total = resolveLazyNumber(arg.total)
  }

  get value(): number {
    const part = this.#part.value
    const total = this.#total.value
    return total * part
  }
}

export class FutureSum implements TLazyNumber {
  #values
  constructor(...values: TFutureNumber[]) {
    this.#values = values.map(v => resolveLazyNumber(v))
  }

  get value(): number {
    return this.#values.reduce((sum, v) => sum + v.value, 0)
  }
}

export const future = {
  number: (...args: ConstructorParameters<typeof FutureNumber>) => new FutureNumber(...args),
  percent: (...args: ConstructorParameters<typeof FuturePercent>) => new FuturePercent(...args),
  sum: (...args: ConstructorParameters<typeof FutureSum>) => new FutureSum(...args),
}