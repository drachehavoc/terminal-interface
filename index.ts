
import type { DrawArea } from "./.types.js"
import raw from './raw.js'
import Box from './Box.js'

function keepWithinRange(value: number, min: number, max: number) {
  if (value < min) return min
  if (value > max) return max
  return value
}

class DataView {
  #data
  #drawArea
  #scroll = { top: 0, left: 0 }

  constructor(args: {
    drawArea: DrawArea,
    initialData?: ArrayLike<string>
  }) {
    this.#data = Array.from(args.initialData ?? [])
    this.#drawArea = args.drawArea
    this.#drawArea.width += 1 // ajuste para borda direita (não sei o porquê ainda)
    if (this.#drawArea.offset) {
      const offset = this.#drawArea.offset * -1
      this.#drawArea.top += offset
      this.#drawArea.left += offset
      this.#drawArea.width -= offset * 2
      this.#drawArea.height -= offset * 2
    }
  }

  // número máximo de linhas no conteúdo
  get maxLineWidth() {
    return this.#data.reduce((max, line) => Math.max(max, line.length), 0)
  }

  //
  get maxLines() {
    return this.#data.length
  }

  // largura máxima que pode ser rolada para a esquerda
  get maxScrollLeft() {
    return Math.max(0, this.maxLineWidth - this.#drawArea.width)
  }

  //
  get maxScrollTop() {
    return Math.max(0, this.maxLines - this.#drawArea.height - 1)
  }

  translate(scroll: { top?: number, left?: number }): this {
    if (scroll.top != null) {
      this.#scroll.top = keepWithinRange(this.#scroll.top + scroll.top, 0, this.maxScrollTop)
    }
    if (scroll.left != null) {
      this.#scroll.left = keepWithinRange(this.#scroll.left + scroll.left, 0, this.maxScrollLeft)
    }
    return this
  }

  // imprime o conteúdo iniciando linha e coluna, limitado em uma largura e altura
  draw(): this {
    const scrollLeft = this.#scroll.left
    const scrollTop = this.#scroll.top
    for (let i = 0; i <= this.#drawArea.height; i++) {
      let line = this.#data[i + scrollTop] ?? 'z'
      line = line.slice(scrollLeft, scrollLeft + this.#drawArea.width)
      raw.write({
        top: this.#drawArea.top + i,
        left: this.#drawArea.left,
        content: line.padEnd(this.#drawArea.width, '~'),
      })
    }
    return this
  }
}




const drawArea = {
  top: 11,
  left: 4,
  width: 40,
  height: 8,
}

const data = [
  'line 1 ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ ABCDEFGHIJKLMNOPQRSTUVWXYZ ',
  'line 2 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'line 3 ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'este é um testo muito bom para testar as funcionalidades',
  'dessa aplicação, que tal?',
  'vamos ver no que dá!',
  'para ficar mais interessante, vamos adicionar mais linhas',
  'e mais linhas ainda, até que fique bem grande o suficiente',
  'assim podemos testar melhor as funcionalidades implementadas',
  'e garantir que tudo funciona como esperado, sem erros ou falhas',
  'vamos adicionar linhas realmente longas para ver como o sistema lida com isso',
  'linha extra longa: 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 |',
  '>última linha do teste<',
]

const dv = new DataView({
  drawArea: { ...drawArea, offset: -1 },
  initialData: [...data, ...data],
  // initialData: [...data, ...data, ...data, ...data],
})

const dv2 = new DataView({
  drawArea: { ...drawArea, top: 0, offset: -1 },
  initialData: [...data, ...data],
  // initialData: [...data, ...data, ...data, ...data],
})


const box = new Box({ ...drawArea, offset: 0 })


const tick = (e: string = "") => {
  const key = e.toString()

  if (key === 's') dv.translate({ top: 1 })
  if (key === 'w') dv.translate({ top: -1 })
  if (key === 'a') dv.translate({ left: -1 })
  if (key === 'd') dv.translate({ left: 1 })

  if (key === 'S') dv.translate({ top: 3 })
  if (key === 'W') dv.translate({ top: -3 })
  if (key === 'A') dv.translate({ left: -6 })
  if (key === 'D') dv.translate({ left: 6 })

  box.draw()
  dv.draw()
  dv2.draw()

  if (key === '\u0003') 
    process.exit() // ctrl + c
}

tick()
dv.draw({})

process.stdin.setRawMode(true)
process.stdin.on('data', tick)












// // escreve truncando o conteúdo após a coluna
// wrt(args: { line: number, column: number, content: string }): this {
//   const { line, column, content } = args
//   if (!this.#data[line]) return this
//   this.#data[line] = this.#data[line].slice(0, column)
//   this.#data[line] += content
//   return this
// }

// // insere na coluna, empurrando o conteúdo existente para a direita
// ins(args: { line: number, column: number, content: string }): this {
//   const { line, column, content } = args
//   if (!this.#data[line]) return this
//   const rightPart = this.#data[line].slice(column)
//   this.#data[line] = this.#data[line].slice(0, column)
//   this.#data[line] += content
//   this.#data[line] += rightPart
//   return this
// }

// // substitui o conteúdo na coluna
// rpl(args: { line: number, column: number, content: string }): this {
//   const { line, column, content } = args
//   if (!this.#data[line]) return this
//   const leftPart = this.#data[line].slice(0, column)
//   const rightPart = this.#data[line].slice(column + content.length)
//   this.#data[line] = leftPart + content + rightPart
//   return this
// }

// // adiciona uma nova linha
// addLine(args: { line?: number | null, content: string }): this {
//   const { line, content } = args
//   if (line == null || line >= this.#data.length) {
//     this.#data.push(content)
//     return this
//   }
//   this.#data.splice(line, 0, content)
//   return this
// }

// // exclui uma determina quantidade de caracteres a partir da coluna
// del(args: { line: number, column: number, count?: number }): this {
//   const { line, column, count = 1 } = args
//   if (!this.#data[line]) return this
//   const leftPart = this.#data[line].slice(0, column)
//   const rightPart = this.#data[line].slice(column + count)
//   this.#data[line] = leftPart + rightPart
//   return this
// }








// class DataViewScrollbar {
//   #dataView: DataView
//   #drawArea

//   constructor(args: {
//     drawArea: { top: number, left: number, width: number, height: number },
//     dataView: DataView
//   }) {
//     this.#drawArea = args.drawArea
//     this.#dataView = args.dataView
//   }

//   drawVarticalBars() {
//     const drawTop = this.#drawArea.top
//     const l = this.#drawArea.left
//     const r = this.#drawArea.left + this.#drawArea.width
//     for (let i = 0; i < this.#drawArea.height; i++) {
//       raw.write({ top: drawTop + i, left: l, content: '│' })
//       raw.write({ top: drawTop + i, left: r, content: '│' })
//     }
//   }

//   drawVerticalScrollbarHandler() {
//     const dv = this.#dataView
//     const maxDrawHeight = dv.limitDrawHeightContent
//     const totalLines = dv.maxLines

//     if (maxDrawHeight >= totalLines) {
//       return // não desenha a barra de scroll se todo o conteúdo couber na área de desenho
//     }

//     const scrollTop = dv.scrollTop
//     const scrollTopPercent = scrollTop / (totalLines - maxDrawHeight)
//     const drawTop = this.#drawArea.top
//     const drawLeft = this.#drawArea.left + this.#drawArea.width

//     raw.write({ top: 0, left: 0, content: `` })
//     console.log({ scrollTopPercent, scrollTop, totalLines, maxDrawHeight })


//     // desenha o indicador de posição na barra de scroll vertical
//     const handlePos = drawTop + Math.floor(scrollTopPercent * (this.#drawArea.height - 1))
//     raw.write({ top: handlePos, left: drawLeft, content: '┃' })
//   }

//   drawHorizontalScrollbar() {
//     const dv = this.#dataView
//     const maxDrawWidth = dv.limitDrawWidthContent
//     const totalWidth = dv.maxLineLength
//     const scrollLeft = dv.scrollLeft
//     const scrollLeftPercent = scrollLeft / (totalWidth - maxDrawWidth)

//     const drawTop = this.#drawArea.top + this.#drawArea.height
//     const drawLeft = this.#drawArea.left + 1

//     // desenha a barra de scroll horizontal
//     const barwidth = '─'.repeat(this.#drawArea.width - 1)
//     raw.write({ top: drawTop, left: drawLeft, content: barwidth })

//     // desenha o indicador de posição na barra de scroll horizontal
//     const handlePos = drawLeft + Math.floor(scrollLeftPercent * (this.#drawArea.width - 2))
//     raw.write({ top: drawTop, left: handlePos, content: '━' })
//   }

//   draw() {
//     this.drawVarticalBars()
//     this.drawVerticalScrollbarHandler()
//     this.drawHorizontalScrollbar()
//   }
// }