import { execSync } from "node:child_process"
import { byRuntime } from "./core.runtime.js"

const entryFile = "src/index.ts"

byRuntime()
  .node(() => execSync(
    `npx tsx --watch ${entryFile}`,
    { stdio: "inherit" }
  ))
  
  .deno(() => execSync(
    `deno -A --watch --quiet ${entryFile}`, 
    { stdio: "inherit" }
  ))
  
  .bun (() => execSync(
    `bun --watch ${entryFile}`, 
    { stdio: "inherit" }
  ))
  
  .run()
