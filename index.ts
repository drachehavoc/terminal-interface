
export type DrawArea = { top: number, left: number, width: number, height: number, offset?: number }


import { 
  TerminalRelativePosition as Rel, 
  TerminalResponsivePosition as Res 
} from "./src/TerminalInterface"

import { print } from "./src/AnsiEscs.print"
import { Format } from "./src/AnsiEscs.Format"

// hide cursor
process.stdout.write('\u001B[?25l')


// Example: Using getStamper to create reusable style functions
exemplo_getStamper: {
  console.clear()
  
  // Create reusable stampers for different styles
  const errorStamper = new Format({ fg: 31, dc: ['bold'] }).getStamper()
  const successStamper = new Format({ fg: 32, dc: ['bold'] }).getStamper()
  const warningStamper = new Format({ fg: 33 }).getStamper()
  
  console.log(errorStamper('ERROR: Something went wrong!'))
  console.log(warningStamper('WARNING: Please check this.'))
  console.log(successStamper('SUCCESS: Operation completed.'))
  
  break exemplo_getStamper
}





exemplo_1: {
  // break exemplo_1
  const res1 = new Res({ top: .25, left: .25 })
  const res2 = new Res({ top: .5 , left: .5  })
  const res3 = new Res({ top: .75, left: .75 })

  const rel1 = new Rel({ position: res2, left: ({ left }) => left - 2, top: ({ top }) => top - 1 })
  const rel2 = new Rel({ position: res2, left: ({ left }) => left + 2, top: ({ top }) => top + 1 })

  const draw = () => {
    console.clear()
    // Posições responsivas
    print(res1, '◼')    
    print(res2, '◼')
    print(res3, '◼')

    // Posições relativas ao res2 (centro)
    print(rel1, '◼')
    print(rel2, '◼')
  }

  process.stdout.on('resize', draw)
  draw()
}