export declare const __runtime: 
  | 'bun' 
  | 'deno' 
  | 'node' 
  | 'unknown'

export declare function byRuntime(settings?: {
  errorOnNotDefined?: boolean
}): {
  bun(callback: () => void): ReturnType<typeof byRuntime>
  deno(callback: () => void): ReturnType<typeof byRuntime>
  node(callback: () => void): ReturnType<typeof byRuntime>
  run(): any
}

export declare function byRuntimeInstall(definitions: {
  defaults?: Record<string, string>,
  bun?: Record<string, string>,
  deno?: Record<string, string>,
  node?: Record<string, string>,
}): void
