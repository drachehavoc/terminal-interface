process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.setEncoding('utf8')

// hide cursor
process.stdout.write('\x1B[?25l')

import { SpawnCage } from './src/SpawnCage.js'
import * as tm from './src/TerminalMath.js'

const cage1 = new SpawnCage({
  command: 'nano',
  args   : ['/tmp/teste.txt'],
  square : tm.square(tm.coord.fixed(1, 1), tm.coord.responsive(.5, .35)),
})

const cage2 = new SpawnCage({
  command: 'nano',
  args   : ['/tmp/teste2.txt'],
  square : tm.square(tm.coord.fixed(1, 44), tm.coord.responsive(.8, .85)),
})


process.stdout.on('resize', () => {
  console.clear()
  cage1.resize()
  cage2.resize()
  cage1.render()
  cage2.render()
})
