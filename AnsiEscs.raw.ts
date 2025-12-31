import { starters } from "./AnsiEscs.consts"
import { keepArrayEmptySpacesRemoveUndeined } from "./AnsiEscs.helpres"
import type { AnsiParams, Starters } from "./AnsiEscs.types"

export function raw (args: {
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

export const reset = raw({ command: "m" })

export const m = (...params: AnsiParams) => raw({ parameters: params, command: "m" })