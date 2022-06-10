import { KEEP_BEFORE_ROUTE_CHANGE, KEEP_ROUTE_CHANGE } from '../constants';
import { assign, createCurrentLocation, getBase, getAbsolutePath, useCallbacks, getToLocation, toLocationResolve } from '../utils/index';
import { router3x, router4x } from './routerExtend';
import { POPSTATE, RouterJumpMethods, HistoryJumpMethods, NavigationDirection } from './types.js';
import { historyRecord, handleHistoryRecord } from './historyRecord';
export const beforeGuards = useCallbacks();

let $router;
let keepPosition = history.state?.keepPosition || history.length - 1;
let prevPosition = keepPosition;
let isEmptyJump;
let to;
let from = Object.create(null);
let isRouter4xPush;
let isPopstateBack;
let isBeforeRouterChange;
let beforeState = Object.create(null);

window.addEventListener(POPSTATE, function(ev) {
  keepPosition = ev.state.keepPosition;
  const direction = keepPosition <= prevPosition ? NavigationDirection.back : NavigationDirection.forward;
  const absolutePath = getAbsolutePath();
  direction === NavigationDirection.back && (isPopstateBack = true);
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
  history.replaceState(buildState(keepPosition, HistoryJumpMethods.replaceState), absolutePath);
  // 手动提前更新一次
  routerChange(NavigationDirection.forward, POPSTATE);
  isBeforeRouterChange = true;
  if (router.constructor.version) {
    // 如果是vue-router3.x版本才会手动触发，vue-router4.x内部会自己触发一次
    Promise.resolve().then(() => routerChange(NavigationDirection.forward, POPSTATE));
  }

  function getToLocation(position, method) {
    let toLocation;
    if ([RouterJumpMethods.go, RouterJumpMethods.forward, RouterJumpMethods.back].includes(method)) {
      to = assign({}, to);
      to.path = historyRecord[position];
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

  function buildState(position, method, isBack) {
    const toLocation = getToLocation(position, method);
    const path = toLocation.fullPath || toLocation.path;

    // 为了更新是否有前进最新状态
    let temporaryHistoryStack = Array.from(historyRecord);
    if ([HistoryJumpMethods.pushState, RouterJumpMethods.push].includes(method)) {
      temporaryHistoryStack[position] = path;
      temporaryHistoryStack = historyRecord.slice(0, position);
    }

    const current = ([RouterJumpMethods.forward, HistoryJumpMethods.pushState, RouterJumpMethods.push].includes(method)
      ? historyRecord[position - 1]
      : historyRecord[position]) || path;

    let keepBack = historyRecord[position - 1];

    // 如果是返回，并且历史记录已经超过浏览器最大的历史记录后
    if (isPopstateBack && historyRecord.length > history.length) {
      if (method === RouterJumpMethods.replace) {
        const maxBrowserHistory = historyRecord.map((path, index) => index < keepPosition ? null : path);
        keepBack = maxBrowserHistory[position - 1];
      }

      const positionOffset = Math.abs(historyRecord.length - history.length - keepPosition);
      !historyRecord[positionOffset - 1] && (keepBack = null);
    }

    return {
      keepPosition: position,
      keepBack,
      keepCurrent: current,
      keepNext: path,
      keepForward: temporaryHistoryStack[position + 1],
      keepReplace: !!beforeState?.keepReplace,
      keepDirection: isBack ? NavigationDirection.back : NavigationDirection.forward
    };
  }

  hijackList.forEach(key => hijackHistoryMethod(key));

  function hijackHistoryMethod(key) {
    history.constructor.prototype[key] = function() {
      prevPosition = keepPosition;
      // 如果空跳转
      if (isEmptyJump) return;
      switch (key) {
        case HistoryJumpMethods.pushState:
        case RouterJumpMethods.forward:
          keepPosition = keepPosition + 1;
          break;
        case RouterJumpMethods.go:
          keepPosition = keepPosition + arguments[0];
          break;
        case RouterJumpMethods.back:
          keepPosition = keepPosition - 1;
      }

      // 如果是 'go', 'forward', 'back' 先更新 keepPosition，会再次执行一遍，使用 replaceState 方法
      if ([RouterJumpMethods.go, RouterJumpMethods.forward, RouterJumpMethods.back].includes(key)) {
        historyJumpMethods[key].call(this, ...arguments);
        return;
      }

      const state = buildState(keepPosition, key, isPopstateBack);
      arguments[0] = assign(arguments[0], state);

      historyJumpMethods[key].call(this, ...arguments);
      if ([HistoryJumpMethods.pushState, HistoryJumpMethods.replaceState].includes(key)) {
        // vue-router4.x push 方法会先执行 replaceState, 然后再次执行 pushState
        if (isRouter4xPush && key === HistoryJumpMethods.replaceState) return;
        routerChange(isPopstateBack ? NavigationDirection.back : NavigationDirection.forward, key);
        isBeforeRouterChange = false;
        beforeState = null;
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
    const isBack = method === RouterJumpMethods.back || to.delta < 0;
    const direction = isBack ? NavigationDirection.back : NavigationDirection.forward;
    let nextPosition;
    isPopstateBack = !!isBack;

    switch (method) {
      case RouterJumpMethods.go:
        nextPosition = keepPosition + to.delta;
        break;
      case RouterJumpMethods.replace:
        nextPosition = keepPosition;
        break;
      default:
        nextPosition = keepPosition + (isBack ? -1 : 1);
    }

    beforeState = buildState(nextPosition, method, isBack);
    method === RouterJumpMethods.push && (isRouter4xPush = true);
    method === RouterJumpMethods.replace && (beforeState.keepReplace = true);
    beforeRouterChange(direction, method);
  }

  if (Object.prototype.hasOwnProperty.call(router, RouterJumpMethods.push)) {
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
    _to = historyRecord[index];
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
  handleHistoryRecord(mergeToLocation, method);
  from = mergeToLocation;
  to = null;
}
