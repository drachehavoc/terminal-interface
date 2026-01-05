import { byRuntime } from "../core.runtime"

const onResizeFunctions: (() => void)[] = []
const execOnResizeFunctions = () => onResizeFunctions.forEach(f => f())

byRuntime({ errorOnNotDefined: false })
  .node(() => {
    process.on('SIGWINCH', () => execOnResizeFunctions())
  })

  .deno(() => {
    process.on('SIGWINCH', () => execOnResizeFunctions())
  })

  .bun(() => {
    process.stdout.on("resize", () => execOnResizeFunctions())
  })

  .run()

export class Terminal {
  static onResize(callback: () => void) {
    onResizeFunctions.push(callback)
    return this
  }

  static onExit(callback: () => void) {
    process.on('exit', callback)
    return this
  }

  static waitInput() {
    process.stdin.setRawMode(true)      // habilita modo raw: faz com que os dados sejam enviados imediatamente
    process.stdin.setEncoding('utf8')   // define a codificação de caracteres de entrada 
    process.stdin.resume()              // inicia a leitura do fluxo de entrada
    return this
  }

  static hideCursor() {
    process.stdout.write('\x1B[?25l')
    return this
  }

  static showCursor() {
    process.stdout.write('\x1B[?25h')
    return this
  }

  static moveCursorTo(row: number, col: number) {
    process.stdout.write(`\x1B[${row};${col}H`)
    return this
  }

  static moveCursorBy(rows: number, cols: number) {
    if (rows !== 0) {
      const upDown = rows < 0 ? 'A' : 'B'
      process.stdout.write(`\x1B[${Math.abs(rows)}${upDown}`)
    }
    if (cols !== 0) {
      const leftRight = cols < 0 ? 'D' : 'C'
      process.stdout.write(`\x1B[${Math.abs(cols)}${leftRight}`)
    }
    return this
  }

  static write(...str: string[]) {
    process.stdout.write(str.join(' '))
    return this
  }

  static clear() {
    console.clear()
    return this
  }


  static get height() {
    return process.stdout.rows
  }

  static get width() {
    return process.stdout.columns
  }

}