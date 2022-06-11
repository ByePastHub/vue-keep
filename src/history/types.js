const replaceState = 'replaceState';
const pushState = 'pushState';
const push = 'push';
const replace = 'replace';
const forward = 'forward';
const go = 'go';
const back = 'back';

export const POPSTATE = 'popstate';

export const RouterJumpMethods = {
  push,
  replace,
  go,
  forward,
  back,
};

export const HistoryJumpMethods = {
  replaceState,
  pushState,
  go,
  forward,
  back
};

export const NavigationDirection = {
  back,
  forward
};
