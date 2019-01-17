export const LOG_PREFIX = '[cyclone]'

export const debug = console.debug.bind(console, LOG_PREFIX)
export const info = console.info.bind(console, LOG_PREFIX)
export const error = console.error.bind(console, LOG_PREFIX)
export const warn = console.warn.bind(console, LOG_PREFIX)

export default {
  debug,
  info,
  error,
  warn
}
