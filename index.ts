process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdout.write('\x1B[?25l')

import { SpawnCage } from './src/SpawnCage.js'
import * as tm from './src/TerminalMath.js'

SpawnCage

// const cage1 = new SpawnCage({
//   command: 'vi',
//   args: ['/tmp/teste.txt'],
//   square: tm.square(
//     tm.coord.fixed(1, 1),
//     tm.coord.responsive(1, .35)
//   ),
// })

// const cage2 = new SpawnCage({
//   command: 'vi',
//   args: ['/tmp/teste2.txt'],
//   square: tm.square(
//     tm.coord.sum(tm.coord.fixed(0, 4), cage1.square.topRight),
//     tm.coord.responsive(1, 1)
//   ),
// })

// console.clear()

// process.stdout.on('resize', () => {
//   console.clear()
//   cage1.resize()
//   cage2.resize()
//   cage1.render()
//   cage2.render()
// })

// get key pressed
process.stdin.on('data', (key) => {
  if (key === '\u0003') {
    process.stdout.write('\x1B[?25h')
    process.exit()
  }

  console.log(JSON.stringify(key))
})