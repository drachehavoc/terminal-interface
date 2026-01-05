import { execSync } from 'node:child_process'

export const __runtime = (() => {
  if (typeof Bun !== 'undefined')
    return 'bun'
  if (typeof Deno !== 'undefined')
    return 'deno'
  if (typeof process !== 'undefined' && process.versions != null && process.versions.node != null)
    return 'node'
  return 'unknown'
})()

export function byRuntime(settings = { errorOnNotDefined: true }) {
  const fns = {}
  const notdefined = () => {
    if (settings.errorOnNotDefined)
      throw new Error(`Function not defined for current runtime: ${__runtime}`)
  }

  const setFn = (name, fn) => {
    fns[name] = fn
    return runner
  }

  const runner = {
    node: (fn) => setFn('node', fn),
    deno: (fn) => setFn('deno', fn),
    bun: (fn) => setFn('bun', fn),
    async run(...args) {
      const fn = fns[__runtime] || fns['unknown'] || notdefined
      return await fn(...args)
    }
  }

  return runner
}

function termninalWaitInput() {
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
}

function terminalContinue() {
  process.stdin.setRawMode(false)
  process.stdin.pause()
}

async function terminalQuestion(question, throwOnInvalid = false) {
  return new Promise((resolve, reject) => {
    termninalWaitInput()
    console.log(`${question}`)
    process.stdin.on('data', (key) => {
      if (key === 'y' || key === 'Y') {
        terminalContinue()
        resolve(true)
        return
      }
      if (key === 'n' || key === 'N') {
        terminalContinue()
        resolve(false)
        return
      }
      if (throwOnInvalid) {
        terminalContinue()
        reject(new Error('Invalid key pressed'))
        return
      }
      terminalContinue()
      resolve(null)
    })
  })
}

export async function byRuntimeInstall(packages) {
  const msgAndFormat = async (installList, prefix = '') => {
    const names = { 'node': 'Node.js', 'deno': 'Deno', 'bun': 'Bun' }
    const installArgs = Object
      .entries(installList)
      .map(([pkg, version]) => `${prefix}${pkg}@${version}`)
    console.log(`Installing locally packages for ${names[__runtime] || __runtime} runtime:`)
    console.log(installArgs.map(v => `- ${v}`).join('\n'))
    console.log('')
    const resp = await terminalQuestion(`Press 'y' to continue, or any other key to abort.`)
    return resp ? installArgs : process.exit(0)
  }

  byRuntime()

    .node(async ({ defaults, node }) => {
      const installList = { ...defaults ?? {}, ...node ?? {} }
      const params = await msgAndFormat(installList)
      const command = `npm install --no-save ${params.join(' ')}`
      console.log('')
      console.log(`Executing install:`)
      console.log('')
      execSync(command, { stdio: 'inherit' })
    })

    .deno(async ({ defaults, deno }) => {
      const list = { ...defaults ?? {}, ...deno ?? {} }
      const params = await msgAndFormat(list, 'npm:')
      const command = `deno cache --node-modules-dir=auto ${params.join(' ')}`
      console.log('')
      console.log(`Executing install:`)
      console.log('')
      execSync(command, { stdio: 'inherit' })
    })

    .bun(async ({ defaults, bun }) => {
      const list = { ...defaults ?? {}, ...bun ?? {} }
      const params = await msgAndFormat(list)
      const command = `bun add --no-save ${params.join(' ')}`
      console.log('')
      console.log(`Executing install:`)
      console.log('')
      execSync(command, { stdio: 'inherit' })
    })

    .run(packages)
}