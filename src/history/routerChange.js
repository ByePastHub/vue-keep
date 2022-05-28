import { KEEP_BEFORE_ROUTE_CHANGE, KEEP_ROUTE_CHANGE } from '../constants';
import { assign, createCurrentLocation, getBase, getAbsolutePath, useCallbacks, getToLocation, toLocationResolve } from '../utils/index';
import { router3x, router4x } from './extendRouterJump';
export const beforeGuards = useCallbacks();

let $router;
let keepPosition = history.state?.keepPosition || 0;
let prevPosition = keepPosition;
let isEmptyJump;
let to;
let from = Object.create(null);
let isRouter4xPush;
let isNotTriggerBeforeEach;
let historyStack = JSON.parse(sessionStorage.getItem('keep_history_stack') || '[]');
let isPopstateBack;


window.addEventListener('popstate', function(ev) {
  // 手动触发时，进入 history 劫持，如果不 return，会触发2次 routerChange
  if (isNotTriggerBeforeEach) {
    isNotTriggerBeforeEach = false;
    return;
  };
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

  history.replaceState({ keepPosition }, absolutePath);
  // 如果是vue-router3.x版本才会手动触发，vue-router4.x内部会自己触发一次
  if (router.constructor.version) {
    new Promise(resolve => resolve())
      .then(() => routerChange('forward', 'popstate'));
  }

  function getToLocation() {
    let toLocation;
    if (to?.name || to?.path) {
      toLocation = toLocationResolve($router, to);
    }
    if (!toLocation) {
      const base = getBase($router);
      toLocation = { path: createCurrentLocation(base) };
    }
    return toLocation;
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
      }
      const toLocation = getToLocation();
      const path = toLocation.fullPath || toLocation.path;

      // 为了更新是否有前进最新状态
      let temporaryHistoryStack = Array.from(historyStack);
      if (key === 'pushState') {
        temporaryHistoryStack[keepPosition] = path;
        temporaryHistoryStack = historyStack.slice(0, keepPosition);
      }

      if (!(['go', 'forward', 'back'].includes(key))) {
        const current = (['forward', 'pushState'].includes(key)
          ? historyStack[keepPosition - 1]
          : historyStack[keepPosition]) || path;

        const state = {
          keepPosition,
          keepBack: historyStack[keepPosition - 1],
          keepCurrent: current,
          keepNext: path,
          keepForward: temporaryHistoryStack[keepPosition + 1],
        };
        arguments[0] = assign(arguments[0], state);
      }

      if (isPopstateBack && historyStack.length > history.length) {
        const positionOffset = Math.abs(historyStack.length - history.length - keepPosition);
        // console.log('positionOffset', positionOffset, historyStack[positionOffset - 1]);
        arguments[0] = assign(arguments[0], history.state, {
          keepBack: historyStack[positionOffset - 1]
        });
        isPopstateBack = false;
      }
      historyJumpMethods[key].call(this, ...arguments);
      if (['pushState', 'replaceState'].includes(key)) {
        // vue-router4.x push 方法会先执行 replaceState, 然后再次执行 pushState
        if (isRouter4xPush && key === 'replaceState') return;
        routerChange('forward', key);
      } else {
        routerChange(isPopstateBack ? 'back' : 'forward', 'popstate');
      }

      // console.log({ keepPosition: history.state.keepPosition, keepBack: history.state.keepBack, keepCurrent: history.state.keepCurrent, keepNext: history.state.keepNext, keepForward: history.state.keepForward });
      isRouter4xPush = false;
    };
  }

  function routerBeforeCallback(method, toLocation) {
    isNotTriggerBeforeEach = true;
    method === 'push' && (isRouter4xPush = true);
    if (typeof toLocation === 'string') {
      toLocation = { path: toLocation };
    } else if (typeof toLocation === 'number') {
      toLocation = { delta: toLocation };
    }
    to = assign({ method }, toLocation);
    beforeRouterChange('forward', method);
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
  const mergeToLocation = assign({ direction, triggerType: eventName, state: history.state }, to, toLocation);
  if (eventName === KEEP_BEFORE_ROUTE_CHANGE) {
    triggerBeforeEach(mergeToLocation);
  }
  if (!isNotTriggerBeforeEach) {
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
  setTimeout(() => (isNotTriggerBeforeEach = false), 0);
}

function handleHistoryStack(toLocation, method) {
  const { keepPosition } = history.state;
  const stackLength = historyStack.length;
  const path = toLocation.fullPath || toLocation.path;

  if (stackLength === 0) {
    historyStack[0] = path;
  } else if (method === 'replaceState') {
    historyStack[keepPosition] = path;
  } else if (method === 'pushState') {
    historyStack[keepPosition] = path;
    historyStack.push(path);
    historyStack = historyStack.slice(0, keepPosition + 1);
  }

  sessionStorage.setItem('keep_history_stack', JSON.stringify(historyStack));

  // console.log('historyStack', keepPosition, history.length, method, historyStack);
}
