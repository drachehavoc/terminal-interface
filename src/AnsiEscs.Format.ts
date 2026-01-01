import { raw } from "./AnsiEscs.raw"
import { AnsiMaps } from "./AnsiEscs.consts"
import { reset } from "./AnsiEscs.raw"
import type { AnsiParam, Background, Decorations, Foreground } from "./AnsiEscs.types"

/**
 * Classe com validações para os parâmetros de texto ANSI.
 */
class Validations {
  static fg(value?: Foreground) {
    if (value === undefined) return value
    if (!AnsiMaps.foreground.includes(value))
      throw new Error(`Invalid foreground color code: ${value}`)
    return value
  }

  static bg(value?: Background) {
    if (value === undefined) return value
    if (!AnsiMaps.background.includes(value))
      throw new Error(`Invalid background color code: ${value}`)
    return value
  }

  static decoration(...decs: Decorations[]) {
    for (const dec of decs) {
      if (!(dec in AnsiMaps.decoration))
        throw new Error(`Invalid text decoration: ${dec}`)
    }
    return decs
  }
}

/**
 * Classe para estilização de texto com códigos ANSI.
 */
export class Format {
  #fg
  #bg
  #dc

  constructor(args: {
    fg?: Foreground,
    bg?: Background,
    dc?: Decorations[]
  }) {
    this.#fg = Validations.fg(args.fg ?? undefined)
    this.#bg = Validations.bg(args.bg ?? undefined)
    this.#dc = Validations.decoration(...(args.dc ?? []))
  }

  static fg(value?: Foreground) {
    return new this({ fg: Validations.fg(value) })
  }

  static bg(value?: Background) {
    return new this({ bg: Validations.bg(value) })
  }

  fg(value?: Foreground) {
    this.#fg = Validations.fg(value)
    return this
  }

  bg(value?: Background) {
    this.#bg = Validations.bg(value)
    return this
  }

  dc(...decs: Decorations[]) {
    this.#dc = Validations.decoration(...decs)
    return this
  }

  #buildParams() {
    const params: AnsiParam[] = []
    if (this.#dc)
      for (const dec of this.#dc)
        params.push(AnsiMaps.decoration[dec])
    if (this.#fg !== undefined)
      params.push(this.#fg)
    if (this.#bg !== undefined)
      params.push(this.#bg)
    return params
  }

  tx(text: string) {
    return raw({ parameters: this.#buildParams() }) + text + reset
  }

  getStamper() {
    const prefix = raw({ parameters: this.#buildParams() })
    return (text: string) => prefix + text + reset
  }
}