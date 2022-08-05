import Vue, { App, NavigationFailure } from 'vue'
import VueRouter, { Router, Route, RouteRecord, RouteMeta } from 'vue-router'

export type DestroyName = string | Array<string>
export declare function destroy(name: DestroyName): void
export declare function beforeEach(guard: NavigationGuard): Function
export declare function beforeEach(name: string, guard: NavigationGuard): Function

export interface $KeepRouter {
  destroy(name: DestroyName): void
  beforeEach(guard: NavigationGuard): Function
  beforeEach(name: string, guard: NavigationGuard): Function
}

export type Dictionary<T> = { [key: string]: T }
export type Direction = 'forward' | 'back'
export type JumpMethod = 'push' | 'replace' | 'forward' | 'go' | 'back'
export type TriggerType = 'beforeChange' | 'change'

export interface KeepLocation {
  type?: string
  cache?: boolean
  destroy?: DestroyName
  name?: string
  path?: string
  hash?: string
  query?: Dictionary<string | (string | null)[] | null | undefined>
  params?: Dictionary<string>
  append?: boolean
  replace?: boolean
}

type ErrorHandler = (err: Error) => void

export interface OverloadRouter {
  jump(location: KeepLocation): Promise<Route>
  jump(location: KeepLocation): Promise<NavigationFailure | void | undefined>
  jump(location: KeepLocation): void
  jump(n: number, location: KeepLocation): Promise<Route>
  jump(n: number, location: KeepLocation): Promise<NavigationFailure | void | undefined>
  jump(n: number, location: KeepLocation): void
}

export interface KeepRouter extends OverloadRouter, Router, VueRouter {
  push(location: KeepLocation): Promise<Route>
  push(location: KeepLocation): Promise<NavigationFailure | void | undefined>
  push(location: KeepLocation): void
  push(
    location: KeepLocation,
    onComplete?: Function,
    onAbort?: ErrorHandler
  ): void
  replace(location: KeepLocation): Promise<Route>
  replace(location: KeepLocation): Promise<NavigationFailure | void | undefined>
  replace(location: KeepLocation): void
  replace(
    location: KeepLocation,
    onComplete?: Function,
    onAbort?: ErrorHandler
  ): void
}

export interface State {
  keepBack: string | undefined | null
  keepCurrent: string
  keepDirection: string
  keepForward: string | undefined | null
  keepNext: string | undefined | null
  keepPosition: number
  keepReplace: boolean
}

export interface KeepRoute {
  cache: boolean
  constCache: boolean
  direction: Direction
  fullPath: string
  hash: string
  href: string
  matched: RouteRecord[]
  meta: RouteMeta
  method: JumpMethod
  name?: string | null
  params: Dictionary<string>
  path: string
  query: Dictionary<string | (string | null)[]>
  state: State
  triggerType: TriggerType
  type: Direction
}

export type NavigationGuard = (
  to: KeepRoute,
  from: KeepRoute
) => any

export declare type MatchPattern = string | RegExp | (string | RegExp)[];

export declare interface KeepAliveProps {
  exclude?: MatchPattern;
  max?: number | string;
}

export declare interface Ref<T = any> {
  value: T;
  [RefSymbol]: true;
}

declare const RefSymbol: unique symbol;
declare type VNodeRef = string | Ref | ((ref: object | null, refs: Record<string, any>) => void);

export declare type VNodeProps = {
  key?: string | number | symbol;
  ref?: VNodeRef;
  ref_for?: boolean;
  ref_key?: string;
};

export declare const KeepRouterView: {
  new (): {
    $props: VNodeProps & KeepAliveProps;
  };
};

export declare const vueApp: Vue | App

declare namespace Keep {
  function beforeEach(guard: NavigationGuard): Function
  function beforeEach(name: string, guard: NavigationGuard): Function
  function install(app: typeof Vue | App, router: Router): void
}

export default Keep