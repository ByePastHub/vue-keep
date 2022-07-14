import { $KeepRouter, KeepRouter } from './vue-keep'

declare module 'vue/types/vue' {
  interface Vue {
    $keepRouter: $KeepRouter
    $router: KeepRouter
    $xxx: string
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $keepRouter: $KeepRouter
    $router: KeepRouter
    $xxx: string
  }
}