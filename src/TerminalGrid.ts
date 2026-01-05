import { Terminal } from "./Terminal"
import { Coordinate, Square, type FutureNumber } from "./LazyLayoutMath"

type Result     = FutureNumber & { type: "fixed" | "relative" }
type Definition = { fixed: number } | { relative: number }
type TotalBase  = () => number

const getDistributePositions = (total: TotalBase, ...definitions: Definition[]) => {
  const sumOfFixedSpaces = definitions.reduce((acc, curr) => {
    if ("fixed" in curr) return acc + curr.fixed
    return acc
  }, 0)

  const getFreeSpaceForRelatives =
    () => total() - sumOfFixedSpaces

  let prev: Result = { type: "fixed", value: 0 }
  const resultados: Result[] = [prev]

  for (const definition of definitions) {
    if ("relative" in definition) {
      const curr = prev
      resultados.push(prev = {
        type: "relative",
        get value() {
          return curr.value + Math.floor(getFreeSpaceForRelatives() * definition.relative)
        }
      })
      continue
    }

    if ("fixed" in definition) {
      const curr = prev
      resultados.push(prev = {
        type: "fixed",
        get value() {
          return curr.value + definition.fixed
        }
      })
      continue
    }

    throw new Error("Unreachable")
  }

  return resultados
}

export const getTerminalGrid = (
  definitionsHorizontal: Definition[],
  definitionsVertical: Definition[],
) => {
  const horizontal = getDistributePositions(() => Terminal.width, ...definitionsHorizontal)
  const vertical = getDistributePositions(() => Terminal.height, ...definitionsVertical)
  const getCoodinate = (hIndex: number, vIndex: number) => {
    if (!horizontal[hIndex])
      throw new Error("Horizontal index out of bounds")
    if (!vertical[vIndex])
      throw new Error("Vertical index out of bounds")
    return new Coordinate(
      horizontal[hIndex],
      vertical[vIndex]
    )
  }
  const getSquare = (hStart: number, vStart: number, hEnd: number, vEnd: number) => {
    return new Square({
      tl: getCoodinate(hStart, vStart),
      br: getCoodinate(hEnd, vEnd),
    })
  }
  return { horizontal, vertical, getCoodinate, getSquare }
}