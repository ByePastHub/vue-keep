export function useCallbacks() {
  let handlers = [];
  function add(name, handler) {
    const obj = typeof name === 'function' ? name : { name, handler };
    handlers.push(obj);
    return () => {
      const i = handlers.indexOf(obj);
      if (i > -1) {
        handlers.splice(i, 1);
      }
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add,
    list: () => handlers,
    reset,
  };
}
