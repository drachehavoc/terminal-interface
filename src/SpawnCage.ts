// ░░░░░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░░░░░
// ░░░░░░░░░░░░▄████████████████▄░░░░░░░░░░
// ░░░░░░░░░░▄██▀░░░░░░░▀▀████████▄░░░░░░░░
// ░░░░░░░░░▄█▀░░░░░░░░░░░░░▀▀██████▄░░░░░░
// ░░░░░░░░░███▄░░░░░░░░░░░░░░░▀██████░░░░░
// ░░░░░░░░▄░░▀▀█░░░░░░░░░░░░░░░░██████░░░░
// ░░░░░░░█▄██▀▄░░░░░▄███▄▄░░░░░░███████░░░
// ░░░░░░▄▀▀▀██▀░░░░░▄▄▄░░▀█░░░░█████████░░
// ░░░░░▄▀░░░░▄▀░▄░░█▄██▀▄░░░░░██████████░░
// ░░░░░█░░░░▀░░░█░░░▀▀▀▀▀░░░░░██████████▄░
// ░░░░░░░▄█▄░░░░░▄░░░░░░░░░░░░██████████▀░
// ░░░░░░█▀░░░░▀▀░░░░░░░░░░░░░███▀███████░░
// ░░░▄▄░▀░▄░░░░░░░░░░░░░░░░░░▀░░░██████░░░
// ██████░░█▄█▀░▄░░██░░░░░░░░░░░█▄█████▀░░░
// ██████░░░▀████▀░▀░░░░░░░░░░░▄▀█████████▄
// ██████░░░░░░░░░░░░░░░░░░░░▀▄████████████
// ██████░░▄░░░░░░░░░░░░░▄░░░██████████████
// ██████░░░░░░░░░░░░░▄█▀░░▄███████████████
// ███████▄▄░░░░░░░░░▀░░░▄▀▄███████████████

// --- EXTERNAL IMPORTS ---
import xheadless from '@xterm/headless'

// --- MY IMPORTS ---
import type { TTermSquare } from './TerminalMath';
import { __runtimename } from './helper.runtime'

// --- CONDITIONAL IMPORT OF node-pty BASED ON RUNTIME ---
const pty = await ({
  bun: async () => {
    const { spawn } = await import('bun-pty')
    return { spawn }
  },
  
  deno: async () => {
    return await import('@lydell/node-pty')
    return await import('node-pty')
  },
  
  node: async () => {
    return await import('node-pty')
  },
  
  unknown: async () => {
    throw new Error('Unsupported runtime')
  }
})[__runtimename]();

// --- TYPE ALIASES ---
type PtyProc = ReturnType<typeof pty.spawn>
type XTerm = xheadless.Terminal

// --- CLASS DEFINITION ---
export class SpawnCage {
  #name
  #square
  #command: string
  #args
  #proc
  #term

  constructor(parameters: {
    square: TTermSquare,
    command: string,
    args?: string[],
    name?: string,
  }) {
    this.#name = parameters.name || 'xterm-256color'
    this.#square = parameters.square
    this.#command = parameters.command
    this.#args = parameters.args || []
    this.#proc = this.#initProcess()
    this.#term = this.#initTerminal()
    this.#setEventHandlers(this.#proc, this.#term)
  }

  #initProcess() {
    const proc = pty.spawn(this.#command, this.#args ?? [], {
      name: this.#name,
      cols: this.#square.width,
      rows: this.#square.height,
      cwd: process.cwd(),
      env: {
        ...process.env,
        TERM: 'xterm-256color'
      }
    });
    return proc
  }

  #initTerminal(): XTerm {
    const term = new xheadless.Terminal({
      allowProposedApi: true,
      cols: this.#square.width,
      rows: this.#square.height,
    });
    return term
  }

  #setEventHandlers(proc: PtyProc, term: XTerm) {


    // Input do teclado -> App externo
    process.stdin.on('data', (data) => proc.write(data));

    // Output do App externo -> Buffer virtual -> Render
    proc.onData((data) => {
      term.write(data, this.render.bind(this));
    });

    // Limpeza ao sair
    proc.onExit(() => {
      process.stdout.write('\x1b[2J\x1b[H');
      process.exit();
    });
  }

  resize() {
    const { width, height } = this.#square
    this.#proc.resize(width, height)
    this.#term.resize(width, height)
  }

  render() {
    const { left, top, width, height } = this.#square
    const clearLine = ' '.repeat(width);
    const buffer = this.#term.buffer.active
    let output = ''

    // Renderiza cada linha do buffer do xterm-headless
    let currentStyle = ''
    for (let y = 0; y < height; y++) {
      const line = buffer.getLine(y)
      output += `\x1b[${top + y};${left}H`; // Pula para a posição X, Y

      if (!line) {
        output += clearLine
        continue
      }

      let style = ''

      for (let x = 0; x < width; x++) {
        const cell = line.getCell(x);
        if (!cell) {
          output += ' '
          continue;
        }

        // Extrai Atributos de Estilo da Célula
        const bold = cell.isBold() ? ';1' : ''
        const dim = cell.isDim() ? ';2' : ''
        const italic = cell.isItalic() ? ';3' : ''
        const underline = cell.isUnderline() ? ';4' : ''
        const inverse = cell.isInverse() ? ';7' : ''
        const blink = cell.isBlink() ? ';5' : ''
        style += `\x1b[0${bold}${dim}${italic}${underline}${inverse}${blink}`

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

        // Finaliza o código de estilo
        style += 'm'

        // Otimização: Só escreve o código ANSI se o estilo mudar
        if (style !== currentStyle) {
          output += style
          currentStyle = style
        }

        // Adiciona o caractere da célula no output
        output += cell.getChars() || ' '
      }

      // Reseta estilo ao fim da linha
      output += '\x1b[0m'
    }

    // Sincroniza posição do cursor real com o cursor do Nano
    output += `\x1b[${buffer.cursorY + top};${buffer.cursorX + left}H`

    // Renderiza tudo de uma vez
    process.stdout.write(output)
  }
}
