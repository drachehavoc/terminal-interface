// process.stdout.write(`\x1b7`) // Save cursor position
// process.stdout.write(`\x1b8`) // Restore cursor position


const ESC = '\x1b'
const CLEAR_SCREEN = `${ESC}[2J`
const HIDE_CURSOR = `${ESC}[?25l`
const SHOW_CURSOR = `${ESC}[?25h`
const MOVE_CURSOR = (row: number, col: number) => `${ESC}[${row};${col}H`

const raw = {
  write(args: { top: number, left: number, content: string }) {
    const { top, left, content } = args
    process.stdout.write(MOVE_CURSOR(top + 1, left + 1) + content)
  }
}

export default raw