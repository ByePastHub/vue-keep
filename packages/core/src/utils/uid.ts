let _counter = 0

/** 生成唯一 ID，用于 PageStackEntry.id 和 eventChannel.id */
export function uid(): string {
  return `vk_${Date.now().toString(36)}_${(++_counter).toString(36)}`
}
