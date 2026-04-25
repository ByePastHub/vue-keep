import type { NavigationIntent } from '../types/internal'

/**
 * 单例导航意图追踪器
 * keepRouter 的导航方法写入意图，bindRouter.beforeEach 消费意图
 * 意图只消费一次，消费后自动清空
 */
export class IntentTracker {
  private _pending: NavigationIntent | null = null

  /** 写入一个导航意图 */
  set(intent: NavigationIntent): void {
    this._pending = intent
  }

  /** 消费当前意图（只消费一次，消费后清空） */
  consume(): NavigationIntent | null {
    const intent = this._pending
    this._pending = null
    return intent
  }

  /** 查看当前意图但不消费 */
  peek(): NavigationIntent | null {
    return this._pending
  }

  /** 清空未提交的意图（导航失败时调用） */
  clear(): void {
    this._pending = null
  }

  /** 是否有待消费的意图 */
  get hasPending(): boolean {
    return this._pending !== null
  }
}
