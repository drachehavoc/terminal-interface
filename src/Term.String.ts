export class TermString {
  #buffer: string = ''

  moveCursorTo(pos: { x: number, y: number }) {
    this.#buffer += `\x1b[${pos.y};${pos.x}H`
    return this
  }

  moveCursorBy(offset: { x?: number, y?: number }) {
    const { x = 0, y = 0 } = offset
    if (y > 0) this.#moveCursorDownBy(y)
    if (y < 0) this.#moveCursorUpBy(-y)
    if (x > 0) this.#moveCursorRightBy(x)
    if (x < 0) this.#moveCursorLeftBy(-x)
    return this
  }

  #moveCursorUpBy(lines: number = 1) {
    this.#buffer += `\x1b[${lines}A`
    return this
  }

  #moveCursorDownBy(lines: number = 1) {
    this.#buffer += `\x1b[${lines}B`
    return this
  }

  #moveCursorRightBy(columns: number = 1) {
    this.#buffer += `\x1b[${columns}C`
    return this
  }

  #moveCursorLeftBy(columns: number = 1) {
    this.#buffer += `\x1b[${columns}D`
    return this
  }

  saveCursor() {
    this.#buffer += `\x1b7` // Salva posição (DEC)
    return this
  }

  restoreCursor() {
    this.#buffer += `\x1b8` // Restaura posição (DEC)
    return this
  }

  moveCursorFromLineStart(columns: number) {
    this.#buffer += `\x1b[${columns}G`
    return this
  }

  lineDown(args: { times: number, char?: string, endChar?: string }) {
    const { times, char = '│' } = args
    const endChar = args.endChar ?? char
    for (let i = 0; i < times - endChar.length; i++) 
      this
        .saveCursor()
        .write(char)
        .restoreCursor()
        .#moveCursorDownBy(1)
    this
      .saveCursor()
      .write("asd")
      .restoreCursor()
      .#moveCursorDownBy(1)
    return this
  }

  lineRight(args: { times: number, char?: string }) {
    const { times, char = '─' } = args
    for (let i = 0; i < times; i++) this
      .saveCursor()
      .write(char)
      .restoreCursor()
      .#moveCursorRightBy(1) 
    return this
  }

  clear() {
    this.#buffer = `\x1b[2J\x1b[0;0H`
  }

  write(text: string) {
    this.#buffer += text
    return this
  }

  #removeAnsiCodes(text: string) {
    return text.replace(
      // eslint-disable-next-line no-control-regex
      /\x1b\[[0-9;]*m/g,
      '',
    )
  }

  writeLeft(text: string) {
    this.#moveCursorLeftBy(this.#removeAnsiCodes(text).length -1)
    return this.write(text)
  }

  toString() {
    return this.#buffer
  }
}