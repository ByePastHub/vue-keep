import * as Vue$1 from 'vue';

var KEEP_BEFORE_ROUTE_CHANGE = 'KEEP_BEFORE_ROUTE_CHANGE';
var KEEP_ROUTE_CHANGE = 'KEEP_ROUTE_CHANGE';
var KEEP_COMPONENT_DESTROY = 'KEEP_COMPONENT_DESTROY';
var DESTROY_ALL = 'ALL';

function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function useCallbacks() {
  var handlers = [];
  function add(name, handler) {
    var obj = typeof name === 'function' ? name : {
      name: name,
      handler: handler
    };
    handlers.push(obj);
    return function () {
      var i = handlers.indexOf(obj);
      if (i > -1) {
        handlers.splice(i, 1);
      }
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add: add,
    list: function list() {
      return handlers;
    },
    reset: reset
  };
}

function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase())) return pathname;
  return pathname.slice(base.length) || '/';
}
function createCurrentLocation(base) {
  var _location = location,
      pathname = _location.pathname,
      search = _location.search,
      hash = _location.hash;
  var hashPos = base.indexOf('#');
  if (hashPos > -1) {
    var slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    var pathFromHash = hash.slice(slicePos);
    if (pathFromHash[0] !== '/') {
      pathFromHash = '/' + pathFromHash;
    }
    return stripBase(pathFromHash, '');
  }
  var path = stripBase(pathname, base);
  return (path + search + hash).replace(/^\/#/, '');
}
function getAbsolutePath() {
  var _window$location = window.location,
      protocol = _window$location.protocol,
      host = _window$location.host,
      href = _window$location.href;
  var protocolAndPath = protocol + '//' + host;
  return href.replace(protocolAndPath, '');
}
function getBase(router) {
  var _router$options$histo;
  var base;
  if (router.mode) {
    base = router.options.base;
    return base;
  }
  base = (_router$options$histo = router.options.history) === null || _router$options$histo === void 0 ? void 0 : _router$options$histo.base;
  if (!base && location.hash) {
    base = location.pathname;
  }
  return base || '/';
}
function toLocationResolve(router, to) {
  var toLocation = router.resolve(to);
  if (toLocation.resolved) {
    toLocation = toLocation.resolved;
  }
  return toLocation;
}
function getToLocation(router) {
  var base = getBase(router);
  var path = createCurrentLocation(base);
  var toLocation = toLocationResolve(router, path);
  return toLocation;
}

var assign = Object.assign;

function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray$1(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread();
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

var runtime = {exports: {}};

(function (module) {
var runtime = (function (exports) {
  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1;
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);
    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }
  exports.wrap = wrap;
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }
  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    IteratorPrototype = NativeIteratorPrototype;
  }
  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }
  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };
  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };
  exports.awrap = function(arg) {
    return { __await: arg };
  };
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }
        return PromiseImpl.resolve(value).then(function(unwrapped) {
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          return invoke("throw", error, resolve, reject);
        });
      }
    }
    var previousPromise;
    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }
      return previousPromise =
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }
    this._invoke = enqueue;
  }
  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );
    return exports.isGeneratorFunction(outerFn)
      ? iter
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };
  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }
      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }
        return doneResult();
      }
      context.method = method;
      context.arg = arg;
      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if (context.method === "next") {
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }
          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }
        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;
          if (record.arg === ContinueSentinel) {
            continue;
          }
          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      context.delegate = null;
      if (context.method === "throw") {
        if (delegate.iterator["return"]) {
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);
          if (context.method === "throw") {
            return ContinueSentinel;
          }
        }
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }
      return ContinueSentinel;
    }
    var record = tryCatch(method, delegate.iterator, context.arg);
    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }
    var info = record.arg;
    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }
    if (info.done) {
      context[delegate.resultName] = info.value;
      context.next = delegate.nextLoc;
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }
    } else {
      return info;
    }
    context.delegate = null;
    return ContinueSentinel;
  }
  defineIteratorMethods(Gp);
  define(Gp, toStringTagSymbol, "Generator");
  define(Gp, iteratorSymbol, function() {
    return this;
  });
  define(Gp, "toString", function() {
    return "[object Generator]";
  });
  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };
    if (1 in locs) {
      entry.catchLoc = locs[1];
    }
    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }
    this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }
  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }
      next.done = true;
      return next;
    };
  };
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }
      if (typeof iterable.next === "function") {
        return iterable;
      }
      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }
          next.value = undefined$1;
          next.done = true;
          return next;
        };
        return next.next = next;
      }
    }
    return { next: doneResult };
  }
  exports.values = values;
  function doneResult() {
    return { value: undefined$1, done: true };
  }
  Context.prototype = {
    constructor: Context,
    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined$1;
      this.tryEntries.forEach(resetTryEntry);
      if (!skipTempReset) {
        for (var name in this) {
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },
    stop: function() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }
      return this.rval;
    },
    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }
      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        if (caught) {
          context.method = "next";
          context.arg = undefined$1;
        }
        return !! caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;
        if (entry.tryLoc === "root") {
          return handle("end");
        }
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        finallyEntry = null;
      }
      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;
      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }
      return this.complete(record);
    },
    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }
      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
      return ContinueSentinel;
    },
    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };
      if (this.method === "next") {
        this.arg = undefined$1;
      }
      return ContinueSentinel;
    }
  };
  return exports;
}(
  module.exports 
));
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
}(runtime));

var regenerator = runtime.exports;

function resetComponentsName(router, isChildren) {
  var _router$constructor$v;
  var routerVersion = (_router$constructor$v = router.constructor.version) === null || _router$constructor$v === void 0 ? void 0 : _router$constructor$v.replace(/\.(\d+)$/, '$1');
  if (routerVersion < 3.5) {
    console.error('vue-keep: vue-router version is lower than 3.5.0, please upgrade vue-router');
    return;
  }
  var routes = isChildren ? router : router.getRoutes();
  routes.forEach(function (route) {
    var _route$components, _route$children;
    if (!(route !== null && route !== void 0 && (_route$components = route.components) !== null && _route$components !== void 0 && _route$components.default)) return;
    if (((_route$children = route.children) === null || _route$children === void 0 ? void 0 : _route$children.length) > 0) {
      resetComponentsName(route.children, true);
    }
    if (typeof route.components.default === 'function') {
      var oldComponent = route.components.default;
      return route.components.default = _asyncToGenerator( regenerator.mark(function _callee() {
        var newComponent;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return oldComponent();
              case 2:
                newComponent = _context.sent;
                newComponent.default.name = route.name;
                return _context.abrupt("return", newComponent);
              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    }
    route.components.default.name = route.name;
  });
}
function getBaseOptions() {
  var extendList = ['push', 'replace', 'go', 'back', 'forward'];
  var obj = Object.create(null);
  return {
    extendList: extendList,
    obj: obj
  };
}
function addRoute(router) {
  var routerPrototype = router.constructor.prototype;
  var oldAddRoute = router.addRoute;
  if (routerPrototype.addRoute) {
    oldAddRoute = routerPrototype.addRoute;
    return routerPrototype.addRoute = newAddRoute;
  }
  router.addRoute = newAddRoute;
  var waiting = false;
  function newAddRoute() {
    var _oldAddRoute;
    (_oldAddRoute = oldAddRoute).call.apply(_oldAddRoute, [this].concat(Array.prototype.slice.call(arguments)));
    if (!waiting) {
      waiting = true;
      Promise.resolve().then(function () {
        resetComponentsName(router);
      });
    }
  }
}
var isJump;
function jump(router, callback) {
  return function () {
    var _router$type;
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$type = _ref2.type,
        type = _ref2$type === void 0 ? 'push' : _ref2$type;
    isJump = true;
    if (typeof arguments[0] === 'number') {
      var params = arguments[1];
      if (_typeof(params) !== 'object') return;
      type = params.type || 'go';
      callback(type, assign({
        delta: arguments[0] || 0
      }, params));
      router[params.type || 'go'].call(this, arguments[0] || 0);
      return isJump = false;
    }
    callback(type, arguments[0]);
    (_router$type = router[type]).call.apply(_router$type, [this].concat(Array.prototype.slice.call(arguments)));
    isJump = false;
  };
}
function router3x(router, callback) {
  var _getBaseOptions = getBaseOptions(),
      extendList = _getBaseOptions.extendList,
      obj = _getBaseOptions.obj;
  var historyPrototype = router.history.constructor.prototype;
  var routerPrototype = router.constructor.prototype;
  addRoute(router);
  routerPrototype.jump = jump(router, callback);
  extendList.forEach(function (key) {
    obj[key] = historyPrototype[key] || function () {
      return historyPrototype.go(1);
    };
    historyPrototype[key] = function () {
      var _arguments = arguments,
          _this = this;
      isJump || callback.apply(void 0, [key].concat(Array.prototype.slice.call(arguments)));
      new Promise(function (resolve) {
        return resolve();
      }).then(function () {
        var _obj$key;
        return (_obj$key = obj[key]).call.apply(_obj$key, [_this].concat(_toConsumableArray(_arguments)));
      });
    };
  });
  return router;
}
function router4x(router, callback) {
  var _getBaseOptions2 = getBaseOptions(),
      extendList = _getBaseOptions2.extendList,
      obj = _getBaseOptions2.obj;
  addRoute(router);
  router.jump = jump(router, callback);
  extendList.forEach(function (key) {
    obj[key] = router[key];
    router[key] = function (to) {
      isJump || callback.apply(void 0, [key].concat(Array.prototype.slice.call(arguments)));
      obj[key](to);
    };
  });
}

var _history$state;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var beforeGuards = useCallbacks();
var $router;
var keepPosition = ((_history$state = history.state) === null || _history$state === void 0 ? void 0 : _history$state.keepPosition) || history.length - 1;
var prevPosition = keepPosition;
var isEmptyJump;
var to;
var from = Object.create(null);
var isRouter4xPush;
var historyStack = JSON.parse(sessionStorage.getItem('keep_history_stack') || '[]');
var isPopstateBack;
var isBeforeRouterChange;
var beforeState = Object.create(null);
window.addEventListener('popstate', function (ev) {
  keepPosition = ev.state.keepPosition;
  var direction = keepPosition <= prevPosition ? 'back' : 'forward';
  var absolutePath = getAbsolutePath();
  direction === 'back' && (isPopstateBack = true);
  history.replaceState(history.state, absolutePath);
  prevPosition = keepPosition;
});
function historyJumpExtend(router) {
  $router = router;
  var _history$constructor$ = history.constructor.prototype,
      back = _history$constructor$.back,
      forward = _history$constructor$.forward,
      go = _history$constructor$.go,
      pushState = _history$constructor$.pushState,
      replaceState = _history$constructor$.replaceState;
  var historyJumpMethods = {
    back: back,
    forward: forward,
    go: go,
    pushState: pushState,
    replaceState: replaceState
  };
  var hijackList = Object.keys(historyJumpMethods);
  var absolutePath = getAbsolutePath();
  history.replaceState(buildState(keepPosition, 'replaceState'), absolutePath);
  routerChange('forward', 'popstate');
  isBeforeRouterChange = true;
  if (router.constructor.version) {
    Promise.resolve().then(function () {
      return routerChange('forward', 'popstate');
    });
  }
  function getToLocation(position, method) {
    var _to2, _to3;
    var toLocation;
    if (['go', 'forward', 'back'].includes(method)) {
      to = assign({}, to);
      to.path = historyStack[position];
    }
    if ((_to2 = to) !== null && _to2 !== void 0 && _to2.name || (_to3 = to) !== null && _to3 !== void 0 && _to3.path) {
      toLocation = toLocationResolve($router, to);
    }
    if (!toLocation) {
      var base = getBase($router);
      toLocation = {
        path: createCurrentLocation(base)
      };
    }
    return toLocation;
  }
  function buildState(position, method) {
    var toLocation = getToLocation(position, method);
    var path = toLocation.fullPath || toLocation.path;
    var temporaryHistoryStack = Array.from(historyStack);
    if (['pushState', 'push'].includes(method)) {
      temporaryHistoryStack[position] = path;
      temporaryHistoryStack = historyStack.slice(0, position);
    }
    var current = (['forward', 'pushState', 'push', 'replace'].includes(method) ? historyStack[position - 1] : historyStack[position]) || path;
    return {
      keepPosition: keepPosition,
      keepBack: historyStack[position - 1],
      keepCurrent: current,
      keepNext: path,
      keepForward: temporaryHistoryStack[position + 1]
    };
  }
  hijackList.forEach(function (key) {
    return hijackHistoryMethod(key);
  });
  function hijackHistoryMethod(key) {
    history.constructor.prototype[key] = function () {
      var _historyJumpMethods$k2;
      prevPosition = keepPosition;
      if (isEmptyJump) return;
      switch (key) {
        case 'pushState':
        case 'forward':
          keepPosition = keepPosition + 1;
          break;
        case 'go':
          keepPosition = keepPosition + arguments[0];
          break;
        case 'back':
          keepPosition = keepPosition - 1;
      }
      if (['go', 'forward', 'back'].includes(key)) {
        var _historyJumpMethods$k;
        (_historyJumpMethods$k = historyJumpMethods[key]).call.apply(_historyJumpMethods$k, [this].concat(Array.prototype.slice.call(arguments)));
        return;
      }
      var state = buildState(keepPosition, key);
      arguments[0] = assign(arguments[0], state);
      if (isPopstateBack && historyStack.length > history.length) {
        var positionOffset = Math.abs(historyStack.length - history.length - keepPosition);
        arguments[0] = assign(arguments[0], history.state, {
          keepBack: historyStack[positionOffset - 1]
        });
      }
      (_historyJumpMethods$k2 = historyJumpMethods[key]).call.apply(_historyJumpMethods$k2, [this].concat(Array.prototype.slice.call(arguments)));
      if (['pushState', 'replaceState'].includes(key)) {
        if (isRouter4xPush && key === 'replaceState') return;
        routerChange(isPopstateBack ? 'back' : 'forward', key);
        isBeforeRouterChange = false;
      }
      isPopstateBack = false;
      isRouter4xPush = false;
    };
  }
  function routerBeforeCallback(method, toLocation) {
    var _from, _from2;
    if (typeof toLocation === 'string') {
      toLocation = {
        path: toLocation
      };
    } else if (typeof toLocation === 'number') {
      toLocation = {
        delta: toLocation
      };
    }
    to = assign({
      method: method
    }, toLocation);
    if (to.name === ((_from = from) === null || _from === void 0 ? void 0 : _from.name) || to.path === ((_from2 = from) === null || _from2 === void 0 ? void 0 : _from2.path)) return;
    isBeforeRouterChange = true;
    method === 'push' && (isRouter4xPush = true);
    var isBack = method === 'back' || to.delta < 0;
    var direction = isBack ? 'back' : 'forward';
    isPopstateBack = !!isBack;
    var nextPosition = method === 'go' ? keepPosition + to.delta : keepPosition + (isBack ? -1 : 1);
    beforeState = buildState(nextPosition, method);
    beforeRouterChange(direction, method);
  }
  if (Object.prototype.hasOwnProperty.call(router, 'push')) {
    return router4x(router, routerBeforeCallback);
  }
  return router3x(router, routerBeforeCallback);
}
function triggerBeforeEach(mergeToLocation) {
  var _iterator = _createForOfIteratorHelper(beforeGuards.list()),
      _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var guard = _step.value;
      if (mergeToLocation.name === guard.name) {
        guard.handler(mergeToLocation, from);
      } else if (typeof guard === 'function') {
        guard(mergeToLocation, from);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function dispatch(eventName, direction) {
  var toLocation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var triggerType;
  var state;
  if (eventName === KEEP_BEFORE_ROUTE_CHANGE) {
    triggerType = 'beforeChange';
    state = beforeState;
  } else {
    triggerType = 'change';
    state = history.state;
  }
  var mergeToLocation = assign({
    direction: direction,
    triggerType: triggerType,
    state: state
  }, to, toLocation);
  if (eventName === KEEP_BEFORE_ROUTE_CHANGE) {
    triggerBeforeEach(mergeToLocation);
  }
  if (!isBeforeRouterChange) {
    triggerBeforeEach(mergeToLocation);
  }
  var options = Object.create(null);
  options.detail = {
    direction: direction,
    destroy: mergeToLocation === null || mergeToLocation === void 0 ? void 0 : mergeToLocation.destroy,
    cache: mergeToLocation === null || mergeToLocation === void 0 ? void 0 : mergeToLocation.cache,
    toLocation: toLocation
  };
  var event = new CustomEvent(eventName, options);
  window.dispatchEvent(event);
  return mergeToLocation;
}
function beforeRouterChange(direction, method) {
  var _to = to;
  if (!to.path && !to.name) {
    var _keepPosition = history.state.keepPosition;
    var index;
    switch (method) {
      case 'go':
        index = _keepPosition + to.delta;
        break;
      case 'forward':
        index = _keepPosition + 1;
        break;
      case 'back':
        index = _keepPosition - 1;
        break;
      default:
        index = _keepPosition;
    }
    _to = historyStack[index];
    if (!_to) {
      console.warn('vue-keep:', 'empty jump');
      isEmptyJump = true;
      new Promise(function (resolve) {
        return resolve();
      }).then(function () {
        return isEmptyJump = false;
      });
      return;
    }
  }
  var toLocation = toLocationResolve($router, _to);
  dispatch(KEEP_BEFORE_ROUTE_CHANGE, direction, toLocation);
}
function routerChange(direction, method) {
  var toLocation = getToLocation($router);
  var mergeToLocation = dispatch(KEEP_ROUTE_CHANGE, direction, toLocation);
  handleHistoryStack(mergeToLocation, method);
  from = mergeToLocation;
  to = null;
}
function handleHistoryStack(toLocation, method) {
  var keepPosition = history.state.keepPosition;
  var path = toLocation.fullPath || toLocation.path;
  historyStack[keepPosition] = path;
  if (method === 'pushState') {
    historyStack.push(path);
    historyStack = historyStack.slice(0, keepPosition + 1);
  }
  sessionStorage.setItem('keep_history_stack', JSON.stringify(historyStack));
}

var extendRouter = (function (router) {
  resetComponentsName(router);
  historyJumpExtend(router);
});

function render2x() {
  var vm = this;
  var h = vm.$createElement;
  var c = vm._self.c || h;
  return c('keep-alive', {
    attrs: {
      include: [].concat(vm.includeList),
      max: vm.max,
      exclude: vm.exclude
    }
  }, [c('router-view')], 1);
}
function render3x(ctx, cache, props, setup, data) {
  var _Vue = Vue$1;
  var componentRouterView = _Vue.resolveComponent('router-view');
  var openBlock = _Vue.openBlock;
  var createBlock = _Vue.createBlock;
  var withCtx = _Vue.withCtx;
  var KeepAlive = _Vue.KeepAlive;
  var resolveDynamicComponent = _Vue.resolveDynamicComponent;
  return openBlock(), createBlock(componentRouterView, {
    key: 0
  }, {
    default: withCtx(function (ref) {
      var Component = ref.Component;
      return [(openBlock(), createBlock(KeepAlive, {
        include: data.includeList,
        max: props.max,
        exclude: props.exclude
      }, [(openBlock(), createBlock(resolveDynamicComponent(Component)))], 1032, ['include', 'max', 'exclude']))];
    }),
    _: 1
  });
}

var KeepRouterView = {
  name: 'KeepRouteView',
  render: function render() {
    if (!this.vueNext) {
      return render2x.call(this);
    } else {
      return render3x.apply(void 0, arguments);
    }
  },
  props: {
    max: {
      type: Number,
      default: 5
    },
    exclude: {
      type: [Array, RegExp, String],
      default: function _default() {
        return [];
      }
    },
    matchClearList: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    matchClearBehindList: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    mode: {
      type: String,
      default: 'allKeepAlive'
    }
  },
  data: function data() {
    return {
      vueNext: Number(Vue.version.slice(0, 3)) >= 3,
      includeList: []
    };
  },
  created: function created() {
    this.isForward = false;
    this.addEvents();
  },
  methods: {
    addEvents: function addEvents() {
      window.addEventListener(KEEP_BEFORE_ROUTE_CHANGE, this.beforeRouteChangeEvent);
      window.addEventListener(KEEP_ROUTE_CHANGE, this.routerChangeEvent);
      window.addEventListener(KEEP_COMPONENT_DESTROY, this.componentDestroyEvent);
    },
    beforeRouteChangeEvent: function beforeRouteChangeEvent(params) {
      var _this = this;
      return _asyncToGenerator( regenerator.mark(function _callee() {
        var _params$detail, direction, destroy, cache, toLocation;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _params$detail = params.detail, direction = _params$detail.direction, destroy = _params$detail.destroy, cache = _params$detail.cache, toLocation = _params$detail.toLocation;
                if (!(direction !== 'forward')) {
                  _context.next = 3;
                  break;
                }
                return _context.abrupt("return");
              case 3:
                cache || _this.destroyTraverse(toLocation.name);
                if (destroy === DESTROY_ALL) {
                  _this.includeList = [];
                }
                _this.handelDestroy(destroy);
                if (!toLocation.name) {
                  console.warn('keep-router-view: Please pay attention to whether the router base path you configured is correct!');
                }
              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    routerChangeEvent: function routerChangeEvent(params) {
      var toLocation = params.detail.toLocation;
      this.forward(toLocation.name);
    },
    componentDestroyEvent: function componentDestroyEvent(params) {
      var destroy = params.detail;
      this.handelDestroy(destroy);
    },
    forward: function forward(name) {
      var includeList = this.includeList;
      if (includeList.includes(name)) {
        var index = includeList.indexOf(name);
        includeList.splice(index, 1);
      }
      if (includeList.length === this.max) {
        includeList.splice(0, 1);
      }
      includeList.push(name);
    },
    handelDestroy: function handelDestroy(destroy) {
      var destroyTraverse = this.destroyTraverse;
      if (typeof destroy === 'string' && destroy) {
        destroyTraverse(destroy);
      } else if (Array.isArray(destroy)) {
        destroy.forEach(function (name) {
          return destroyTraverse(name);
        });
      }
    },
    destroyTraverse: function destroyTraverse(name) {
      var includeList = this.includeList;
      for (var i = 0; i < includeList.length; i++) {
        if (name === includeList[i]) {
          includeList.splice(i, 1);
          break;
        }
      }
    }
  }
};

function destroy(value) {
  var destroyEvent = new CustomEvent(KEEP_COMPONENT_DESTROY, {
    detail: value
  });
  window.dispatchEvent(destroyEvent);
}

var Vue;
var beforeEach = beforeGuards.add;
var index = {
  beforeEach: beforeEach,
  install: function install(app, router) {
    Vue = app;
    extendRouter(router);
    app.component('KeepRouterView', KeepRouterView);
    var keepRouter = {
      destroy: destroy,
      beforeEach: beforeEach
    };
    if (Number(app.version.slice(0, 1)) < 3) {
      app.prototype.$keepRouter = keepRouter;
    } else {
      app.config.globalProperties.$keepRouter = keepRouter;
    }
  }
};

export { KeepRouterView, Vue, beforeEach, index as default, destroy, extendRouter };
