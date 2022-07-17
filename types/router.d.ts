import { NavigationFailure } from 'vue'
import {  Route } from 'vue-router'
import { KeepLocation, OverloadRouter } from './vue-keep'

declare module 'vue-router/types/router' {
  interface VueRouter extends OverloadRouter {
    push(location: KeepLocation): Promise<Route>
    push(location: KeepLocation): void
    push(
      location: KeepLocation,
      onComplete?: Function,
      onAbort?: ErrorHandler
    ): void
    replace(location: KeepLocation): Promise<Route>
    replace(location: KeepLocation): void
    replace(
      location: KeepLocation,
      onComplete?: Function,
      onAbort?: ErrorHandler
    ): void
  }
}

declare module 'vue-router/dist/vue-router' {
  interface Router extends OverloadRouter {
    push(location: KeepLocation): Promise<NavigationFailure | void | undefined>
    replace(location: KeepLocation): Promise<NavigationFailure | void | undefined>
  }
}