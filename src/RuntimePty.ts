import type { RuntimePtyTypes } from "./RuntimePty.types";
import { byRuntime } from "../core.runtime";

const pty = await byRuntime()
  .node(async () => await import("@lydell/node-pty"))
  .deno(async () => await import("@lydell/node-pty"))
  .bun(async () => await import("bun-pty"))
  .run() as unknown as RuntimePtyTypes.ITerminal

export { pty }