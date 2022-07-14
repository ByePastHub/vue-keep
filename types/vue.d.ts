import { NavigationGuard, Dictionary, KeepRouter, destroy } from './vue-keep'

declare module 'vue/types/vue' {
  interface Vue {
    $keepRouter: destroy
    $router: KeepRouter
    beforeEach(guard: NavigationGuard): Function
    beforeEach(name: string, guard: NavigationGuard): Function
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $keepRouter: destroy
    $router: KeepRouter
    beforeEach(guard: NavigationGuard): Function
    beforeEach(name: string, guard: NavigationGuard): Function
  }
}