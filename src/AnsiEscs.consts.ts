import { createArrayRange } from "./AnsiEscs.helpres"
import type { Decorations } from "./AnsiEscs.types"

export const empty = Symbol('empty')

export const AnsiMaps = {
  foreground: createArrayRange(30, 37).concat(createArrayRange(90, 97)),
  background: createArrayRange(40, 47).concat(createArrayRange(100, 107)),
  decoration: { bold: 1, dim: 2, italic: 3, underline: 4, blink: 5, inverse: 7, hidden: 8, strikethrough: 9 } as Record<Decorations, number>,
}

export const starters = {
  'ESC': '\x1B', // - sequence starting with ESC (\x1B)
  'CSI': '\x9B', // - Control Sequence Introducer: sequence starting with ESC [ or CSI (\x9B)
  'DCS': '\x90', // - Device Control String: sequence starting with ESC P or DCS (\x90)
  'OSC': '\x9D', // - Operating System Command: sequence starting with ESC ] or OSC (\x9D)
}