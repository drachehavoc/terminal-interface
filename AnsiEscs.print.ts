import { raw } from "./AnsiEscs.raw"
import type { TerminalRelativePosition } from "./TeminalRelativePosition"

export function print(positionRelative: TerminalRelativePosition, text: string) {
  return process.stdout.write(
    raw({
      sequenceType: "CSI",
      parameters: [positionRelative.top, positionRelative.left],
      command: "H",
    }) + text
  )
}