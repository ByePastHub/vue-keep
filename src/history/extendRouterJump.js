import { assign } from '../utils/index';

function getBaseOptions() {
  const extendList = ['push', 'replace', 'go', 'back', 'forward'];
  const obj = Object.create(null);

  return { extendList, obj };
}

let isJump;
function jump(router, callback) {
  return function({ type = 'push' } = {}) {
    isJump = true;
    if (typeof arguments[0] === 'number') {
      const params = arguments[1];
      if (typeof params !== 'object') return;
      type = params.type || 'go';
      callback(type, assign({ delta: arguments[0] || 0 }, params));
      return router[params.type || 'go'].call(this, arguments[0] || 0);
    }
    callback(type, arguments[0]);
    router[type].call(this, ...arguments);
    isJump = false;
  };
}

function router3x(router, callback) {
  const { extendList, obj } = getBaseOptions();
  const historyPrototype = router.history.constructor.prototype;
  const routerPrototype = router.constructor.prototype;

  routerPrototype.jump = jump(router, callback);
  extendList.forEach((key) => {
    obj[key] = historyPrototype[key] || (() => historyPrototype.go(1));
    historyPrototype[key] = function() {
      isJump || callback(key, ...arguments);
      new Promise(resolve => resolve())
        .then(() => obj[key].call(this, ...arguments));
    };
  });

  return router;
}

function router4x(router, callback) {
  const { extendList, obj } = getBaseOptions();

  router.jump = jump(router, callback);
  extendList.forEach((key) => {
    obj[key] = router[key];
    router[key] = function(to) {
      isJump || callback(key, ...arguments);
      obj[key](to);
    };
  });
}

export {
  router3x,
  router4x
};
