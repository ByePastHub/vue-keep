import { $KeepRouter } from './vue-keep'

declare module 'vue/types/vue' {
  interface Vue {
    $keepRouter: $KeepRouter
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $keepRouter: $KeepRouter
  }
}