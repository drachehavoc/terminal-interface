import readline from "node:readline"
import { byRuntime } from "../core.runtime"
import type { TFutureNumber } from "./@types"
import { get } from "node:http"
import { getResultOfFutureNumber } from "./FutureMath"
import type { TermString } from "./Term.String"

// Maintains lists of callbacks
const ResizeCallbacks: (() => void)[] = []
const CleanupCallbacks: (() => void)[] = [] = []

// Enable keypress events on stdin
readline.emitKeypressEvents(process.stdin)

// Handle terminal resize events
byRuntime()
  .node(() => process.on('SIGWINCH', () => ResizeCallbacks.forEach(cb => cb())))
  .deno(() => process.on('SIGWINCH', () => ResizeCallbacks.forEach(cb => cb())))
  .bun(() => process.stdout.on('resize', () => ResizeCallbacks.forEach(cb => cb())))
  .run()

// Ensure cleanup on exit
// process.on('exit', () => TermReal.cleanup())
// process.on('SIGINT', () => TermReal.cleanup())
// process.on('SIGTERM', () => TermReal.cleanup())

export class TermReal {
  static cleanup() {
    CleanupCallbacks.forEach(cb => cb())
    return this
  }

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
    CleanupCallbacks.includes(this.stopInputMode) 
      || CleanupCallbacks.push(this.stopInputMode.bind(this))
    process.stdin.setRawMode(true)
    process.stdin.setEncoding('utf-8')
    process.stdin.resume()
    return this
  }

  static stopInputMode() {
    CleanupCallbacks.includes(this.stopInputMode) 
      && CleanupCallbacks.splice(CleanupCallbacks.indexOf(this.stopInputMode), 1)
    process.stdin.setRawMode(false)
    process.stdin.pause()
    return this
  }

  static onInput(callback: (data: string, key: readline.Key) => void) {
    process.stdin.on('keypress', callback)
    return this
  }

  static enterAlternateBuffer() {
    CleanupCallbacks.includes(this.exitAlternateBuffer) 
      || CleanupCallbacks.push(this.exitAlternateBuffer.bind(this))
    process.stdout.write('\x1b[?1049h')
    return this
  }

  static exitAlternateBuffer() {
    CleanupCallbacks.includes(this.exitAlternateBuffer) 
      && CleanupCallbacks.splice(CleanupCallbacks.indexOf(this.exitAlternateBuffer), 1)
    process.stdout.write('\x1b[?1049l')
    return this
  }

  static hideCursor() {
    CleanupCallbacks.includes(this.showCursor) 
      || CleanupCallbacks.push(this.showCursor.bind(this))
    process.stdout.write('\x1b[?25l')
    return this
  }

  static showCursor() {
    CleanupCallbacks.includes(this.showCursor) 
      && CleanupCallbacks.splice(CleanupCallbacks.indexOf(this.showCursor), 1)
    process.stdout.write('\x1b[?25h')
    return this
  }

  static disableLineWrap() {
    CleanupCallbacks.includes(this.enableLineWrap) 
      || CleanupCallbacks.push(this.enableLineWrap.bind(this))
    process.stdout.write('\x1b[?7l')
    return this
  }

  static enableLineWrap() {
    CleanupCallbacks.includes(this.enableLineWrap) 
      && CleanupCallbacks.splice(CleanupCallbacks.indexOf(this.enableLineWrap), 1)
    process.stdout.write('\x1b[?7h')
    return this
  }

  static clear() {
    console.clear()
    return this
  }

  static write(data: { toString: () => string }) {
    process.stdout.write(data.toString())
    return this
  }

  // getters

  static get width() {
    return process.stdout.columns || 80
  }

  static get height() {
    return process.stdout.rows || 24
  }
}