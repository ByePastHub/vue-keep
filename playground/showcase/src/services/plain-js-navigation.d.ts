export interface PlainJsNavigationResult {
  action: string // 操作名称
  detail: string // 操作说明
  time: string // 执行时间
}

export function readKeepRouterFromPlainJs(): PlainJsNavigationResult

export function pushStackFromPlainJs(): Promise<PlainJsNavigationResult>

export function replaceSelfFromPlainJs(): Promise<PlainJsNavigationResult>

export function backFromPlainJs(): PlainJsNavigationResult

export function relaunchHomeFromPlainJs(): Promise<PlainJsNavigationResult>
