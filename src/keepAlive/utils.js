const _toString = Object.prototype.toString;

export function isDef(v) {
  return v !== undefined && v !== null;
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]';
}

export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

export function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory;
}

export function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c;
      }
    }
  }
}



// function beforeRouterChange(direction, method) {
//   console.log('beforeRouterChange', method);
//   let toLocation;
//   if (to.path || to.name) {
//     toLocation = $router.resolve(to);
//   } else {
//     const { keepPosition } = history.state;
//     const index = method === 'go' ? keepPosition + to.delta : keepPosition;
//     const path = historyStack[index - 1];
//     if (!path) return;
//     toLocation = $router.resolve(path);
//   }

//   if (toLocation.resolved) {
//     toLocation = toLocation.resolved;
//   }
//   const mergeToLocation = assign({ direction }, to, toLocation);
//   for (const guard of beforeGuards.list()) {
//     guard(mergeToLocation, from);
//   }
//   const options = Object.create(null);
//   options.detail = {
//     direction,
//     destroy: mergeToLocation?.destroy,
//     cache: mergeToLocation?.cache,
//     toLocation
//   };
//   const beforeRoutrChangeEvent = new CustomEvent(KEEP_BEFORE_ROUTE_CHANGE, options);
//   window.dispatchEvent(beforeRoutrChangeEvent);
//   // from = mergeToLocation;
//   // to = null;
// }

// function routerChange(direction, method) {
//   const base = getBase($router);
//   const path = createCurrentLocation(base);
//   let toLocation = $router.resolve(path);

//   if (toLocation.resolved) {
//     toLocation = toLocation.resolved;
//   }
//   handleHistoryStack(direction, toLocation, method);
//   const mergeToLocation = assign({ direction }, to, toLocation);
//   if (!isNotTriggerBeforeEach) {
//     for (const guard of beforeGuards.list()) {
//       guard(mergeToLocation, from);
//     }
//   }
//   const options = Object.create(null);
//   options.detail = {
//     direction,
//     destroy: mergeToLocation?.destroy,
//     cache: mergeToLocation?.cache,
//     toLocation
//   };
//   // const beforeRoutrChangeEvent = new CustomEvent(KEEP_BEFORE_ROUTE_CHANGE, options);
//   // window.dispatchEvent(beforeRoutrChangeEvent);
//   const routerChangeEvent = new CustomEvent(KEEP_ROUTE_CHANGE, options);
//   window.dispatchEvent(routerChangeEvent);
//   from = mergeToLocation;
//   to = null;
//   isNotTriggerBeforeEach = false;
// }


