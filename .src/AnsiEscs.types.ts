import type { empty, starters } from "./AnsiEscs.consts"

// --- Tipos que dependem de outros arquivos ---

export type Empty =
  | typeof empty

export type Starters =
  | keyof typeof starters

// --- Tipos que não dependem de outros arquivos ---

export type AnsiParam =
  | string
  | number
  | undefined
  | Empty

export type AnsiParams = 
  AnsiParam[]

export type Foreground = 
  | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 
  | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97

export type ColorNames =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'brightBlack'
  | 'brightRed'
  | 'brightGreen'
  | 'brightYellow'
  | 'brightBlue'
  | 'brightMagenta'
  | 'brightCyan'
  | 'brightWhite'

export type Background =
  | 40  | 41  | 42  | 43  | 44  | 45  | 46  | 47
  | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107



export type Decorations =
  | 'bold' 
  | 'dim'
  | 'italic'
  | 'underline'
  | 'blink'
  | 'inverse'
  | 'hidden'
  | 'strikethrough'

