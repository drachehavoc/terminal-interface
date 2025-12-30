import type { DrawArea } from "./.types.js"
import raw from './raw.js'

class Box {
  #args

  constructor(drawArea: DrawArea) {
    this.#args = drawArea
    if (drawArea.offset) {
      const offset = drawArea.offset * -1
      this.#args.top += offset
      this.#args.left += offset
      this.#args.width -= offset * 2
      this.#args.height -= offset * 2
    }
  }

  draw() {
    const { top, left, width, height } = this.#args
    const right = left + width
    const bottom = top + height
    // desenha os cantos
    raw.write({ top: top, left: left, content: '┌' })
    raw.write({ top: top, left: right, content: '┐' })
    raw.write({ top: bottom, left: left, content: '└' })
    raw.write({ top: bottom, left: right, content: '┘' })
    // desenha as bordas horizontais
    const horizontalBorder = '─'.repeat(width - 1)
    raw.write({ top: top, left: left + 1, content: horizontalBorder })
    raw.write({ top: bottom, left: left + 1, content: horizontalBorder })
    // desenha as bordas verticais
    for (let i = 1; i < height; i++) {
      raw.write({ top: top + i, left: left, content: '│' })
      raw.write({ top: top + i, left: right, content: '│' })
    }
  }
}

export default Box