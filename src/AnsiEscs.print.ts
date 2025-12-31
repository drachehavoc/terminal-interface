
import type { TerminalPosition } from "./TerminalInterface"
import { raw } from "./AnsiEscs.raw"

export function print(position: TerminalPosition, text: string) {
  return process.stdout.write(
    raw({
      sequenceType: "CSI",
      parameters: [position.top, position.left],
      command: "H",
    }) + text
  )
}