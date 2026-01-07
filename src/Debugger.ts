import { inspect } from "node:util"
import { createWriteStream } from 'fs'

export namespace logger {
  const fileStreamPath = 'output.log'
  let fileStream = createWriteStream(fileStreamPath, { flags: 'a' })

  export function log(...args: any[]) {
    if (!args.length)
      return fileStream.write('\n')
    if (args.length === 1 && typeof args[0] === 'string')
      return fileStream.write(args[0] + '\n')
    for (const arg of args)
      fileStream.write(`${inspect(arg, { colors: true })} `)
    fileStream.write('\n')
  }

  export function clearLogFile() {
    fileStream.end()
    fileStream = createWriteStream(fileStreamPath, { flags: 'w' })
  }

  export function clear() {
    fileStream.write('\x1Bc')
  }
}