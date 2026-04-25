import type { InjectionKey } from 'vue'

export const KEEP_STORE_KEY: InjectionKey<unknown> = Symbol('vue-keep-store')
export const KEEP_OPTIONS_KEY: InjectionKey<unknown> = Symbol('vue-keep-options')
export const KEEP_ROUTER_KEY: InjectionKey<unknown> = Symbol('vue-keep-router')
export const CHANNEL_REGISTRY_KEY: InjectionKey<unknown> = Symbol('vue-keep-channel-registry')
export const DEPTH_KEY: InjectionKey<number> = Symbol('vue-keep-depth')
export const CONTAINER_ID_KEY: InjectionKey<string> = Symbol('vue-keep-container')
