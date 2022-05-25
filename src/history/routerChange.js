import { KEEP_BEFORE_ROUTE_CHANGE, KEEP_ROUTE_CHANGE } from '../constants';
import { assign, createCurrentLocation, getBase, getAbsolutePath, useCallbacks, getToLocation, limitMaxPosition } from '../utils/index';
import { router3x, router4x } from './extendRouterJump';
export const beforeGuards = useCallbacks();

let $router;
let keepPosition = history.state?.keepPosition || history.length - 1;
let prevPosition = keepPosition;
let isEmptyJump;
let to;
let from = Object.create(null);
let isRouter4xPush;
let isNotTriggerBeforeEach;
let historyStack = JSON.parse(sessionStorage.getItem('keep_history_stack') || '[]');

window.addEventListener('popstate', async function(ev) {
  keepPosition = ev.state.keepPosition;
  const direction = keepPosition <= prevPosition ? 'back' : 'forward';
  const absolutePath = getAbsolutePath();
  history.replaceState(history.state, absolutePath);
  routerChange(direction, 'popstate');
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
  hijackList.forEach(key => {
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
      let toLocation;
      if (to?.name || to?.path) {
        toLocation = $router.resolve(to);
      }
      if (!toLocation) {
        const base = getBase($router);
        toLocation = { path: createCurrentLocation(base) };
      }
      if (!(['go', 'forward', 'back'].includes(key))) {
        keepPosition = limitMaxPosition(keepPosition);

        const current = (['forward', 'pushState'].includes(key)
          ? historyStack[keepPosition - 2]
          : historyStack[keepPosition - 1]) || toLocation.path;

        const state = {
          keepPosition,
          keepBack: historyStack[keepPosition - 2],
          keepCurrent: current,
          keepNext: toLocation.path,
          keepForward: historyStack[keepPosition],
        };
        arguments[0] = assign(arguments[0], state);
      }
      historyJumpMethods[key].call(this, ...arguments);
      if (['pushState', 'replaceState'].includes(key)) {
        // vue-router4.x push 方法会先执行 replaceState, 然后再次执行 pushState
        if (isRouter4xPush && key === 'replaceState') return;
        routerChange('forward', key);
      }

      isRouter4xPush = false;
    };
  });

  function routerBeforeCallback(method, toLocation) {
    isNotTriggerBeforeEach = true;
    method === 'push' && (isRouter4xPush = true);
    if (typeof toLocation === 'string') {
      toLocation = { path: toLocation };
    }
    if (typeof toLocation === 'number') {
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

function dispatch(eventName, direction, toLocation) {
  if (toLocation.resolved) {
    toLocation = toLocation.resolved;
  }

  const mergeToLocation = assign({ direction, triggerType: eventName }, to, toLocation);
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
    toLocation
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
    console.log(to);
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
    _to = historyStack[index - 1];
    console.log('path', keepPosition, _to);
    if (!_to) {
      isEmptyJump = true;
      return;
    };
  }
  const toLocation = $router.resolve(_to);
  dispatch(KEEP_BEFORE_ROUTE_CHANGE, direction, toLocation);
}

function routerChange(direction, method) {
  const toLocation = getToLocation($router);

  const mergeToLocation = dispatch(KEEP_ROUTE_CHANGE, direction, toLocation);
  handleHistoryStack(mergeToLocation, method);
  from = mergeToLocation;
  to = null;
  isNotTriggerBeforeEach = false;
  isEmptyJump = false;
}

function handleHistoryStack(toLocation, method) {
  const { keepPosition } = history.state;
  const stackLength = historyStack.length;

  if (stackLength === 0) {
    historyStack[0] = toLocation.path;
  } else if (method === 'replaceState') {
    const length = keepPosition - 1;
    historyStack[length] = toLocation.path;
  } else if (method === 'pushState') {
    const maxPosition = limitMaxPosition(keepPosition);
    historyStack.push(toLocation.path);
    historyStack = historyStack.slice(0, maxPosition);
  }

  sessionStorage.setItem('keep_history_stack', JSON.stringify(historyStack));

  console.log('historyStack', keepPosition, history.length, method, historyStack);
}
