import { empty } from "./AnsiEscs.consts"
import { m, reset } from "./AnsiEscs.raw"

export const keepArrayEmptySpacesRemoveUndeined = (...arr: any[]) => {
  return arr.map(p => p === empty ? [] : p).filter(p => p !== undefined)
}

export const createArrayRange = (start: number, end: number) => {
  const result = []
  for (let i = start; i <= end; i++)
    result.push(i)
  return result
}

export const colorDemo = () => {
  function repeat(...ranges: Array<[number, number]>) {
    return { apply: (fn: (n: number) => void) => {
      const results: any[] = []
      for (const range of ranges)
        for (let i = range[0]; i <= range[1]; i++) 
          results.push(fn(i))
      return results
    }}
  }
  
  const fgs = repeat([30, 37], [90, 97]).apply(n => reset 
    + m(n)
    + ` ${n} `.padEnd(5)
    + reset
  )

  const bgs = repeat([40, 47], [100, 107]).apply(n => reset
    + m(0, n)
    + ` ${n} `.padEnd(5)
    + reset
  )  
  
  const combined = repeat([30, 37], [90, 97]).apply(fg => {
    return repeat([40, 47], [100, 107]).apply(bg => {
      return reset
        + m(fg, bg)
        + `  ${fg};${bg}  `.padEnd(10)
        + reset
    })
  }).flat()  

  //
  // console.log(reset)
  // console.log("Reset:")
  // console.log("Combined foreground/background colors:")
  // console.log(combined.join(''))
  //
  console.log("fgs", fgs.join(''))  
  console.log("bgs", bgs.join(''))
  
  console.log(reset)
  console.log()
  console.log()
}
