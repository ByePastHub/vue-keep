import { assign } from '../utils/index';

function resetComponentsName(router, isChildren) {
  const routerVersion = router.constructor.version?.replace(/\.(\d+)$/, '$1');

  if (routerVersion < 3.5) {
    console.error('vue-keep: vue-router version is lower than 3.5.0, please upgrade vue-router');
    return;
  }

  const routes = isChildren ? router : router.getRoutes();
  routes.forEach(function(route) {
    if (!route?.components?.default) return;
    if (route.children?.length > 0) {
      resetComponentsName(route.children, true);
    };

    if (typeof route.components.default === 'function') {
      const oldComponent = route.components.default;
      return (route.components.default = async() => {
        const newComponent = await oldComponent();
        newComponent.default.name = route.name;
        return newComponent;
      });
    };
    route.components.default.name = route.name;
  });
};

function getBaseOptions() {
  const extendList = ['push', 'replace', 'go', 'back', 'forward'];
  const obj = Object.create(null);

  return { extendList, obj };
}

function addRoute(router) {
  const routerPrototype = router.constructor.prototype;
  let oldAddRoute = router.addRoute;
  if (routerPrototype.addRoute) {
    oldAddRoute = routerPrototype.addRoute;
    return (routerPrototype.addRoute = newAddRoute);
  }
  router.addRoute = newAddRoute;
  let waiting = false;
  function newAddRoute() {
    oldAddRoute.call(this, ...arguments);
    if (!waiting) {
      waiting = true;
      Promise.resolve().then(() => {
        resetComponentsName(router);
      });

    }
  };
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
  addRoute(router);

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
  addRoute(router);

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
  router4x,
  resetComponentsName
};
