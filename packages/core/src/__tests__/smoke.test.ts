import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function collectSourceFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry === '__tests__') continue
      files.push(...collectSourceFiles(full))
    } else if (full.endsWith('.ts') && !full.endsWith('.test.ts') && !full.endsWith('.d.ts')) {
      files.push(full)
    }
  }
  return files
}

describe('非功能烟测', () => {
  const srcDir = join(__dirname, '..')
  const sourceFiles = collectSourceFiles(srcDir)

  it('核心源码中不出现 eval(', () => {
    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8')
      expect(content).not.toMatch(/\beval\s*\(/)
    }
  })

  it('核心源码中不出现 innerHTML =', () => {
    for (const file of sourceFiles) {
      const content = readFileSync(file, 'utf-8')
      expect(content).not.toMatch(/\.innerHTML\s*=/)
    }
  })

  it('CSS 预设包含 prefers-reduced-motion 媒体查询', () => {
    const css = readFileSync(join(__dirname, '..', 'animation', 'presets.css'), 'utf-8')
    expect(css).toContain('prefers-reduced-motion')
  })
})
