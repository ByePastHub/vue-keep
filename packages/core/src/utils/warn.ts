declare const __DEV__: boolean | undefined

let namespace = '[vue-keep]'

export function setNamespace(ns: string) {
  namespace = ns
}

export function warn(msg: string, ...args: unknown[]) {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.warn(`${namespace} ${msg}`, ...args)
  }
}

export function error(msg: string, ...args: unknown[]) {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.error(`${namespace} ${msg}`, ...args)
  }
}
