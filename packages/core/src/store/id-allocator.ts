let counter = 0

// 生成唯一 ID：vk_{自增}_{时间戳base36}
export function genId(): string {
  return `vk_${++counter}_${Date.now().toString(36)}`
}

// 仅测试用
export function resetIdCounter() {
  counter = 0
}
