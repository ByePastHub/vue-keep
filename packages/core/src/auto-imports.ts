export interface VueKeepAutoImportPreset {
  from: string // 模块来源
  imports: string[] // 自动导入成员名称
}

export const VueKeepAutoImports = {
  from: '@bye_past/vue-keep',
  imports: [
    'NavigationDirection',
    'NavigationMethod',
    'createKeepRouter',
    'createKeepScrollBehavior',
    'KeepRouterView',
    'KeepPageShell',
    'KeepTransition',
    'useKeepRouter',
    'usePageCache',
    'useNavigationDirection',
    'usePageStack',
    'useEventChannel',
    'useScrollRestoration',
    'onPageShow',
    'onPageHide',
  ],
} satisfies VueKeepAutoImportPreset

export default VueKeepAutoImports
