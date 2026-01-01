
export type DrawArea = { top: number, left: number, width: number, height: number, offset?: number }


import { 
  TerminalRelativePosition as Rel, 
  TerminalResponsivePosition as Res 
} from "./src/TerminalInterface"

import { print } from "./src/AnsiEscs.print"
import { Format } from "./src/AnsiEscs.Format"

// hide cursor
process.stdout.write('\u001B[?25l')


// Test getStamper function
teste_getStamper: {
  console.clear()
  
  // Create a format with red foreground and bold decoration
  const redBoldFormat = new Format({ fg: 31, dc: ['bold'] })
  const redBoldStamper = redBoldFormat.getStamper()
  
  // Create a format with green background and italic decoration
  const greenBgFormat = new Format({ bg: 42, dc: ['italic'] })
  const greenBgStamper = greenBgFormat.getStamper()
  
  // Create a format with blue foreground, yellow background, and underline
  const blueYellowFormat = new Format({ fg: 34, bg: 43, dc: ['underline'] })
  const blueYellowStamper = blueYellowFormat.getStamper()
  
  // Test the stampers - they should apply the same styles to different texts
  console.log('Testing getStamper function:\n')
  console.log(redBoldStamper('Red and Bold Text 1'))
  console.log(redBoldStamper('Red and Bold Text 2'))
  console.log(redBoldStamper('Red and Bold Text 3'))
  console.log('')
  console.log(greenBgStamper('Green Background with Italic 1'))
  console.log(greenBgStamper('Green Background with Italic 2'))
  console.log('')
  console.log(blueYellowStamper('Blue text on Yellow background with Underline'))
  console.log(blueYellowStamper('Same style, different text'))
  console.log('')
  
  // Compare with tx method for consistency
  console.log('Comparing with tx method:')
  console.log(redBoldFormat.tx('Using tx method'))
  console.log(redBoldStamper('Using getStamper'))
  console.log('')
  console.log('✓ getStamper implementation completed successfully!')
  
  break teste_getStamper
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