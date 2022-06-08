import { KEEP_BEFORE_ROUTE_CHANGE, KEEP_ROUTE_CHANGE } from '../constants';
import { assign, createCurrentLocation, getBase, getAbsolutePath, useCallbacks, getToLocation, toLocationResolve } from '../utils/index';
import { router3x, router4x } from './routerExtend';
export const beforeGuards = useCallbacks();

let $router;
let keepPosition = history.state?.keepPosition || history.length - 1;
let prevPosition = keepPosition;
let isEmptyJump;
let to;
let from = Object.create(null);
let isRouter4xPush;
let historyStack = JSON.parse(sessionStorage.getItem('keep_history_stack') || '[]');
let isPopstateBack;
let isBeforeRouterChange;
let beforeState = Object.create(null);

window.addEventListener('popstate', function(ev) {
  keepPosition = ev.state.keepPosition;
  const direction = keepPosition <= prevPosition ? 'back' : 'forward';
  const absolutePath = getAbsolutePath();
  direction === 'back' && (isPopstateBack = true);
  history.replaceState(history.state, absolutePath);
  prevPosition = keepPosition;
});

export function historyJumpExtend(router) {
  $router = router;
  const { back, forward, go, pushState, replaceState } = history.constructor.prototype;
  const historyJumpMethods = { back, forward, go, pushState, replaceState };
  const hijackList = Object.keys(historyJumpMethods);
  const absolutePath = getAbsolutePath();

  // 初始化页面state
  history.replaceState(buildState(keepPosition, 'replaceState'), absolutePath);
  // 手动提前更新一次
  routerChange('forward', 'popstate');
  isBeforeRouterChange = true;
  if (router.constructor.version) {
    // 如果是vue-router3.x版本才会手动触发，vue-router4.x内部会自己触发一次
    Promise.resolve().then(() => routerChange('forward', 'popstate'));
  }

  function getToLocation(position, method) {
    let toLocation;
    if (['go', 'forward', 'back'].includes(method)) {
      to = assign({}, to);
      to.path = historyStack[position];
    }
    if (to?.name || to?.path) {
      toLocation = toLocationResolve($router, to);
    }
    if (!toLocation) {
      const base = getBase($router);
      toLocation = { path: createCurrentLocation(base) };
    }
    return toLocation;
  }

  function buildState(position, method) {
    const toLocation = getToLocation(position, method);
    const path = toLocation.fullPath || toLocation.path;

    // 为了更新是否有前进最新状态
    let temporaryHistoryStack = Array.from(historyStack);
    if (['pushState', 'push'].includes(method)) {
      temporaryHistoryStack[position] = path;
      temporaryHistoryStack = historyStack.slice(0, position);
    }

    const current = (['forward', 'pushState', 'push'].includes(method)
      ? historyStack[position - 1]
      : historyStack[position]) || path;

    return {
      keepPosition,
      keepBack: historyStack[position - 1],
      keepCurrent: current,
      keepNext: path,
      keepForward: temporaryHistoryStack[position + 1],
    };
  }

  hijackList.forEach(key => hijackHistoryMethod(key));

  function hijackHistoryMethod(key) {
    history.constructor.prototype[key] = function() {
      prevPosition = keepPosition;
      // 如果空跳转
      if (isEmptyJump) return;
      switch (key) {
        case 'pushState':
        case 'forward':
          keepPosition = keepPosition + 1;
          break;
        case 'go':
          keepPosition = keepPosition + arguments[0];
          break;
        case 'back':
          keepPosition = keepPosition - 1;
      }

      // 如果是 'go', 'forward', 'back' 先更新 keepPosition，会再次执行一遍，使用 replaceState 方法
      if (['go', 'forward', 'back'].includes(key)) {
        historyJumpMethods[key].call(this, ...arguments);
        return;
      }

      const state = buildState(keepPosition, key);
      arguments[0] = assign(arguments[0], state);

      if (isPopstateBack && historyStack.length > history.length) {
        const positionOffset = Math.abs(historyStack.length - history.length - keepPosition);
        arguments[0] = assign(arguments[0], history.state, {
          keepBack: historyStack[positionOffset - 1]
        });
      }
      historyJumpMethods[key].call(this, ...arguments);
      if (['pushState', 'replaceState'].includes(key)) {
        // vue-router4.x push 方法会先执行 replaceState, 然后再次执行 pushState
        if (isRouter4xPush && key === 'replaceState') return;
        routerChange(isPopstateBack ? 'back' : 'forward', key);
        isBeforeRouterChange = false;
      }

      isPopstateBack = false;
      isRouter4xPush = false;
    };
  }

  function routerBeforeCallback(method, toLocation) {
    if (typeof toLocation === 'string') {
      toLocation = { path: toLocation };
    } else if (typeof toLocation === 'number') {
      toLocation = { delta: toLocation };
    }
    to = assign({ method }, toLocation);
    if (to.name === from?.name || to.path === from?.path) return;

    isBeforeRouterChange = true;
    method === 'push' && (isRouter4xPush = true);
    const isBack = method === 'back' || to.delta < 0;
    const direction = isBack ? 'back' : 'forward';
    let nextPosition;
    isPopstateBack = !!isBack;

    switch (method) {
      case 'go':
        nextPosition = keepPosition + to.delta;
        break;
      case 'replace':
        nextPosition = keepPosition;
        break;
      default:
        nextPosition = keepPosition + (isBack ? -1 : 1);
    }

    beforeState = buildState(nextPosition, method);
    beforeRouterChange(direction, method);
  }

  if (Object.prototype.hasOwnProperty.call(router, 'push')) {
    return router4x(router, routerBeforeCallback);
  }

  return router3x(router, routerBeforeCallback);
}

function triggerBeforeEach(mergeToLocation) {
  for (const guard of beforeGuards.list()) {
    if (mergeToLocation.name === guard.name) {
      guard.handler(mergeToLocation, from);
    } else if (typeof guard === 'function') {
      guard(mergeToLocation, from);
    }
  }
}

function dispatch(eventName, direction, toLocation = {}) {
  let triggerType;
  let state;
  if (eventName === KEEP_BEFORE_ROUTE_CHANGE) {
    triggerType = 'beforeChange';
    state = beforeState;
  } else {
    triggerType = 'change';
    state = history.state;
  }

  const mergeToLocation = assign({ direction, triggerType, state }, to, toLocation);
  if (eventName === KEEP_BEFORE_ROUTE_CHANGE) {
    triggerBeforeEach(mergeToLocation);
  }
  if (!isBeforeRouterChange) {
    triggerBeforeEach(mergeToLocation);
  }

  const options = Object.create(null);
  options.detail = {
    direction,
    destroy: mergeToLocation?.destroy,
    cache: mergeToLocation?.cache,
    toLocation: toLocation
  };

  const event = new CustomEvent(eventName, options);
  window.dispatchEvent(event);

  return mergeToLocation;
}

// 使用history跳转时会有beforeRouterChange
function beforeRouterChange(direction, method) {
  let _to = to;
  if (!to.path && !to.name) {
    const { keepPosition } = history.state;
    let index;
    switch (method) {
      case 'go':
        index = keepPosition + to.delta;
        break;
      case 'forward':
        index = keepPosition + 1;
        break;
      case 'back':
        index = keepPosition - 1;
        break;
      default:
        index = keepPosition;
    }
    _to = historyStack[index];
    if (!_to) {
      console.warn('vue-keep:', 'empty jump');
      isEmptyJump = true;
      new Promise(resolve => resolve()).then(() => (isEmptyJump = false));
      return;
    };
  }
  const toLocation = toLocationResolve($router, _to);

  dispatch(KEEP_BEFORE_ROUTE_CHANGE, direction, toLocation);
}

function routerChange(direction, method) {
  const toLocation = getToLocation($router);

  const mergeToLocation = dispatch(KEEP_ROUTE_CHANGE, direction, toLocation);
  handleHistoryStack(mergeToLocation, method);
  from = mergeToLocation;
  to = null;
}

function handleHistoryStack(toLocation, method) {
  const { keepPosition } = history.state;
  const path = toLocation.fullPath || toLocation.path;

  historyStack[keepPosition] = path;
  if (method === 'pushState') {
    historyStack.push(path);
    historyStack = historyStack.slice(0, keepPosition + 1);
  } else if (!history.state.keepBack) {
    historyStack = historyStack.map((path, index) => index < keepPosition ? null : path);
  }

  sessionStorage.setItem('keep_history_stack', JSON.stringify(historyStack));
}
