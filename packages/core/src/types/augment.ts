import type { KeepRouter, TransitionConfig, TransitionPreset } from './public'

// 扩展 Vue Router 的 RouteMeta
declare module 'vue-router' {
  interface RouteMeta {
    keep?: {
      cache?: boolean // 是否缓存当前路由页面
      constCache?: boolean // 是否将当前路由页面标记为常驻缓存
      destroy?: string | string[] | 'ALL' // 进入当前路由时需要销毁的缓存
      exclude?: boolean // 是否排除当前路由缓存
      tabKey?: string // switchTab 使用的稳定 tab 身份
      transition?: false | TransitionPreset | TransitionConfig // 当前路由动画配置
    }
  }
}

// 扩展 Vue 组件实例
declare module 'vue' {
  interface ComponentCustomProperties {
    $keepRouter: KeepRouter // 注入到组件实例上的 keepRouter 对象
  }
}
