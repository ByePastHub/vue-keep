import { historyJumpExtend } from './routerChange';
import { resetComponentsName } from './routerExtend';



export default (router) => {
  resetComponentsName(router);
  historyJumpExtend(router);
};
