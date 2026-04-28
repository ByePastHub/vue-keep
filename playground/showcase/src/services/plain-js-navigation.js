import { getKeepRouter, useKeepRouter } from '@bye_past/vue-keep'

/** 创建普通 JS 模块调用结果 */
function createResult(action, detail) {
  return {
    action,
    detail,
    time: new Date().toLocaleTimeString(),
  }
}

/** 在普通 JS 模块中读取 useKeepRouter 实例 */
export function readKeepRouterFromPlainJs() {
  const keepRouter = useKeepRouter()
  return createResult('useKeepRouter()', `实例可用：${typeof keepRouter.push === 'function'}`)
}

/** 在普通 JS 模块中使用 useKeepRouter 发起 push 导航 */
export async function pushStackFromPlainJs() {
  const keepRouter = useKeepRouter()
  await keepRouter.push('/nav/stack', {
    metadata: { source: 'plain-js-module' },
  })
  return createResult('useKeepRouter().push', '/nav/stack')
}

/** 在普通 JS 模块中使用 getKeepRouter 发起 replace 导航 */
export async function replaceSelfFromPlainJs() {
  const keepRouter = getKeepRouter()
  const target = `/nav/js-call?from=plain-js&ts=${Date.now()}`
  await keepRouter.replace(target, {
    metadata: { source: 'plain-js-module' },
  })
  return createResult('getKeepRouter().replace', target)
}

/** 在普通 JS 模块中使用 useKeepRouter 返回上一页 */
export function backFromPlainJs() {
  const keepRouter = useKeepRouter()
  keepRouter.back()
  return createResult('useKeepRouter().back', '返回上一页')
}

/** 在普通 JS 模块中使用 getKeepRouter 重启到首页 */
export async function relaunchHomeFromPlainJs() {
  const keepRouter = getKeepRouter()
  await keepRouter.reLaunch('/')
  return createResult('getKeepRouter().reLaunch', '/')
}
