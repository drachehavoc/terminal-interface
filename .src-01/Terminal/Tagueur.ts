// # ESSE ARQUIVO DEFINE A CLASSE TAGUEUR:
// - Responsável por gerenciar exibição de texto estilizado no terminal,
//   incluindo cores e decorações (negrito, sublinhado, itálico, etc).
// - Permite criar instâncias com estilos específicos ou utilizar métodos
//   estáticos para aplicar estilos de forma encadeada.
// - Fornece métodos para imprimir texto em coordenadas específicas,
//   limpar a tela, esconder/mostrar o cursor, e reagir ao redimensionamento
//   do terminal.

import type { Square, TCoordinate } from "./Math"

type DecorationsKeys = keyof typeof Decorations
type ForegroundColorsKeys = keyof typeof ForegroundColors
type BackgroundColorsKeys = keyof typeof BackgroundColors

const Seq = {
  ESC: '\x1B', // - sequence starting with ESC (\x1B)
  CSI: '\x9B', // - Control Sequence Introducer: sequence starting with ESC [ or CSI (\x9B)
  DCS: '\x90', // - Device Control String: sequence starting with ESC P or DCS (\x90)
  OSC: '\x9D', // - Operating System Command: sequence starting with ESC ] or OSC (\x9D)
} as const

const ForegroundColors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  brightBlack: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97,
} as const

const BackgroundColors = {
  black: 40,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  white: 47,
  brightBlack: 100,
  brightRed: 101,
  brightGreen: 102,
  brightYellow: 103,
  brightBlue: 104,
  brightMagenta: 105,
  brightCyan: 106,
  brightWhite: 107,
} as const

const Decorations = {
  bold: 1,
  dim: 2,
  italic: 3,
  underline: 4,
  blink: 5,
  inverse: 7,
  hidden: 8,
  strikethrough: 9,
} as const

// metodos que não serão expostos
const print = (strings: TemplateStringsArray, ...values: any[]) => process.stdout.write(String.raw({ raw: strings }, ...values))
const reset = `${Seq.CSI}0m`
const hElipsis = '…'
const vElipsis = '⋮'
const cursorMoveTo = ({ y: v, x: h }: TCoordinate) => print`${Seq.CSI}${v + 1};${h + 1}H`

// classe exportada
export class Tagueur {
  #background
  #foreground
  #decorations

  constructor(parameters?: {
    foreground?: ForegroundColorsKeys,
    background?: BackgroundColorsKeys,
    decorations?: DecorationsKeys[],
  }) {
    this.#foreground = parameters?.foreground
    this.#background = parameters?.background
    this.#decorations = new Set(parameters?.decorations ?? [])
  }

  // --- métodos estáticos construtores ---

  static foreground(foreground: ForegroundColorsKeys) {
    return new this({ foreground })
  }

  static background(background: BackgroundColorsKeys) {
    return new this({ background })
  }

  static decorations(...decorations: DecorationsKeys[]) {
    return new this({ decorations })
  }

  static bold() {
    return new this({ decorations: ['bold'] })
  }

  static dim() {
    return new this({ decorations: ['dim'] })
  }

  static italic() {
    return new this({ decorations: ['italic'] })
  }

  static underline() {
    return new this({ decorations: ['underline'] })
  }

  static blink() {
    return new this({ decorations: ['blink'] })
  }

  static inverse() {
    return new this({ decorations: ['inverse'] })
  }

  static hidden() {
    return new this({ decorations: ['hidden'] })
  }

  static strikethrough() {
    return new this({ decorations: ['strikethrough'] })
  }

  static print(coordinate: TCoordinate, text: string) {
    cursorMoveTo(coordinate)
    print`${text}`
    return new this({})
  }

  static drawHorizontalLine(...args: Parameters<Tagueur['drawHorizontalLine']>) {
    return new Tagueur().drawHorizontalLine(...args)
  }

  static drawVerticalLine(...args: Parameters<Tagueur['drawVerticalLine']>) {
    return new Tagueur().drawVerticalLine(...args)
  }

  static drawSquare(...args: Parameters<Tagueur['drawSquare']>) {
    return new Tagueur().drawSquare(...args)
  }

  // --- métodos de instância ---

  foreground(foreground: ForegroundColorsKeys) {
    this.#foreground = foreground
    return this
  }

  background(background: BackgroundColorsKeys) {
    this.#background = background
    return this
  }

  decorations(...decorations: DecorationsKeys[]) {
    decorations.forEach(decoration => this.#decorations.add(decoration))
    return this
  }

  removeDecorations(...decorations: DecorationsKeys[]) {
    decorations.forEach(decoration => this.#decorations.delete(decoration))
    return this
  }

  bold(add?: boolean) {
    if (add === false)
      this.#decorations.delete('bold')
    else
      this.#decorations.add('bold')
    return this
  }

  dim(add?: boolean) {
    if (add === false)
      this.#decorations.delete('dim')
    else
      this.#decorations.add('dim')
    return this
  }

  italic(add?: boolean) {
    if (add === false)
      this.#decorations.delete('italic')
    else
      this.#decorations.add('italic')
    return this
  }

  underline(add?: boolean) {
    if (add === false)
      this.#decorations.delete('underline')
    else
      this.#decorations.add('underline')
    return this
  }

  blink(add?: boolean) {
    if (add === false)
      this.#decorations.delete('blink')
    else
      this.#decorations.add('blink')
    return this
  }

  inverse(add?: boolean) {
    if (add === false)
      this.#decorations.delete('inverse')
    else
      this.#decorations.add('inverse')
    return this
  }

  hidden(add?: boolean) {
    if (add === false)
      this.#decorations.delete('hidden')
    else
      this.#decorations.add('hidden')
    return this
  }

  strikethrough(add?: boolean) {
    if (add === false)
      this.#decorations.delete('strikethrough')
    else
      this.#decorations.add('strikethrough')
    return this
  }

  print({ y: v, x: h }: TCoordinate, text: string) {
    if (h > process.stdout.columns)
      return this
    if (v > process.stdout.rows)
      return this
    if (text.length + h > process.stdout.columns)
      text = text.slice(0, process.stdout.columns - h)
    const codes = [
      this.#foreground ? ForegroundColors[this.#foreground] : undefined,
      this.#background ? BackgroundColors[this.#background] : undefined,
      ...Array.from(this.#decorations).map(decoration => Decorations[decoration]),
    ].filter(code => code !== undefined).join(";")
    cursorMoveTo({ y: v, x: h })
    print`${reset}${Seq.CSI}${codes}m${text}${reset}`
    return this
  }

  getStamper() {
    return ({ y: v, x: h }: TCoordinate, text: string) => {
      this.print({ y: v, x: h }, text)
      return this
    }
  }

  getAnchor(args: TCoordinate & { width: number }) {
    return (text: string) => {
      let _text = text.length > args.width
        ? text.slice(0, args.width - 1) + hElipsis
        : text
      this.print(args, _text.padEnd(args.width, ' '))
      return this
    }
  }

  // --- métodos da instância: métodos de desenho ---

  drawHorizontalLine(args: TCoordinate & { length: number }) {
    let { x: left, y: top, length } = args
    let right = left + length
    length += 1
    if (right > process.stdout.columns - 1)
      length = process.stdout.columns - left
    this.print({ x: left, y: top }, `─`.repeat(length))
    return this
  }

  drawVerticalLine(args: TCoordinate & { length: number }) {
    let { x: left, y: top, length } = args
    const bottom = top + length
    if (bottom > process.stdout.rows - 1)
      length = process.stdout.rows - top - 1
    for (let i = 0; i <= length; i++)
      this.print({ x: left, y: top + i }, '│')
    return this
  }

  drawSquare(square: Square): Tagueur {
    const { left, top, right, bottom, width, height } = square
    this
      .print({ y: top, x: left }, '┌')
      .print({ y: top, x: right }, '┐')
      .print({ y: bottom, x: left }, '└')
      .print({ y: bottom, x: right }, '┘')
    this
      .drawHorizontalLine({ x: left + 1, y: top, length: width - 2 })
      .drawHorizontalLine({ x: left + 1, y: bottom, length: width - 2 })
    this
      .drawVerticalLine({ x: left, y: top + 1, length: height - 2 })
      .drawVerticalLine({ x: right, y: top + 1, length: height - 2 })
    return this
  }

  // --- métodos estáticos utilitários ---

  static clear() {
    // print`${Seq.CSI}2J${Seq.CSI}0;0H`
    console.clear()
  }

  static hideCursor() {
    print`${Seq.CSI}?25l`
  }

  static showCursor() {
    print`${Seq.CSI}?25h`
  }

  static onRefresh(callback: () => void) {
    const wrappedCallback = () => {
      Tagueur.clear()
      callback()
    }
    wrappedCallback()
    process.stdout.on('resize', wrappedCallback)
  }
}