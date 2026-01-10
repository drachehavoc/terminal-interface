enum State {
  GROUND,  // Parsing Texto normal
  ESCAPE,  // Parsing Recebeu \x1b, esperando o próximo char
  CSI,  // Parsing Comandos de controle de sequência
  OSC,  // Parsing Comandos de sistema operacional
  DCS,  // Parsing Comandos de controle de dispositivo
}

class HiperParser {
  #grid = [] as string[]
  #gridEscapes = [] as string[]
  #cursor = { x: 0, y: 0 }
  #state: State = State.GROUND
  #escapeBuffer = ''

  constructor() { }

  escaping(char: string) {
    if (char === '[') {
      this.#state = State.CSI
      return
    }

    if (char === ']') {
      this.#state = State.OSC
      return
    }

    if (char === 'P') {
      this.#state = State.DCS
      return
    }

    // If not recognized, return to GROUND state
    this.#state = State.GROUND
  }

  #aquiringCSI(char: string) {
    this.#escapeBuffer += char
    // [a-zA-Z], @, [, \, ], ^, _, `, {, |, }, ~
    if ((char >= '@' && char <= '~')) {
      this.processCSICommand(this.#escapeBuffer)
      this.#escapeBuffer = ''
      this.#state = State.GROUND
    }
  }

  #aquiringOSC(char: string) {
    this.#escapeBuffer += char
    if (char === '\x1b') {
      this.#state = State.GROUND
      this.processOSCCommand(this.#escapeBuffer)
      this.#escapeBuffer = ''
    }
  }

  #aquiringDCS(char: string) {
    this.#escapeBuffer += char
    if (char === '\x1b') {
      this.#state = State.GROUND
      this.processDCSCommand(this.#escapeBuffer)
      this.#escapeBuffer = ''
    }
  }

  #aquiringChar(char: string) {
    this.#grid[this.#cursorIndex] = char
    this.#cursor.x += 1
  }

  processCSICommand(command: string) {
    console.log(command)
  }

  processOSCCommand(command: string) {

  }

  processDCSCommand(command: string) {

  }

  write(input: string) {
    const inputData = input.split('')

    for (const char of inputData) {
      // C0 control characters handling
      if (char === '\a') continue    // Handle bell character
      if (char === '\b') continue    // Handle backspace
      if (char === '\t') continue    // Handle tab
      if (char === '\n') continue    // Handle new line
      if (char === '\v') continue    // Handle vertical tab
      if (char === '\f') continue    // Handle form feed (new page)
      if (char === '\r') continue    // Handle carriage return
      if (char === '\x7f') continue  // Handle delete

      if (this.#state === State.GROUND && char === '\x1b') {
        this.#state = State.ESCAPE
        continue
      }

      if (this.#state === State.ESCAPE) {
        this.escaping(char)
        continue
      }

      if (this.#state === State.CSI) {
        this.#aquiringCSI(char)
        continue
      }

      if (this.#state === State.OSC) {
        this.#aquiringOSC(char)
        continue
      }

      if (this.#state === State.DCS) {
        this.#aquiringDCS(char)
        continue
      }

      if (this.#state === State.GROUND) {
        this.#aquiringChar(char)
        continue
      }

      throw new Error('Unknown state encountered in parser')
    }
  }
}


process.stdout.write('\x1b[0;0H')
// clear screen and stile
const x = new HiperParser()

x.write('\x1b[31;41mhello\n world aaaaaaaaaaaa')