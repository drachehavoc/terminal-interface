export interface FutureNumber {
  value: number
}

type PercentageOptions = {
  /**
   * Porcentagem entre 0 e 1 a ser usada no cálculo do valor real.
   */
  percent: number,
  /**
   * Número total ou função que retorna o número total a ser usado no cálculo da 
   * porcentagem, utilizado para calcular o valor real.
   * - Pode ser um número fixo ou uma função que retorna um número, útil para
   *   casos onde o total pode mudar dinamicamente (ex: tamanho do terminal).
   */
  getTotal: number | (() => number),
  offset?: number | (() => number),
}

/**
 * Recebe uma porcentagem e um total (número ou função que retorna número) e calcula o 
 * valor correspondente. Esta classe é útil para cacular posições e tamanhos relativos ao
 * tamanho do terminal ou de um contêiner.
 */
export class Percentage implements FutureNumber {
  #total
  #offset
  #percentage!: number

  constructor(options: PercentageOptions) {
    const { percent, getTotal, offset } = options
    this.percent = percent
    this.#total = (typeof getTotal === "function") 
      ? getTotal 
      : () => getTotal
    this.#offset = (typeof offset === "function")
      ? offset
      : () => offset ?? 0
  }

  set percent(p: number) {
    if (p > 1) throw new Error("Percentage must be between 0 and 1")
    this.#percentage = p
  }

  set value(v: number) {
    throw new Error("Cannot set value of Percentage")
  }

  get value() {
    return Math.ceil((this.#total() * this.#percentage) + this.#offset())
  }
}

/**
 * Representa uma coordenada no terminal, com valores para posição horizontal e vertical.
 */
export class Coordinate {
  #h; #v
  
  constructor(
    vertical: FutureNumber,
    horizontal: FutureNumber,
  ) {
    this.#h = horizontal
    this.#v  = vertical
  }

  get horizontal() {
    return this.#h.value
  }

  get vertical() {
    return this.#v.value
  }

  get hv() {
    return [this.horizontal, this.vertical] as const
  }
}

/**
 * Representa um quadrado ou retângulo no terminal, definido por duas coordenadas:
 * o canto superior esquerdo e o canto inferior direito.
 */
export class Square {
  #tl; #br

  constructor(settings: {
    tl: Coordinate,
    br: Coordinate,
  }) {
    this.#tl = settings.tl
    this.#br = settings.br
  }

  get width() {
    return this.#br.horizontal - this.#tl.horizontal
  }

  get height() {
    return this.#br.vertical - this.#tl.vertical
  }

  get top() {
    return this.#tl.vertical
  }

  get right() {
    return this.#br.horizontal
  }

  get left() {
    return this.#tl.horizontal
  }

  get bottom() {
    return this.#br.vertical
  }
}

//
//
// 🏭 Factories
//
//

export const percent = (...a: ConstructorParameters<typeof Percentage>) => 
  new Percentage(...a)

export const coordinate = (...a: ConstructorParameters<typeof Coordinate>) => 
  new Coordinate(...a)

export const square = (...a: ConstructorParameters<typeof Square>) => 
  new Square(...a)