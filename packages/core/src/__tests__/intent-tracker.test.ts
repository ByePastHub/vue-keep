import { describe, it, expect } from 'vitest'
import { IntentTracker } from '../router/intent-tracker'
import type { NavigationIntent } from '../types/internal'

function createIntent(overrides?: Partial<NavigationIntent>): NavigationIntent {
  return {
    method: 'push',
    delta: 1,
    sentAt: Date.now(),
    ...overrides,
  }
}

describe('IntentTracker', () => {
  it('初始状态没有待消费意图', () => {
    const tracker = new IntentTracker()
    expect(tracker.hasPending).toBe(false)
    expect(tracker.peek()).toBeNull()
    expect(tracker.consume()).toBeNull()
  })

  it('set 后可以 peek 和 consume', () => {
    const tracker = new IntentTracker()
    const intent = createIntent()
    tracker.set(intent)

    expect(tracker.hasPending).toBe(true)
    expect(tracker.peek()).toBe(intent)
    expect(tracker.consume()).toBe(intent)
  })

  it('consume 只消费一次', () => {
    const tracker = new IntentTracker()
    tracker.set(createIntent())

    tracker.consume()
    expect(tracker.hasPending).toBe(false)
    expect(tracker.consume()).toBeNull()
  })

  it('peek 不消费意图', () => {
    const tracker = new IntentTracker()
    tracker.set(createIntent())

    tracker.peek()
    tracker.peek()
    expect(tracker.hasPending).toBe(true)
    expect(tracker.consume()).not.toBeNull()
  })

  it('set 覆盖之前的意图', () => {
    const tracker = new IntentTracker()
    const first = createIntent({ method: 'push' })
    const second = createIntent({ method: 'replace' })

    tracker.set(first)
    tracker.set(second)
    expect(tracker.consume()?.method).toBe('replace')
  })

  it('clear 清空未消费的意图', () => {
    const tracker = new IntentTracker()
    tracker.set(createIntent())
    tracker.clear()

    expect(tracker.hasPending).toBe(false)
    expect(tracker.consume()).toBeNull()
  })
})
