import xterm from '@xterm/headless'
import { TermReal } from './Term.Real'

// @todo: se der resize direto no pty dá ruim

type StreamNeeds = {
  resize?: (cols: number, rows: number) => void              // xterm/headless
  onData?: (cb: (data: string) => void) => void              // xterm/headless
  on?: (event: "data", cb: (data: string) => void) => void   // Node.js Stream
  write?: (data: string) => void                             // xterm/headless & Node.js Stream
}

export class TermTop {
  #cursor = { x: 0, y: 0}  
  #position = { x: 0, y: 0 }
  #dumbTerm
  #stream: StreamNeeds
  #renderScheduled = false;

  constructor(args?: {
    position?: { x: number, y: number }
    size?: { columns: number, rows: number }
    stream?: StreamNeeds 
  }) {
    const {
      stream = process.stdout,
      position = { x: 0, y: 0 },
      size = { columns: 80, rows: 24 }
    } = args || {}
    this.#stream = stream
    this.#position = position
    this.#dumbTerm = this.#createDumbTerm()
    this.#attachEvents()
    this.resize(size.columns, size.rows) 
    this.#render()    
  }

  #createDumbTerm() {
    return new xterm.Terminal({ 
      allowProposedApi: true,
      convertEol: true,
    })
  }

  #onCursorMove() {
    const { cursorX, cursorY } = this.#dumbTerm.buffer.active
    this.#cursor.x = cursorX
    this.#cursor.y = cursorY
  }
  
  #attachEvents() {
    if (this.#stream.on)
      this.#stream.on('data', (data: string) => this.#write(data))
    else if (this.#stream.onData)
      this.#stream.onData((data: string) => this.#write(data))  
    // if (this.#stream.resize) {}
    this.#dumbTerm.onCursorMove(this.#onCursorMove.bind(this))
  }

  #scheduleRender() {
    if (this.#renderScheduled) return
    this.#renderScheduled = true
    // Limita a renderização ao próximo "tick" do Node
    setImmediate(() => {
      this.#render()
      this.#renderScheduled = false;
    })
  }

  #renderColors(cell?: xterm.IBufferCell) {
    if (!cell) return ''
    let style = ''
    // Extrai Atributos de Estilo da Célula
    const bold      = cell.isBold()      ? ';1' : ''
    const dim       = cell.isDim()       ? ';2' : ''
    const italic    = cell.isItalic()    ? ';3' : ''
    const underline = cell.isUnderline() ? ';4' : ''
    const inverse   = cell.isInverse()   ? ';7' : ''
    const blink     = cell.isBlink()     ? ';5' : ''
    style += `${bold}${dim}${italic}${underline}${inverse}${blink}`
    // Pega as cores do texto da célula
    if (cell.isFgPalette()) {
      style += `;38;5;${cell.getFgColor()}`
    } else if (cell.isFgRGB()) {
      const rgb = cell.getFgColor()
      style += `;38;2;${(rgb >> 16) & 0xFF};${(rgb >> 8) & 0xFF};${rgb & 0xFF}`
    }
    // Pega as cores de fundo da célula
    if (cell.isBgPalette()) {
      style += `;48;5;${cell.getBgColor()}`
    } else if (cell.isBgRGB()) {
      const rgb = cell.getBgColor()
      style += `;48;2;${(rgb >> 16) & 0xFF};${(rgb >> 8) & 0xFF};${rgb & 0xFF}`
    }
    // Retorna o código de escape ANSI para os estilos
    return `\x1b[0${style}m`
  }

  #renderVirtualCursor(x: number, y: number) {
    if (y === this.#cursor.y && x === this.#cursor.x)
      return `\x1b[7m` // inverter cores para o cursor
    return ''
  }

  #render() {
    const term = this.#dumbTerm
    const buffer = term.buffer.active
    const offset = this.#position
    let frame = ''
    for (let y = 0; y < term.rows; y++) {
      let line = buffer.getLine(buffer.baseY + y)
      if (!line) continue
      frame += `\x1b[${offset.y + y + 1};${offset.x + 1}H`
      for (let x = 0; x < term.cols; x++) {
        const cell = line?.getCell(x)
        frame += this.#renderColors(cell)
        frame += this.#renderVirtualCursor(x, y)
        frame += `${cell?.getChars() || ' '}`
        frame += `\x1b[0m` // resetar estilos após cada caractere
      }
      frame += '\n'
    }
    TermReal.write(frame.trim())
  }

  #clear(space = " ") {
    const { cols, rows } = this.#dumbTerm
    const offset = this.#position
    const line = space.repeat(cols)
    for (let y = 0; y < rows; y++)
      TermReal
        .moveCursorTo({ x: offset.x, y: offset.y + y })
        .write(line)
  }

  resize(columns: number, rows: number) {
    this.#clear()
    this.#dumbTerm.resize(columns, rows)
    if (this.#stream.resize)
      this.#stream.resize(columns, rows)
    this.#scheduleRender()
    return this
  }

  moveCursorTo(args: { x: number, y: number }) {
    const { x, y } = args
    const { promise, resolve, reject } = Promise.withResolvers<this>()
    this.#dumbTerm.write(`\x1b[${y + 1};${x + 1}H`, () => {
      resolve(this)
      this.#render()
    })
    return promise
  }
 
  #write(data: string) {
    const { promise, resolve, reject } = Promise.withResolvers<this>()
    this.#dumbTerm.write(data, () => {
      resolve(this)
      this.#scheduleRender()
    })
    return promise
  }

  write(data: string) {
    if (!data) 
      return
    if (this.#stream.write)
      return this.#stream.write(data)
  }
}