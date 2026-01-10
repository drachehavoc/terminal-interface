import xterm from '@xterm/headless'
import { TermReal } from './Term.Real';

class HeadlessRender {
  private headless: xterm.Terminal = new xterm.Terminal({ allowProposedApi: true })
  private offset = { x: 0, y: 0 }
  private frame = ''

  constructor() {
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
    const { cursorX, cursorY } = this.headless.buffer.active
    if (y === cursorY && x === cursorX)
      return `\x1b[7m` // inverter cores para o cursor
    return ''
  }

  #render() {
    const term = this.headless
    const buffer = term.buffer.active
    const offset = this.offset
    this.frame = ''
    for (let y = 0; y < term.rows; y++) {
      let line = buffer.getLine(buffer.baseY + y)
      if (!line) continue
      this.frame += `\x1b[${offset.y + y + 1};${offset.x + 1}H`
      for (let x = 0; x < term.cols; x++) {
        const cell = line?.getCell(x)
        this.frame += this.#renderColors(cell)
        this.frame += this.#renderVirtualCursor(x, y)
        this.frame += `${cell?.getChars() || ' '}`
        this.frame += `\x1b[0m` // resetar estilos após cada caractere
      }
      this.frame += '\n'
    }
  }

  getFrame(): string {
    return this.frame.trim()
  }

  getCharAt(x: number, y: number): string {
    const line = this.headless.buffer.active.getLine(y)
    const cell = line?.getCell(x)
    return cell?.getChars() || ' '
  }

  resize(cols: number, rows: number) {
    this.headless.resize(cols, rows)
  }

  write(content: string) {
    const { promise, resolve, reject } = Promise.withResolvers<string>()
    this.headless.write(content, () => {
      this.#render()
      resolve(this.frame)
    })
    return promise
  }
}


const headlessRenderer = new HeadlessRender()

headlessRenderer.write('texzvcxzcvcxzvs\x1b[31;41msadfsadfsadfte\x1b[0m')

TermReal.onResize({immediate: true}, async () => {
  TermReal.clear()
  headlessRenderer.resize(TermReal.width, TermReal.height)
  TermReal
    .write(headlessRenderer.getFrame())
})
