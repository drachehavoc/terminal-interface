import { seq } from "./AnsiEscs.raw"
import { AnsiMaps, Bg, Fg } from "./AnsiEscs.consts"
import { reset } from "./AnsiEscs.raw"
import type { AnsiParam, Background, ColorNames, Decorations, Foreground } from "./AnsiEscs.types"

/**
 * Classe com validações para os parâmetros de texto ANSI.
 */
class Validations {
  static fg(value?: Foreground | ColorNames) {
    if (value === undefined) return value
    if (Fg.hasOwnProperty(value)) {
      return Fg[value as ColorNames]
    }
    if (!AnsiMaps.foreground.includes(value as Foreground))
      throw new Error(`Invalid foreground color code: ${value}`)
    return value
  }

  static bg(value?: Background | ColorNames) {
    if (value === undefined) return value
    if (Bg.hasOwnProperty(value)) {
      return Bg[value as ColorNames]
    }
    if (!AnsiMaps.background.includes(value as Background))
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
    fg?: Foreground | ColorNames,
    bg?: Background | ColorNames,
    dc?: Decorations[]
  }) {
    this.#fg = Validations.fg(args.fg ?? undefined)
    this.#bg = Validations.bg(args.bg ?? undefined)
    this.#dc = Validations.decoration(...(args.dc ?? []))
  }

  static fg(value?: Foreground | ColorNames) {
    return new this({ fg: Validations.fg(value) })
  }

  static bg(value?: Background | ColorNames) {
    return new this({ bg: Validations.bg(value) })
  }

  fg(value?: Foreground | ColorNames) {
    this.#fg = Validations.fg(value)
    return this
  }

  bg(value?: Background | ColorNames) {
    this.#bg = Validations.bg(value)
    return this
  }

  dc(...decs: Decorations[]) {
    this.#dc = Validations.decoration(...decs)
    return this
  }

  tx(text: string) {
    const params: AnsiParam[] = []
    if (this.#dc)
      for (const dec of this.#dc)
        params.push(AnsiMaps.decoration[dec])
    if (this.#fg !== undefined)
      params.push(this.#fg)
    if (this.#bg !== undefined)
      params.push(this.#bg)
    return seq({ parameters: params }) + text + reset
  }
}