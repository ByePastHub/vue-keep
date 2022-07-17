import { KEEP_BEFORE_ROUTE_CHANGE, KEEP_COMPONENT_DESTROY, KEEP_ROUTE_CHANGE, KEEP_SUBSCRIBE_COMPLETE, DESTROY_ALL } from './constants';
import { render2x, render3x } from './render';
import { vueApp } from './index';

export default {
  name: 'KeepRouteView',

  render: function() {
    if (!this.vueNext) {
      return render2x.call(this);
    } else {
      return render3x(...arguments);
    }
  },

  props: {
    max: {
      type: Number,
      default: 5,
    },
    exclude: {
      type: [Array, RegExp, String],
      default: () => [],
    }
  },

  data() {
    return {
      vueNext: Number(vueApp.version.slice(0, 3)) >= 3,
      includeList: [],
    };
  },

  created() {
    this.isForward = false;
    this.addEvents();
  },

  methods: {
    addEvents() {
      window.addEventListener(KEEP_BEFORE_ROUTE_CHANGE, this.beforeRouteChangeEvent);
      window.addEventListener(KEEP_ROUTE_CHANGE, this.routerChangeEvent);
      window.addEventListener(KEEP_COMPONENT_DESTROY, this.componentDestroyEvent);
      const event = new CustomEvent(KEEP_SUBSCRIBE_COMPLETE);
      window.dispatchEvent(event);
    },

    async beforeRouteChangeEvent(params) {
      const { detail: { direction, destroy, cache, toLocation }} = params;
      if (direction !== 'forward') return;
      cache || this.destroyTraverse(toLocation.name);
      if (destroy === DESTROY_ALL) {
        this.includeList = [];
      }
      this.handelDestroy(destroy);
      if (!toLocation.name) {
        console.warn('keep-router-view: Please pay attention to whether the router base path you configured is correct!');
      }
    },

    routerChangeEvent(params) {
      const { toLocation } = params.detail;
      toLocation.name && this.forward(toLocation.name);
    },

    componentDestroyEvent(params) {
      const { detail: destroy } = params;
      this.handelDestroy(destroy);
    },

    forward(name) {
      const { includeList, exclude } = this;
      if (exclude.includes(name)) return;
      if (includeList.includes(name)) {
        const index = includeList.indexOf(name);
        includeList.splice(index, 1);
      }
      if (includeList.length === this.max) {
        includeList.splice(0, 1);
      }
      includeList.push(name);
    },

    handelDestroy(destroy) {
      const { destroyTraverse } = this;
      if (typeof destroy === 'string' && destroy) {
        destroyTraverse(destroy);
      } else if (Array.isArray(destroy)) {
        destroy.forEach(name => destroyTraverse(name));
      }
    },

    destroyTraverse(name) {
      const { includeList } = this;
      for (let i = 0; i < includeList.length; i++) {
        if (name === includeList[i]) {
          includeList.splice(i, 1);
          break;
        }
      }
    },
  }
};
