// 环境检测
export const isBrowser = typeof window !== 'undefined'
export const isSSR = !isBrowser
export const hasHistory = isBrowser && typeof history !== 'undefined'
export const hasResizeObserver = isBrowser && typeof ResizeObserver !== 'undefined'
