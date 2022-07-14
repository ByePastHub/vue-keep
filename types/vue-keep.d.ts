import Vue, { App } from 'vue'
import VueRouter, { Router, RouteRecord, RouteMeta } from 'vue-router'

export declare function destroy(name: string | string[]): void
export declare function beforeEach(guard: NavigationGuard): Function
export declare function beforeEach(name: string, guard: NavigationGuard): Function

export interface $KeepRouter {
  destroy(name: string | string[]): void
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
  destory?: string | string[]
  name?: string
  path?: string
  hash?: string
  query?: Dictionary<string | (string | null)[] | null | undefined>
  params?: Dictionary<string>
  append?: boolean
  replace?: boolean
}

export interface Route {
  path: string
  name?: string | null
  hash: string
  query: Dictionary<string | (string | null)[]>
  params: Dictionary<string>
  fullPath: string
  matched: RouteRecord[]
  redirectedFrom?: string
  meta?: RouteMeta
}

export interface KeepRouter extends Router, VueRouter {
  push(location: KeepLocation): Promise<Route>
  replace(location: KeepLocation): Promise<Route>
  jump(location: KeepLocation): Promise<Route>
  jump(n: number, location: KeepLocation): Promise<Route>
  push(location: KeepLocation): void
  replace(location: KeepLocation): void
  jump(location: KeepLocation): void
  jump(n: number, location: KeepLocation): void
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
  include?: MatchPattern;
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
  function install(app: typeof Vue, router: Router): void
}

export default Keep