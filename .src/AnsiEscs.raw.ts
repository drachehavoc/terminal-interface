import { starters } from "./AnsiEscs.consts"
import { keepArrayEmptySpacesRemoveUndeined } from "./AnsiEscs.helpres"
import type { AnsiParams, Starters } from "./AnsiEscs.types"

export function seq (args: {
  sequenceType?: Starters,
  parameters?: AnsiParams,
  parametersJoiner?: ";" | ":" | "/",
  command?: "m" | "K" | "J" | "H" | "f" | "A" | "B" | "C" | "D" | "s" | "u",
}) {
  const {
    sequenceType = 'CSI',
    parameters = [],
    parametersJoiner = ";",
    command = "m",
  } = args
  return ''
    + starters[sequenceType]
    + keepArrayEmptySpacesRemoveUndeined(...parameters).join(parametersJoiner)
    + command
}

export function print(position: TerminalPosition, text: string) {
  return process.stdout.write(
    seq({
      sequenceType: "CSI",
      parameters: [position.top, position.left],
      command: "H",
    }) + text
  )
}

export const reset = seq({ command: "m" })

export const m = (...params: AnsiParams) => seq({ parameters: params, command: "m" })