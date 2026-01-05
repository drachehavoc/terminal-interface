import { execSync } from "node:child_process"
import { byRuntime } from "./core.runtime.js"

byRuntime()
  .node(() => execSync("npx  tsx             src/index.ts", { stdio: "inherit" }))
  .deno(() => execSync("deno run --allow-run src/index.ts", { stdio: "inherit" }))
  .bun (() => execSync("bun  run             src/index.ts", { stdio: "inherit" }))
  .run()
