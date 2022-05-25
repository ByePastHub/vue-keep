import { EXTEND_ROUTER_JUMP_LIST } from '../constants';

function getBaseOptions() {
  const extendList = EXTEND_ROUTER_JUMP_LIST;
  const obj = Object.create(null);

  return { extendList, obj };
}


function router3x(router, callback) {
  const { extendList, obj } = getBaseOptions();
  const historyPrototype = router.history.constructor.prototype;
  let routerMethod;
  extendList.forEach((key) => {
    obj[key] = historyPrototype[key] || (() => historyPrototype.go(1));
    historyPrototype[key] = function() {
      routerMethod = key;
      dispatch.call(this, ...arguments);
    };
  });

  function dispatch() {
    callback(routerMethod, ...arguments);

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(obj[routerMethod].call(this, ...arguments));
      }, 0);
    });
  }

  return router;
}

function router4x(router, callback) {
  const { extendList, obj } = getBaseOptions();

  extendList.forEach((key) => {
    obj[key] = router[key];
    router[key] = function(to) {
      callback(key, ...arguments);
      return obj[key](to);
    };
  });
}

export {
  router3x,
  router4x
};
