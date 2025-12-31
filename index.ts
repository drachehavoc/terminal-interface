import { print } from "./AnsiEscs.print"
import { TerminalRelativePosition } from "./TeminalRelativePosition"

export type DrawArea = { top: number, left: number, width: number, height: number, offset?: number }

const p0 = new TerminalRelativePosition(.25, .25)
const p1 = new TerminalRelativePosition(.5, .5)
const p2 = new TerminalRelativePosition(.75, .75)

// hide cursor
process.stdout.write('\u001B[?25l')

const draw = () => {
  console.clear()
  print(p0, '↘️')
  print(p1, '↔️')
  print(p2, '↖️')
}

process.stdout.on('resize', draw)
draw()