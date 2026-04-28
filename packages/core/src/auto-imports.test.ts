import { describe, expect, it } from 'vitest'
import VueKeepAutoImports, { VueKeepAutoImports as namedPreset } from './auto-imports'

describe('VueKeepAutoImports', () => {
  it('导出 unplugin-auto-import 可用的 preset', () => {
    expect(VueKeepAutoImports).toBe(namedPreset)
    expect(VueKeepAutoImports.from).toBe('@bye_past/vue-keep')
    expect(VueKeepAutoImports.imports).toContain('getKeepRouter')
    expect(VueKeepAutoImports.imports).toContain('useKeepRouter')
    expect(VueKeepAutoImports.imports).toContain('onPageShow')
  })
})
