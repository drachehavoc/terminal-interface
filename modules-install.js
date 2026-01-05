import { byRuntimeInstall } from './core.runtime.js'

byRuntimeInstall({
  'defaults': {
    '@types/node'    : 'latest',
    '@xterm/headless': 'latest'
  },

  'node': {
    '@lydell/node-pty': 'latest',
    'tsx'             : 'latest'
  },

  'deno': {
    '@lydell/node-pty': 'latest',
  },

  'bun': {
    '@types/bun': 'latest',
    'bun-pty'   : 'latest'
  },
})