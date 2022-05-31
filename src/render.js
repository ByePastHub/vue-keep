// import { resolveComponent, openBlock, createBlock, withCtx, KeepAlive, resolveDynamicComponent } from 'vue';
import * as Vue from 'vue';

export function render2x() {
  const vm = this;
  const h = vm.$createElement;
  const c = vm._self.c || h;
  return c(
    'keep-alive',
    {
      attrs: {
        include: [].concat(vm.includeList),
        max: vm.max,
        exclude: vm.exclude
      },
    },
    [c('router-view')],
    1
  );
}

export function render3x(ctx, cache, props, setup, data) {
  // 避免Vue2.x提示找不到以下参数
  const _Vue = Vue;
  const componentRouterView = _Vue.resolveComponent('router-view');
  const openBlock = _Vue.openBlock;
  const createBlock = _Vue.createBlock;
  const withCtx = _Vue.withCtx;
  const KeepAlive = _Vue.KeepAlive;
  const resolveDynamicComponent = _Vue.resolveDynamicComponent;

  return (openBlock(), createBlock(componentRouterView, { key: 0 }, {
    default: withCtx(function(ref) {
      const Component = ref.Component;
      return [(openBlock(), createBlock(KeepAlive, {
        include: data.includeList,
        max: props.max,
        exclude: props.exclude
      }, [(openBlock(), createBlock(resolveDynamicComponent(Component)))], 1032, ['include', 'max', 'exclude']))];
    }),
    _: 1
  }));
}
