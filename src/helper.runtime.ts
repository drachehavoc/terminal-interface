declare const Bun: any
declare const Deno: any

const __runtimename = (() => {
  if (typeof Bun !== 'undefined') 
    return 'bun'
  
  if (typeof Deno !== 'undefined' && typeof Deno.core !== 'undefined') 
    return 'deno'
  
  if (typeof process !== 'undefined' && process.versions != null && process.versions.node != null) 
    return 'node'

  return 'unknown'
})()

export {
  __runtimename 
}