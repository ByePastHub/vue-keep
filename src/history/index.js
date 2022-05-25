import { historyJumpExtend } from './routerChange';


function resetComponentsName(router, isChildren) {
  const routerVersion = router.constructor.version?.replace(/\.(\d+)$/, '$1');

  if (routerVersion < 3.5) {
    console.error('vue-keep-router-view: vue-router version is lower than 3.5.0, please upgrade vue-router');
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

export default (router) => {
  console.log('_router', router);
  resetComponentsName(router);
  historyJumpExtend(router);

  // historyJump(router);

  // if (Object.prototype.hasOwnProperty.call(router, 'push')) {
  //   return withRouter3x(router);
  // }

  // return withRouter2x(router);
};
