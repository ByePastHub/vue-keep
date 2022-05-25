import extendRouter from './history/index';
import { beforeGuards } from './history/routerChange';
import KeepRouterView from './KeepRouterView';
import { destroy } from './destroy';

console.log('beforeGuards', beforeGuards);

export { KeepRouterView, extendRouter, destroy };
export let Vue;
export let Router;
export const beforeEach = beforeGuards.add;
export default {
  beforeEach: beforeEach,
  install(app, router) {
    Vue = app;
    Router = router;
    extendRouter(router);
    app.component('KeepRouterView', KeepRouterView);

    const keepRouter = { destroy, beforeEach };

    if (Number(app.version.slice(0, 1)) < 3) {
      app.prototype.$keepRouter = keepRouter;
    } else {
      app.config.globalProperties.$keepRouter = keepRouter;
    }
  },
};
