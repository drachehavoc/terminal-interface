import { inspect } from "node:util"
import type { WriteStream } from "node:fs"
import { createWriteStream } from 'node:fs'

export namespace logger {
  const fileStreamPath = 'terminal.log'
  let fileStream: WriteStream | null = null

  function getFileStream() { 
    if (!fileStream) 
      fileStream = createWriteStream(fileStreamPath, { flags: 'a' })
    return fileStream
  }

  export function log(...args: any[]) {
    const fileStream = getFileStream()
    if (!args.length)
      return fileStream.write('\n')
    if (args.length === 1 && typeof args[0] === 'string')
      return fileStream.write(args[0] + '\n')
    for (const arg of args)
      fileStream.write(`${inspect(arg, { colors: true })} `)
    fileStream.write('\n')
  }

  export function clearLogFile() {
    getFileStream().end()
    fileStream = createWriteStream(fileStreamPath, { flags: 'w' })
  }
  
  export function clear() {
    const fileStream = getFileStream()
    fileStream.write('\x1Bc')
  }
}