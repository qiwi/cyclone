export const LOG_PREFIX: string = '[cyclone]'

export const debug = console.debug.bind(console, LOG_PREFIX)
export const info = console.info.bind(console, LOG_PREFIX)
export const error = console.error.bind(console, LOG_PREFIX)
export const warn = console.warn.bind(console, LOG_PREFIX)

export const log = {
  debug,
  info,
  error,
  warn
}
