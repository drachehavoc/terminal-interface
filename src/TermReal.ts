import readline from "node:readline"
import { byRuntime } from "../core.runtime"

const ResizeCallbacks: (() => void)[] = []

readline.emitKeypressEvents(process.stdin)

byRuntime()
    .node(() => process.on('SIGWINCH', () => ResizeCallbacks.forEach(cb => cb())))
    .deno(() => process.on('SIGWINCH', () => ResizeCallbacks.forEach(cb => cb())))
    .bun(() => process.stdout.on('resize', () => ResizeCallbacks.forEach(cb => cb())))
    .run()

// @todo: lembre-se dos cleanups necessários
export class TermReal {
  static onResize(config: { immediate: boolean }, callback: () => void): typeof TermReal
  static onResize(callback: () => void): typeof TermReal
  static onResize(...args: any[]): typeof TermReal {
    let callback = args[0]
    let config = { immediate: false }
    if (args.length === 2) {
      config = args[0]
      callback = args[1]
    }
    if (config.immediate) callback()
    ResizeCallbacks.push(callback)
    return this
  }

  static startInputMode() {
    process.stdin.setRawMode(true)
    process.stdin.setEncoding('utf-8')
    process.stdin.resume()
    return this
  }

  static stopInputMode() {
    process.stdin.setRawMode(false)
    process.stdin.pause()
    return this
  }

  static onInput(callback: (data: string, key: readline.Key) => void) {
    process.stdin.on('keypress', callback)
    return this
  }

  static enterAlternateBuffer() {
    process.stdout.write('\x1b[?1049h')
    return this
  }

  static exitAlternateBuffer() {
    process.stdout.write('\x1b[?1049l')
    return this
  }

  static hideCursor() {
    process.stdout.write('\x1b[?25l')
    return this
  }

  static showCursor() {
    process.stdout.write('\x1b[?25h')
    return this
  }

  static clear() {
    console.clear()
    return this
  }
    
  static moveCursorTo(args: {x: number, y: number}) {
    const { x, y } = args
    process.stdout.write(`\x1b[${y + 1};${x + 1}H`)
    return this
  }

  static write(data: string) {
    process.stdout.write(data)
    return this
  }
}