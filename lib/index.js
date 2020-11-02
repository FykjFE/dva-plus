(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash'), require('invariant'), require('is-plain-object'), require('warning'), require('flatten'), require('global/window'), require('@babel/runtime/regenerator')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash', 'invariant', 'is-plain-object', 'warning', 'flatten', 'global/window', '@babel/runtime/regenerator'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dva = {}, global._, global.invariant, global.isPlainObject$1, global.warning$1, global.flatten, global.win, global._regeneratorRuntime));
}(this, (function (exports, _, invariant, isPlainObject$1, warning$1, flatten, win, _regeneratorRuntime) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var ___default = /*#__PURE__*/_interopDefaultLegacy(_);
  var invariant__default = /*#__PURE__*/_interopDefaultLegacy(invariant);
  var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject$1);
  var warning__default = /*#__PURE__*/_interopDefaultLegacy(warning$1);
  var flatten__default = /*#__PURE__*/_interopDefaultLegacy(flatten);
  var win__default = /*#__PURE__*/_interopDefaultLegacy(win);
  var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var engine = require('store/src/store-engine');

  var storages = [require('store/storages/sessionStorage')];
  var plugins = [require('store/plugins/defaults')];
  var storage = engine.createStore(storages, plugins);

  var config = {
    key: 'model',
    storage: storage,
    blacklist: ['@@dva'],
    whitelist: [],
    keyPrefix: 'persist'
  };

  var lastState = {};

  var persistEnhancer = function persistEnhancer() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _defaultOptions$opts = _objectSpread2(_objectSpread2({}, config), opts),
        key = _defaultOptions$opts.key,
        keyPrefix = _defaultOptions$opts.keyPrefix,
        blacklist = _defaultOptions$opts.blacklist,
        whitelist = _defaultOptions$opts.whitelist,
        storage = _defaultOptions$opts.storage;

    var defaultState = storage.get("".concat(keyPrefix, ":").concat(key));
    return function (createStore) {
      return function (reducer) {
        var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultState;
        var enhancer = arguments.length > 2 ? arguments[2] : undefined;
        var store = createStore(reducer, _objectSpread2(_objectSpread2({}, initialState), defaultState), enhancer);

        function dispatch(action) {
          var res = store.dispatch(action);
          var thatState = store.getState();

          if (___default['default'].isArray(whitelist) && !___default['default'].isEmpty(whitelist)) {
            thatState = ___default['default'].pick(thatState, whitelist);
          } else if (___default['default'].isArray(blacklist) && !___default['default'].isEmpty(blacklist)) {
            thatState = ___default['default'].omit(thatState, blacklist);
          }

          if (!___default['default'].isEqual(lastState, thatState)) {
            lastState = ___default['default'].merge(lastState, thatState);
            storage.set("".concat(keyPrefix, ":").concat(key), lastState);
          }

          return res;
        }

        return _objectSpread2(_objectSpread2({}, store), {}, {
          dispatch: dispatch
        });
      };
    };
  };

  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    }

    return target;
  }

  function symbolObservablePonyfill(root) {
  	var result;
  	var Symbol = root.Symbol;

  	if (typeof Symbol === 'function') {
  		if (Symbol.observable) {
  			result = Symbol.observable;
  		} else {
  			result = Symbol('observable');
  			Symbol.observable = result;
  		}
  	} else {
  		result = '@@observable';
  	}

  	return result;
  }

  /* global window */

  var root;

  if (typeof self !== 'undefined') {
    root = self;
  } else if (typeof window !== 'undefined') {
    root = window;
  } else if (typeof global !== 'undefined') {
    root = global;
  } else if (typeof module !== 'undefined') {
    root = module;
  } else {
    root = Function('return this')();
  }

  var result = symbolObservablePonyfill(root);

  /**
   * These are private action types reserved by Redux.
   * For any unknown actions, you must return the current state.
   * If the current state is undefined, you must return the initial state.
   * Do not reference these action types directly in your code.
   */
  var randomString = function randomString() {
    return Math.random().toString(36).substring(7).split('').join('.');
  };

  var ActionTypes = {
    INIT: "@@redux/INIT" + randomString(),
    REPLACE: "@@redux/REPLACE" + randomString(),
    PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
      return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
    }
  };

  /**
   * @param {any} obj The object to inspect.
   * @returns {boolean} True if the argument appears to be a plain object.
   */
  function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = obj;

    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
  }

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */

  function createStore(reducer, preloadedState, enhancer) {
    var _ref2;

    if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
      throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
    }

    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
      enhancer = preloadedState;
      preloadedState = undefined;
    }

    if (typeof enhancer !== 'undefined') {
      if (typeof enhancer !== 'function') {
        throw new Error('Expected the enhancer to be a function.');
      }

      return enhancer(createStore)(reducer, preloadedState);
    }

    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }

    var currentReducer = reducer;
    var currentState = preloadedState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;
    /**
     * This makes a shallow copy of currentListeners so we can use
     * nextListeners as a temporary list while dispatching.
     *
     * This prevents any bugs around consumers calling
     * subscribe/unsubscribe in the middle of a dispatch.
     */

    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }
    /**
     * Reads the state tree managed by the store.
     *
     * @returns {any} The current state tree of your application.
     */


    function getState() {
      if (isDispatching) {
        throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
      }

      return currentState;
    }
    /**
     * Adds a change listener. It will be called any time an action is dispatched,
     * and some part of the state tree may potentially have changed. You may then
     * call `getState()` to read the current state tree inside the callback.
     *
     * You may call `dispatch()` from a change listener, with the following
     * caveats:
     *
     * 1. The subscriptions are snapshotted just before every `dispatch()` call.
     * If you subscribe or unsubscribe while the listeners are being invoked, this
     * will not have any effect on the `dispatch()` that is currently in progress.
     * However, the next `dispatch()` call, whether nested or not, will use a more
     * recent snapshot of the subscription list.
     *
     * 2. The listener should not expect to see all state changes, as the state
     * might have been updated multiple times during a nested `dispatch()` before
     * the listener is called. It is, however, guaranteed that all subscribers
     * registered before the `dispatch()` started will be called with the latest
     * state by the time it exits.
     *
     * @param {Function} listener A callback to be invoked on every dispatch.
     * @returns {Function} A function to remove this change listener.
     */


    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected the listener to be a function.');
      }

      if (isDispatching) {
        throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
      }

      var isSubscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }

        if (isDispatching) {
          throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
        }

        isSubscribed = false;
        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
        currentListeners = null;
      };
    }
    /**
     * Dispatches an action. It is the only way to trigger a state change.
     *
     * The `reducer` function, used to create the store, will be called with the
     * current state tree and the given `action`. Its return value will
     * be considered the **next** state of the tree, and the change listeners
     * will be notified.
     *
     * The base implementation only supports plain object actions. If you want to
     * dispatch a Promise, an Observable, a thunk, or something else, you need to
     * wrap your store creating function into the corresponding middleware. For
     * example, see the documentation for the `redux-thunk` package. Even the
     * middleware will eventually dispatch plain object actions using this method.
     *
     * @param {Object} action A plain object representing “what changed”. It is
     * a good idea to keep actions serializable so you can record and replay user
     * sessions, or use the time travelling `redux-devtools`. An action must have
     * a `type` property which may not be `undefined`. It is a good idea to use
     * string constants for action types.
     *
     * @returns {Object} For convenience, the same action object you dispatched.
     *
     * Note that, if you use a custom middleware, it may wrap `dispatch()` to
     * return something else (for example, a Promise you can await).
     */


    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
      }

      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
      }

      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.');
      }

      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }

      var listeners = currentListeners = nextListeners;

      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener();
      }

      return action;
    }
    /**
     * Replaces the reducer currently used by the store to calculate the state.
     *
     * You might need this if your app implements code splitting and you want to
     * load some of the reducers dynamically. You might also need this if you
     * implement a hot reloading mechanism for Redux.
     *
     * @param {Function} nextReducer The reducer for the store to use instead.
     * @returns {void}
     */


    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') {
        throw new Error('Expected the nextReducer to be a function.');
      }

      currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
      // Any reducers that existed in both the new and old rootReducer
      // will receive the previous state. This effectively populates
      // the new state tree with any relevant data from the old one.

      dispatch({
        type: ActionTypes.REPLACE
      });
    }
    /**
     * Interoperability point for observable/reactive libraries.
     * @returns {observable} A minimal observable of state changes.
     * For more information, see the observable proposal:
     * https://github.com/tc39/proposal-observable
     */


    function observable() {
      var _ref;

      var outerSubscribe = subscribe;
      return _ref = {
        /**
         * The minimal observable subscription method.
         * @param {Object} observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns {subscription} An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */
        subscribe: function subscribe(observer) {
          if (typeof observer !== 'object' || observer === null) {
            throw new TypeError('Expected the observer to be an object.');
          }

          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }

          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe: unsubscribe
          };
        }
      }, _ref[result] = function () {
        return this;
      }, _ref;
    } // When a store is created, an "INIT" action is dispatched so that every
    // reducer returns their initial state. This effectively populates
    // the initial state tree.


    dispatch({
      type: ActionTypes.INIT
    });
    return _ref2 = {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    }, _ref2[result] = observable, _ref2;
  }

  /**
   * Prints a warning in the console if it exists.
   *
   * @param {String} message The warning message.
   * @returns {void}
   */
  function warning(message) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(message);
    }
    /* eslint-enable no-console */


    try {
      // This error was thrown as a convenience so that if you enable
      // "break on all exceptions" in your console,
      // it would pause the execution at this line.
      throw new Error(message);
    } catch (e) {} // eslint-disable-line no-empty

  }

  function getUndefinedStateErrorMessage(key, action) {
    var actionType = action && action.type;
    var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
    return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
  }

  function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
    var reducerKeys = Object.keys(reducers);
    var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

    if (reducerKeys.length === 0) {
      return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
    }

    if (!isPlainObject(inputState)) {
      return "The " + argumentName + " has unexpected type of \"" + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
    }

    var unexpectedKeys = Object.keys(inputState).filter(function (key) {
      return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
    });
    unexpectedKeys.forEach(function (key) {
      unexpectedKeyCache[key] = true;
    });
    if (action && action.type === ActionTypes.REPLACE) return;

    if (unexpectedKeys.length > 0) {
      return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
    }
  }

  function assertReducerShape(reducers) {
    Object.keys(reducers).forEach(function (key) {
      var reducer = reducers[key];
      var initialState = reducer(undefined, {
        type: ActionTypes.INIT
      });

      if (typeof initialState === 'undefined') {
        throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
      }

      if (typeof reducer(undefined, {
        type: ActionTypes.PROBE_UNKNOWN_ACTION()
      }) === 'undefined') {
        throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
      }
    });
  }
  /**
   * Turns an object whose values are different reducer functions, into a single
   * reducer function. It will call every child reducer, and gather their results
   * into a single state object, whose keys correspond to the keys of the passed
   * reducer functions.
   *
   * @param {Object} reducers An object whose values correspond to different
   * reducer functions that need to be combined into one. One handy way to obtain
   * it is to use ES6 `import * as reducers` syntax. The reducers may never return
   * undefined for any action. Instead, they should return their initial state
   * if the state passed to them was undefined, and the current state for any
   * unrecognized action.
   *
   * @returns {Function} A reducer function that invokes every reducer inside the
   * passed object, and builds a state object with the same shape.
   */


  function combineReducers(reducers) {
    var reducerKeys = Object.keys(reducers);
    var finalReducers = {};

    for (var i = 0; i < reducerKeys.length; i++) {
      var key = reducerKeys[i];

      if (process.env.NODE_ENV !== 'production') {
        if (typeof reducers[key] === 'undefined') {
          warning("No reducer provided for key \"" + key + "\"");
        }
      }

      if (typeof reducers[key] === 'function') {
        finalReducers[key] = reducers[key];
      }
    }

    var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
    // keys multiple times.

    var unexpectedKeyCache;

    if (process.env.NODE_ENV !== 'production') {
      unexpectedKeyCache = {};
    }

    var shapeAssertionError;

    try {
      assertReducerShape(finalReducers);
    } catch (e) {
      shapeAssertionError = e;
    }

    return function combination(state, action) {
      if (state === void 0) {
        state = {};
      }

      if (shapeAssertionError) {
        throw shapeAssertionError;
      }

      if (process.env.NODE_ENV !== 'production') {
        var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);

        if (warningMessage) {
          warning(warningMessage);
        }
      }

      var hasChanged = false;
      var nextState = {};

      for (var _i = 0; _i < finalReducerKeys.length; _i++) {
        var _key = finalReducerKeys[_i];
        var reducer = finalReducers[_key];
        var previousStateForKey = state[_key];
        var nextStateForKey = reducer(previousStateForKey, action);

        if (typeof nextStateForKey === 'undefined') {
          var errorMessage = getUndefinedStateErrorMessage(_key, action);
          throw new Error(errorMessage);
        }

        nextState[_key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      }

      hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
      return hasChanged ? nextState : state;
    };
  }

  function _defineProperty$2(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      keys.push.apply(keys, Object.getOwnPropertySymbols(object));
    }

    if (enumerableOnly) keys = keys.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    return keys;
  }

  function _objectSpread2$1(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys$1(source, true).forEach(function (key) {
          _defineProperty$2(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$1(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  /**
   * Composes single-argument functions from right to left. The rightmost
   * function can take multiple arguments as it provides the signature for
   * the resulting composite function.
   *
   * @param {...Function} funcs The functions to compose.
   * @returns {Function} A function obtained by composing the argument functions
   * from right to left. For example, compose(f, g, h) is identical to doing
   * (...args) => f(g(h(...args))).
   */
  function compose() {
    for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
      funcs[_key] = arguments[_key];
    }

    if (funcs.length === 0) {
      return function (arg) {
        return arg;
      };
    }

    if (funcs.length === 1) {
      return funcs[0];
    }

    return funcs.reduce(function (a, b) {
      return function () {
        return a(b.apply(void 0, arguments));
      };
    });
  }

  /**
   * Creates a store enhancer that applies middleware to the dispatch method
   * of the Redux store. This is handy for a variety of tasks, such as expressing
   * asynchronous actions in a concise manner, or logging every action payload.
   *
   * See `redux-thunk` package as an example of the Redux middleware.
   *
   * Because middleware is potentially asynchronous, this should be the first
   * store enhancer in the composition chain.
   *
   * Note that each middleware will be given the `dispatch` and `getState` functions
   * as named arguments.
   *
   * @param {...Function} middlewares The middleware chain to be applied.
   * @returns {Function} A store enhancer applying the middleware.
   */

  function applyMiddleware() {
    for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }

    return function (createStore) {
      return function () {
        var store = createStore.apply(void 0, arguments);

        var _dispatch = function dispatch() {
          throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
        };

        var middlewareAPI = {
          getState: store.getState,
          dispatch: function dispatch() {
            return _dispatch.apply(void 0, arguments);
          }
        };
        var chain = middlewares.map(function (middleware) {
          return middleware(middlewareAPI);
        });
        _dispatch = compose.apply(void 0, chain)(store.dispatch);
        return _objectSpread2$1({}, store, {
          dispatch: _dispatch
        });
      };
    };
  }

  /*
   * This is a dummy function to check if the function name has been altered by minification.
   * If the function has been minified and NODE_ENV !== 'production', warn the user.
   */

  function isCrushed() {}

  if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
    warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
  }

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  var sym = function sym(id) {
    return '@@redux-saga/' + id;
  };

  var TASK = /*#__PURE__*/sym('TASK');
  var HELPER = /*#__PURE__*/sym('HELPER');
  var MATCH = /*#__PURE__*/sym('MATCH');
  var CANCEL = /*#__PURE__*/sym('CANCEL_PROMISE');
  var SAGA_ACTION = /*#__PURE__*/sym('SAGA_ACTION');
  var SELF_CANCELLATION = /*#__PURE__*/sym('SELF_CANCELLATION');
  var konst = function konst(v) {
    return function () {
      return v;
    };
  };
  var kTrue = /*#__PURE__*/konst(true);
  var noop = function noop() {};
  var ident = function ident(v) {
    return v;
  };

  function check(value, predicate, error) {
    if (!predicate(value)) {
      log('error', 'uncaught at check', error);
      throw new Error(error);
    }
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(object, property) {
    return is.notUndef(object) && hasOwnProperty.call(object, property);
  }

  var is = {
    undef: function undef(v) {
      return v === null || v === undefined;
    },
    notUndef: function notUndef(v) {
      return v !== null && v !== undefined;
    },
    func: function func(f) {
      return typeof f === 'function';
    },
    number: function number(n) {
      return typeof n === 'number';
    },
    string: function string(s) {
      return typeof s === 'string';
    },
    array: Array.isArray,
    object: function object(obj) {
      return obj && !is.array(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
    },
    promise: function promise(p) {
      return p && is.func(p.then);
    },
    iterator: function iterator(it) {
      return it && is.func(it.next) && is.func(it.throw);
    },
    iterable: function iterable(it) {
      return it && is.func(Symbol) ? is.func(it[Symbol.iterator]) : is.array(it);
    },
    task: function task(t) {
      return t && t[TASK];
    },
    observable: function observable(ob) {
      return ob && is.func(ob.subscribe);
    },
    buffer: function buffer(buf) {
      return buf && is.func(buf.isEmpty) && is.func(buf.take) && is.func(buf.put);
    },
    pattern: function pattern(pat) {
      return pat && (is.string(pat) || (typeof pat === 'undefined' ? 'undefined' : _typeof(pat)) === 'symbol' || is.func(pat) || is.array(pat));
    },
    channel: function channel(ch) {
      return ch && is.func(ch.take) && is.func(ch.close);
    },
    helper: function helper(it) {
      return it && it[HELPER];
    },
    stringableFunc: function stringableFunc(f) {
      return is.func(f) && hasOwn(f, 'toString');
    }
  };

  var object = {
    assign: function assign(target, source) {
      for (var i in source) {
        if (hasOwn(source, i)) {
          target[i] = source[i];
        }
      }
    }
  };

  function remove(array, item) {
    var index = array.indexOf(item);
    if (index >= 0) {
      array.splice(index, 1);
    }
  }

  var array = {
    from: function from(obj) {
      var arr = Array(obj.length);
      for (var i in obj) {
        if (hasOwn(obj, i)) {
          arr[i] = obj[i];
        }
      }
      return arr;
    }
  };

  function deferred() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var def = _extends({}, props);
    var promise = new Promise(function (resolve, reject) {
      def.resolve = resolve;
      def.reject = reject;
    });
    def.promise = promise;
    return def;
  }

  function delay(ms) {
    var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var timeoutId = void 0;
    var promise = new Promise(function (resolve) {
      timeoutId = setTimeout(function () {
        return resolve(val);
      }, ms);
    });

    promise[CANCEL] = function () {
      return clearTimeout(timeoutId);
    };

    return promise;
  }

  function autoInc() {
    var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    return function () {
      return ++seed;
    };
  }

  var uid = /*#__PURE__*/autoInc();

  var kThrow = function kThrow(err) {
    throw err;
  };
  var kReturn = function kReturn(value) {
    return { value: value, done: true };
  };
  function makeIterator(next) {
    var thro = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : kThrow;
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var isHelper = arguments[3];

    var iterator = { name: name, next: next, throw: thro, return: kReturn };

    if (isHelper) {
      iterator[HELPER] = true;
    }
    if (typeof Symbol !== 'undefined') {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }
    return iterator;
  }

  /**
    Print error in a useful way whether in a browser environment
    (with expandable error stack traces), or in a node.js environment
    (text-only log output)
   **/
  function log(level, message) {
    var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    /*eslint-disable no-console*/
    if (typeof window === 'undefined') {
      console.log('redux-saga ' + level + ': ' + message + '\n' + (error && error.stack || error));
    } else {
      console[level](message, error);
    }
  }

  function deprecate(fn, deprecationWarning) {
    return function () {
      if (process.env.NODE_ENV === 'development') log('warn', deprecationWarning);
      return fn.apply(undefined, arguments);
    };
  }

  var updateIncentive = function updateIncentive(deprecated, preferred) {
    return deprecated + ' has been deprecated in favor of ' + preferred + ', please update your code';
  };

  var internalErr = function internalErr(err) {
    return new Error('\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project\'s github repo.\n  Error: ' + err + '\n');
  };

  var createSetContextWarning = function createSetContextWarning(ctx, props) {
    return (ctx ? ctx + '.' : '') + 'setContext(props): argument ' + props + ' is not a plain object';
  };

  var wrapSagaDispatch = function wrapSagaDispatch(dispatch) {
    return function (action) {
      return dispatch(Object.defineProperty(action, SAGA_ACTION, { value: true }));
    };
  };

  var BUFFER_OVERFLOW = "Channel's Buffer overflow!";

  var ON_OVERFLOW_THROW = 1;
  var ON_OVERFLOW_DROP = 2;
  var ON_OVERFLOW_SLIDE = 3;
  var ON_OVERFLOW_EXPAND = 4;

  var zeroBuffer = { isEmpty: kTrue, put: noop, take: noop };

  function ringBuffer() {
    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    var overflowAction = arguments[1];

    var arr = new Array(limit);
    var length = 0;
    var pushIndex = 0;
    var popIndex = 0;

    var push = function push(it) {
      arr[pushIndex] = it;
      pushIndex = (pushIndex + 1) % limit;
      length++;
    };

    var take = function take() {
      if (length != 0) {
        var it = arr[popIndex];
        arr[popIndex] = null;
        length--;
        popIndex = (popIndex + 1) % limit;
        return it;
      }
    };

    var flush = function flush() {
      var items = [];
      while (length) {
        items.push(take());
      }
      return items;
    };

    return {
      isEmpty: function isEmpty() {
        return length == 0;
      },
      put: function put(it) {
        if (length < limit) {
          push(it);
        } else {
          var doubledLimit = void 0;
          switch (overflowAction) {
            case ON_OVERFLOW_THROW:
              throw new Error(BUFFER_OVERFLOW);
            case ON_OVERFLOW_SLIDE:
              arr[pushIndex] = it;
              pushIndex = (pushIndex + 1) % limit;
              popIndex = pushIndex;
              break;
            case ON_OVERFLOW_EXPAND:
              doubledLimit = 2 * limit;

              arr = flush();

              length = arr.length;
              pushIndex = arr.length;
              popIndex = 0;

              arr.length = doubledLimit;
              limit = doubledLimit;

              push(it);
              break;
            // DROP
          }
        }
      },
      take: take,
      flush: flush
    };
  }

  var buffers = {
    none: function none() {
      return zeroBuffer;
    },
    fixed: function fixed(limit) {
      return ringBuffer(limit, ON_OVERFLOW_THROW);
    },
    dropping: function dropping(limit) {
      return ringBuffer(limit, ON_OVERFLOW_DROP);
    },
    sliding: function sliding(limit) {
      return ringBuffer(limit, ON_OVERFLOW_SLIDE);
    },
    expanding: function expanding(initialSize) {
      return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
    }
  };

  var queue = [];
  /**
    Variable to hold a counting semaphore
    - Incrementing adds a lock and puts the scheduler in a `suspended` state (if it's not
      already suspended)
    - Decrementing releases a lock. Zero locks puts the scheduler in a `released` state. This
      triggers flushing the queued tasks.
  **/
  var semaphore = 0;

  /**
    Executes a task 'atomically'. Tasks scheduled during this execution will be queued
    and flushed after this task has finished (assuming the scheduler endup in a released
    state).
  **/
  function exec(task) {
    try {
      suspend();
      task();
    } finally {
      release();
    }
  }

  /**
    Executes or queues a task depending on the state of the scheduler (`suspended` or `released`)
  **/
  function asap(task) {
    queue.push(task);

    if (!semaphore) {
      suspend();
      flush();
    }
  }

  /**
    Puts the scheduler in a `suspended` state. Scheduled tasks will be queued until the
    scheduler is released.
  **/
  function suspend() {
    semaphore++;
  }

  /**
    Puts the scheduler in a `released` state.
  **/
  function release() {
    semaphore--;
  }

  /**
    Releases the current lock. Executes all queued tasks if the scheduler is in the released state.
  **/
  function flush() {
    release();

    var task = void 0;
    while (!semaphore && (task = queue.shift()) !== undefined) {
      exec(task);
    }
  }

  var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var CHANNEL_END_TYPE = '@@redux-saga/CHANNEL_END';
  var END = { type: CHANNEL_END_TYPE };
  var isEnd = function isEnd(a) {
    return a && a.type === CHANNEL_END_TYPE;
  };

  function emitter() {
    var subscribers = [];

    function subscribe(sub) {
      subscribers.push(sub);
      return function () {
        return remove(subscribers, sub);
      };
    }

    function emit(item) {
      var arr = subscribers.slice();
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i](item);
      }
    }

    return {
      subscribe: subscribe,
      emit: emit
    };
  }

  var INVALID_BUFFER = 'invalid buffer passed to channel factory function';
  var UNDEFINED_INPUT_ERROR = 'Saga was provided with an undefined action';

  if (process.env.NODE_ENV !== 'production') {
    UNDEFINED_INPUT_ERROR += '\nHints:\n    - check that your Action Creator returns a non-undefined value\n    - if the Saga was started using runSaga, check that your subscribe source provides the action to its listeners\n  ';
  }

  function channel() {
    var buffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : buffers.fixed();

    var closed = false;
    var takers = [];

    check(buffer, is.buffer, INVALID_BUFFER);

    function checkForbiddenStates() {
      if (closed && takers.length) {
        throw internalErr('Cannot have a closed channel with pending takers');
      }
      if (takers.length && !buffer.isEmpty()) {
        throw internalErr('Cannot have pending takers with non empty buffer');
      }
    }

    function put(input) {
      checkForbiddenStates();
      check(input, is.notUndef, UNDEFINED_INPUT_ERROR);
      if (closed) {
        return;
      }
      if (!takers.length) {
        return buffer.put(input);
      }
      for (var i = 0; i < takers.length; i++) {
        var cb = takers[i];
        if (!cb[MATCH] || cb[MATCH](input)) {
          takers.splice(i, 1);
          return cb(input);
        }
      }
    }

    function take(cb) {
      checkForbiddenStates();
      check(cb, is.func, "channel.take's callback must be a function");

      if (closed && buffer.isEmpty()) {
        cb(END);
      } else if (!buffer.isEmpty()) {
        cb(buffer.take());
      } else {
        takers.push(cb);
        cb.cancel = function () {
          return remove(takers, cb);
        };
      }
    }

    function flush(cb) {
      checkForbiddenStates(); // TODO: check if some new state should be forbidden now
      check(cb, is.func, "channel.flush' callback must be a function");
      if (closed && buffer.isEmpty()) {
        cb(END);
        return;
      }
      cb(buffer.flush());
    }

    function close() {
      checkForbiddenStates();
      if (!closed) {
        closed = true;
        if (takers.length) {
          var arr = takers;
          takers = [];
          for (var i = 0, len = arr.length; i < len; i++) {
            arr[i](END);
          }
        }
      }
    }

    return {
      take: take,
      put: put,
      flush: flush,
      close: close,
      get __takers__() {
        return takers;
      },
      get __closed__() {
        return closed;
      }
    };
  }

  function eventChannel(subscribe) {
    var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : buffers.none();
    var matcher = arguments[2];

    /**
      should be if(typeof matcher !== undefined) instead?
      see PR #273 for a background discussion
    **/
    if (arguments.length > 2) {
      check(matcher, is.func, 'Invalid match function passed to eventChannel');
    }

    var chan = channel(buffer);
    var close = function close() {
      if (!chan.__closed__) {
        if (unsubscribe) {
          unsubscribe();
        }
        chan.close();
      }
    };
    var unsubscribe = subscribe(function (input) {
      if (isEnd(input)) {
        close();
        return;
      }
      if (matcher && !matcher(input)) {
        return;
      }
      chan.put(input);
    });
    if (chan.__closed__) {
      unsubscribe();
    }

    if (!is.func(unsubscribe)) {
      throw new Error('in eventChannel: subscribe should return a function to unsubscribe');
    }

    return {
      take: chan.take,
      flush: chan.flush,
      close: close
    };
  }

  function stdChannel(subscribe) {
    var chan = eventChannel(function (cb) {
      return subscribe(function (input) {
        if (input[SAGA_ACTION]) {
          cb(input);
          return;
        }
        asap(function () {
          return cb(input);
        });
      });
    });

    return _extends$1({}, chan, {
      take: function take(cb, matcher) {
        if (arguments.length > 1) {
          check(matcher, is.func, "channel.take's matcher argument must be a function");
          cb[MATCH] = matcher;
        }
        chan.take(cb);
      }
    });
  }

  var IO = /*#__PURE__*/sym('IO');
  var TAKE = 'TAKE';
  var PUT = 'PUT';
  var ALL = 'ALL';
  var RACE = 'RACE';
  var CALL = 'CALL';
  var CPS = 'CPS';
  var FORK = 'FORK';
  var JOIN = 'JOIN';
  var CANCEL$1 = 'CANCEL';
  var SELECT = 'SELECT';
  var ACTION_CHANNEL = 'ACTION_CHANNEL';
  var CANCELLED = 'CANCELLED';
  var FLUSH = 'FLUSH';
  var GET_CONTEXT = 'GET_CONTEXT';
  var SET_CONTEXT = 'SET_CONTEXT';

  var TEST_HINT = '\n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)';

  var effect = function effect(type, payload) {
    var _ref;

    return _ref = {}, _ref[IO] = true, _ref[type] = payload, _ref;
  };

  var detach = function detach(eff) {
    check(asEffect.fork(eff), is.object, 'detach(eff): argument must be a fork effect');
    eff[FORK].detached = true;
    return eff;
  };

  function take() {
    var patternOrChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

    if (arguments.length) {
      check(arguments[0], is.notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
    }
    if (is.pattern(patternOrChannel)) {
      return effect(TAKE, { pattern: patternOrChannel });
    }
    if (is.channel(patternOrChannel)) {
      return effect(TAKE, { channel: patternOrChannel });
    }
    throw new Error('take(patternOrChannel): argument ' + String(patternOrChannel) + ' is not valid channel or a valid pattern');
  }

  take.maybe = function () {
    var eff = take.apply(undefined, arguments);
    eff[TAKE].maybe = true;
    return eff;
  };

  var takem = /*#__PURE__*/deprecate(take.maybe, /*#__PURE__*/updateIncentive('takem', 'take.maybe'));

  function put(channel, action) {
    if (arguments.length > 1) {
      check(channel, is.notUndef, 'put(channel, action): argument channel is undefined');
      check(channel, is.channel, 'put(channel, action): argument ' + channel + ' is not a valid channel');
      check(action, is.notUndef, 'put(channel, action): argument action is undefined');
    } else {
      check(channel, is.notUndef, 'put(action): argument action is undefined');
      action = channel;
      channel = null;
    }
    return effect(PUT, { channel: channel, action: action });
  }

  put.resolve = function () {
    var eff = put.apply(undefined, arguments);
    eff[PUT].resolve = true;
    return eff;
  };

  put.sync = /*#__PURE__*/deprecate(put.resolve, /*#__PURE__*/updateIncentive('put.sync', 'put.resolve'));

  function all(effects) {
    return effect(ALL, effects);
  }

  function race(effects) {
    return effect(RACE, effects);
  }

  function getFnCallDesc(meth, fn, args) {
    check(fn, is.notUndef, meth + ': argument fn is undefined');

    var context = null;
    if (is.array(fn)) {
      var _fn = fn;
      context = _fn[0];
      fn = _fn[1];
    } else if (fn.fn) {
      var _fn2 = fn;
      context = _fn2.context;
      fn = _fn2.fn;
    }
    if (context && is.string(fn) && is.func(context[fn])) {
      fn = context[fn];
    }
    check(fn, is.func, meth + ': argument ' + fn + ' is not a function');

    return { context: context, fn: fn, args: args };
  }

  function call(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return effect(CALL, getFnCallDesc('call', fn, args));
  }

  function apply(context, fn) {
    var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    return effect(CALL, getFnCallDesc('apply', { context: context, fn: fn }, args));
  }

  function cps(fn) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return effect(CPS, getFnCallDesc('cps', fn, args));
  }

  function fork(fn) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return effect(FORK, getFnCallDesc('fork', fn, args));
  }

  function spawn(fn) {
    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    return detach(fork.apply(undefined, [fn].concat(args)));
  }

  function join() {
    for (var _len5 = arguments.length, tasks = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      tasks[_key5] = arguments[_key5];
    }

    if (tasks.length > 1) {
      return all(tasks.map(function (t) {
        return join(t);
      }));
    }
    var task = tasks[0];
    check(task, is.notUndef, 'join(task): argument task is undefined');
    check(task, is.task, 'join(task): argument ' + task + ' is not a valid Task object ' + TEST_HINT);
    return effect(JOIN, task);
  }

  function cancel() {
    for (var _len6 = arguments.length, tasks = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      tasks[_key6] = arguments[_key6];
    }

    if (tasks.length > 1) {
      return all(tasks.map(function (t) {
        return cancel(t);
      }));
    }
    var task = tasks[0];
    if (tasks.length === 1) {
      check(task, is.notUndef, 'cancel(task): argument task is undefined');
      check(task, is.task, 'cancel(task): argument ' + task + ' is not a valid Task object ' + TEST_HINT);
    }
    return effect(CANCEL$1, task || SELF_CANCELLATION);
  }

  function select(selector) {
    for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      args[_key7 - 1] = arguments[_key7];
    }

    if (arguments.length === 0) {
      selector = ident;
    } else {
      check(selector, is.notUndef, 'select(selector,[...]): argument selector is undefined');
      check(selector, is.func, 'select(selector,[...]): argument ' + selector + ' is not a function');
    }
    return effect(SELECT, { selector: selector, args: args });
  }

  /**
    channel(pattern, [buffer])    => creates an event channel for store actions
  **/
  function actionChannel(pattern, buffer) {
    check(pattern, is.notUndef, 'actionChannel(pattern,...): argument pattern is undefined');
    if (arguments.length > 1) {
      check(buffer, is.notUndef, 'actionChannel(pattern, buffer): argument buffer is undefined');
      check(buffer, is.buffer, 'actionChannel(pattern, buffer): argument ' + buffer + ' is not a valid buffer');
    }
    return effect(ACTION_CHANNEL, { pattern: pattern, buffer: buffer });
  }

  function cancelled() {
    return effect(CANCELLED, {});
  }

  function flush$1(channel) {
    check(channel, is.channel, 'flush(channel): argument ' + channel + ' is not valid channel');
    return effect(FLUSH, channel);
  }

  function getContext(prop) {
    check(prop, is.string, 'getContext(prop): argument ' + prop + ' is not a string');
    return effect(GET_CONTEXT, prop);
  }

  function setContext(props) {
    check(props, is.object, createSetContextWarning(null, props));
    return effect(SET_CONTEXT, props);
  }

  var createAsEffectType = function createAsEffectType(type) {
    return function (effect) {
      return effect && effect[IO] && effect[type];
    };
  };

  var asEffect = {
    take: /*#__PURE__*/createAsEffectType(TAKE),
    put: /*#__PURE__*/createAsEffectType(PUT),
    all: /*#__PURE__*/createAsEffectType(ALL),
    race: /*#__PURE__*/createAsEffectType(RACE),
    call: /*#__PURE__*/createAsEffectType(CALL),
    cps: /*#__PURE__*/createAsEffectType(CPS),
    fork: /*#__PURE__*/createAsEffectType(FORK),
    join: /*#__PURE__*/createAsEffectType(JOIN),
    cancel: /*#__PURE__*/createAsEffectType(CANCEL$1),
    select: /*#__PURE__*/createAsEffectType(SELECT),
    actionChannel: /*#__PURE__*/createAsEffectType(ACTION_CHANNEL),
    cancelled: /*#__PURE__*/createAsEffectType(CANCELLED),
    flush: /*#__PURE__*/createAsEffectType(FLUSH),
    getContext: /*#__PURE__*/createAsEffectType(GET_CONTEXT),
    setContext: /*#__PURE__*/createAsEffectType(SET_CONTEXT)
  };

  var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

  var NOT_ITERATOR_ERROR = 'proc first argument (Saga function result) must be an iterator';

  var CHANNEL_END = {
    toString: function toString() {
      return '@@redux-saga/CHANNEL_END';
    }
  };
  var TASK_CANCEL = {
    toString: function toString() {
      return '@@redux-saga/TASK_CANCEL';
    }
  };

  var matchers = {
    wildcard: function wildcard() {
      return kTrue;
    },
    default: function _default(pattern) {
      return (typeof pattern === 'undefined' ? 'undefined' : _typeof$1(pattern)) === 'symbol' ? function (input) {
        return input.type === pattern;
      } : function (input) {
        return input.type === String(pattern);
      };
    },
    array: function array(patterns) {
      return function (input) {
        return patterns.some(function (p) {
          return matcher(p)(input);
        });
      };
    },
    predicate: function predicate(_predicate) {
      return function (input) {
        return _predicate(input);
      };
    }
  };

  function matcher(pattern) {
    // prettier-ignore
    return (pattern === '*' ? matchers.wildcard : is.array(pattern) ? matchers.array : is.stringableFunc(pattern) ? matchers.default : is.func(pattern) ? matchers.predicate : matchers.default)(pattern);
  }

  /**
    Used to track a parent task and its forks
    In the new fork model, forked tasks are attached by default to their parent
    We model this using the concept of Parent task && main Task
    main task is the main flow of the current Generator, the parent tasks is the
    aggregation of the main tasks + all its forked tasks.
    Thus the whole model represents an execution tree with multiple branches (vs the
    linear execution tree in sequential (non parallel) programming)

    A parent tasks has the following semantics
    - It completes if all its forks either complete or all cancelled
    - If it's cancelled, all forks are cancelled as well
    - It aborts if any uncaught error bubbles up from forks
    - If it completes, the return value is the one returned by the main task
  **/
  function forkQueue(name, mainTask, cb) {
    var tasks = [],
        result = void 0,
        completed = false;
    addTask(mainTask);

    function abort(err) {
      cancelAll();
      cb(err, true);
    }

    function addTask(task) {
      tasks.push(task);
      task.cont = function (res, isErr) {
        if (completed) {
          return;
        }

        remove(tasks, task);
        task.cont = noop;
        if (isErr) {
          abort(res);
        } else {
          if (task === mainTask) {
            result = res;
          }
          if (!tasks.length) {
            completed = true;
            cb(result);
          }
        }
      };
      // task.cont.cancel = task.cancel
    }

    function cancelAll() {
      if (completed) {
        return;
      }
      completed = true;
      tasks.forEach(function (t) {
        t.cont = noop;
        t.cancel();
      });
      tasks = [];
    }

    return {
      addTask: addTask,
      cancelAll: cancelAll,
      abort: abort,
      getTasks: function getTasks() {
        return tasks;
      },
      taskNames: function taskNames() {
        return tasks.map(function (t) {
          return t.name;
        });
      }
    };
  }

  function createTaskIterator(_ref) {
    var context = _ref.context,
        fn = _ref.fn,
        args = _ref.args;

    if (is.iterator(fn)) {
      return fn;
    }

    // catch synchronous failures; see #152 and #441
    var result = void 0,
        error = void 0;
    try {
      result = fn.apply(context, args);
    } catch (err) {
      error = err;
    }

    // i.e. a generator function returns an iterator
    if (is.iterator(result)) {
      return result;
    }

    // do not bubble up synchronous failures for detached forks
    // instead create a failed task. See #152 and #441
    return error ? makeIterator(function () {
      throw error;
    }) : makeIterator(function () {
      var pc = void 0;
      var eff = { done: false, value: result };
      var ret = function ret(value) {
        return { done: true, value: value };
      };
      return function (arg) {
        if (!pc) {
          pc = true;
          return eff;
        } else {
          return ret(arg);
        }
      };
    }());
  }

  var wrapHelper = function wrapHelper(helper) {
    return { fn: helper };
  };

  function proc(iterator) {
    var subscribe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return noop;
    };
    var dispatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;
    var getState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : noop;
    var parentContext = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var parentEffectId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    var name = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'anonymous';
    var cont = arguments[8];

    check(iterator, is.iterator, NOT_ITERATOR_ERROR);

    var effectsString = '[...effects]';
    var runParallelEffect = deprecate(runAllEffect, updateIncentive(effectsString, 'all(' + effectsString + ')'));

    var sagaMonitor = options.sagaMonitor,
        logger = options.logger,
        onError = options.onError;

    var log$1 = logger || log;
    var logError = function logError(err) {
      var message = err.sagaStack;

      if (!message && err.stack) {
        message = err.stack.split('\n')[0].indexOf(err.message) !== -1 ? err.stack : 'Error: ' + err.message + '\n' + err.stack;
      }

      log$1('error', 'uncaught at ' + name, message || err.message || err);
    };
    var stdChannel$1 = stdChannel(subscribe);
    var taskContext = Object.create(parentContext);
    /**
      Tracks the current effect cancellation
      Each time the generator progresses. calling runEffect will set a new value
      on it. It allows propagating cancellation to child effects
    **/
    next.cancel = noop;

    /**
      Creates a new task descriptor for this generator, We'll also create a main task
      to track the main flow (besides other forked tasks)
    **/
    var task = newTask(parentEffectId, name, iterator, cont);
    var mainTask = { name: name, cancel: cancelMain, isRunning: true };
    var taskQueue = forkQueue(name, mainTask, end);

    /**
      cancellation of the main task. We'll simply resume the Generator with a Cancel
    **/
    function cancelMain() {
      if (mainTask.isRunning && !mainTask.isCancelled) {
        mainTask.isCancelled = true;
        next(TASK_CANCEL);
      }
    }

    /**
      This may be called by a parent generator to trigger/propagate cancellation
      cancel all pending tasks (including the main task), then end the current task.
       Cancellation propagates down to the whole execution tree holded by this Parent task
      It's also propagated to all joiners of this task and their execution tree/joiners
       Cancellation is noop for terminated/Cancelled tasks tasks
    **/
    function cancel() {
      /**
        We need to check both Running and Cancelled status
        Tasks can be Cancelled but still Running
      **/
      if (iterator._isRunning && !iterator._isCancelled) {
        iterator._isCancelled = true;
        taskQueue.cancelAll();
        /**
          Ending with a Never result will propagate the Cancellation to all joiners
        **/
        end(TASK_CANCEL);
      }
    }
    /**
      attaches cancellation logic to this task's continuation
      this will permit cancellation to propagate down the call chain
    **/
    cont && (cont.cancel = cancel);

    // tracks the running status
    iterator._isRunning = true;

    // kicks up the generator
    next();

    // then return the task descriptor to the caller
    return task;

    /**
      This is the generator driver
      It's a recursive async/continuation function which calls itself
      until the generator terminates or throws
    **/
    function next(arg, isErr) {
      // Preventive measure. If we end up here, then there is really something wrong
      if (!mainTask.isRunning) {
        throw new Error('Trying to resume an already finished generator');
      }

      try {
        var result = void 0;
        if (isErr) {
          result = iterator.throw(arg);
        } else if (arg === TASK_CANCEL) {
          /**
            getting TASK_CANCEL automatically cancels the main task
            We can get this value here
             - By cancelling the parent task manually
            - By joining a Cancelled task
          **/
          mainTask.isCancelled = true;
          /**
            Cancels the current effect; this will propagate the cancellation down to any called tasks
          **/
          next.cancel();
          /**
            If this Generator has a `return` method then invokes it
            This will jump to the finally block
          **/
          result = is.func(iterator.return) ? iterator.return(TASK_CANCEL) : { done: true, value: TASK_CANCEL };
        } else if (arg === CHANNEL_END) {
          // We get CHANNEL_END by taking from a channel that ended using `take` (and not `takem` used to trap End of channels)
          result = is.func(iterator.return) ? iterator.return() : { done: true };
        } else {
          result = iterator.next(arg);
        }

        if (!result.done) {
          runEffect(result.value, parentEffectId, '', next);
        } else {
          /**
            This Generator has ended, terminate the main task and notify the fork queue
          **/
          mainTask.isMainRunning = false;
          mainTask.cont && mainTask.cont(result.value);
        }
      } catch (error) {
        if (mainTask.isCancelled) {
          logError(error);
        }
        mainTask.isMainRunning = false;
        mainTask.cont(error, true);
      }
    }

    function end(result, isErr) {
      iterator._isRunning = false;
      stdChannel$1.close();
      if (!isErr) {
        iterator._result = result;
        iterator._deferredEnd && iterator._deferredEnd.resolve(result);
      } else {
        if (result instanceof Error) {
          Object.defineProperty(result, 'sagaStack', {
            value: 'at ' + name + ' \n ' + (result.sagaStack || result.stack),
            configurable: true
          });
        }
        if (!task.cont) {
          if (result instanceof Error && onError) {
            onError(result);
          } else {
            logError(result);
          }
        }
        iterator._error = result;
        iterator._isAborted = true;
        iterator._deferredEnd && iterator._deferredEnd.reject(result);
      }
      task.cont && task.cont(result, isErr);
      task.joiners.forEach(function (j) {
        return j.cb(result, isErr);
      });
      task.joiners = null;
    }

    function runEffect(effect, parentEffectId) {
      var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var cb = arguments[3];

      var effectId = uid();
      sagaMonitor && sagaMonitor.effectTriggered({ effectId: effectId, parentEffectId: parentEffectId, label: label, effect: effect });

      /**
        completion callback and cancel callback are mutually exclusive
        We can't cancel an already completed effect
        And We can't complete an already cancelled effectId
      **/
      var effectSettled = void 0;

      // Completion callback passed to the appropriate effect runner
      function currCb(res, isErr) {
        if (effectSettled) {
          return;
        }

        effectSettled = true;
        cb.cancel = noop; // defensive measure
        if (sagaMonitor) {
          isErr ? sagaMonitor.effectRejected(effectId, res) : sagaMonitor.effectResolved(effectId, res);
        }
        cb(res, isErr);
      }
      // tracks down the current cancel
      currCb.cancel = noop;

      // setup cancellation logic on the parent cb
      cb.cancel = function () {
        // prevents cancelling an already completed effect
        if (effectSettled) {
          return;
        }

        effectSettled = true;
        /**
          propagates cancel downward
          catch uncaught cancellations errors; since we can no longer call the completion
          callback, log errors raised during cancellations into the console
        **/
        try {
          currCb.cancel();
        } catch (err) {
          logError(err);
        }
        currCb.cancel = noop; // defensive measure

        sagaMonitor && sagaMonitor.effectCancelled(effectId);
      };

      /**
        each effect runner must attach its own logic of cancellation to the provided callback
        it allows this generator to propagate cancellation downward.
         ATTENTION! effect runners must setup the cancel logic by setting cb.cancel = [cancelMethod]
        And the setup must occur before calling the callback
         This is a sort of inversion of control: called async functions are responsible
        for completing the flow by calling the provided continuation; while caller functions
        are responsible for aborting the current flow by calling the attached cancel function
         Library users can attach their own cancellation logic to promises by defining a
        promise[CANCEL] method in their returned promises
        ATTENTION! calling cancel must have no effect on an already completed or cancelled effect
      **/
      var data = void 0;
      // prettier-ignore
      return (
        // Non declarative effect
        is.promise(effect) ? resolvePromise(effect, currCb) : is.helper(effect) ? runForkEffect(wrapHelper(effect), effectId, currCb) : is.iterator(effect) ? resolveIterator(effect, effectId, name, currCb)

        // declarative effects
        : is.array(effect) ? runParallelEffect(effect, effectId, currCb) : (data = asEffect.take(effect)) ? runTakeEffect(data, currCb) : (data = asEffect.put(effect)) ? runPutEffect(data, currCb) : (data = asEffect.all(effect)) ? runAllEffect(data, effectId, currCb) : (data = asEffect.race(effect)) ? runRaceEffect(data, effectId, currCb) : (data = asEffect.call(effect)) ? runCallEffect(data, effectId, currCb) : (data = asEffect.cps(effect)) ? runCPSEffect(data, currCb) : (data = asEffect.fork(effect)) ? runForkEffect(data, effectId, currCb) : (data = asEffect.join(effect)) ? runJoinEffect(data, currCb) : (data = asEffect.cancel(effect)) ? runCancelEffect(data, currCb) : (data = asEffect.select(effect)) ? runSelectEffect(data, currCb) : (data = asEffect.actionChannel(effect)) ? runChannelEffect(data, currCb) : (data = asEffect.flush(effect)) ? runFlushEffect(data, currCb) : (data = asEffect.cancelled(effect)) ? runCancelledEffect(data, currCb) : (data = asEffect.getContext(effect)) ? runGetContextEffect(data, currCb) : (data = asEffect.setContext(effect)) ? runSetContextEffect(data, currCb) : /* anything else returned as is */currCb(effect)
      );
    }

    function resolvePromise(promise, cb) {
      var cancelPromise = promise[CANCEL];
      if (is.func(cancelPromise)) {
        cb.cancel = cancelPromise;
      } else if (is.func(promise.abort)) {
        cb.cancel = function () {
          return promise.abort();
        };
        // TODO: add support for the fetch API, whenever they get around to
        // adding cancel support
      }
      promise.then(cb, function (error) {
        return cb(error, true);
      });
    }

    function resolveIterator(iterator, effectId, name, cb) {
      proc(iterator, subscribe, dispatch, getState, taskContext, options, effectId, name, cb);
    }

    function runTakeEffect(_ref2, cb) {
      var channel = _ref2.channel,
          pattern = _ref2.pattern,
          maybe = _ref2.maybe;

      channel = channel || stdChannel$1;
      var takeCb = function takeCb(inp) {
        return inp instanceof Error ? cb(inp, true) : isEnd(inp) && !maybe ? cb(CHANNEL_END) : cb(inp);
      };
      try {
        channel.take(takeCb, matcher(pattern));
      } catch (err) {
        return cb(err, true);
      }
      cb.cancel = takeCb.cancel;
    }

    function runPutEffect(_ref3, cb) {
      var channel = _ref3.channel,
          action = _ref3.action,
          resolve = _ref3.resolve;

      /**
        Schedule the put in case another saga is holding a lock.
        The put will be executed atomically. ie nested puts will execute after
        this put has terminated.
      **/
      asap(function () {
        var result = void 0;
        try {
          result = (channel ? channel.put : dispatch)(action);
        } catch (error) {
          // If we have a channel or `put.resolve` was used then bubble up the error.
          if (channel || resolve) return cb(error, true);
          logError(error);
        }

        if (resolve && is.promise(result)) {
          resolvePromise(result, cb);
        } else {
          return cb(result);
        }
      });
      // Put effects are non cancellables
    }

    function runCallEffect(_ref4, effectId, cb) {
      var context = _ref4.context,
          fn = _ref4.fn,
          args = _ref4.args;

      var result = void 0;
      // catch synchronous failures; see #152
      try {
        result = fn.apply(context, args);
      } catch (error) {
        return cb(error, true);
      }
      return is.promise(result) ? resolvePromise(result, cb) : is.iterator(result) ? resolveIterator(result, effectId, fn.name, cb) : cb(result);
    }

    function runCPSEffect(_ref5, cb) {
      var context = _ref5.context,
          fn = _ref5.fn,
          args = _ref5.args;

      // CPS (ie node style functions) can define their own cancellation logic
      // by setting cancel field on the cb

      // catch synchronous failures; see #152
      try {
        var cpsCb = function cpsCb(err, res) {
          return is.undef(err) ? cb(res) : cb(err, true);
        };
        fn.apply(context, args.concat(cpsCb));
        if (cpsCb.cancel) {
          cb.cancel = function () {
            return cpsCb.cancel();
          };
        }
      } catch (error) {
        return cb(error, true);
      }
    }

    function runForkEffect(_ref6, effectId, cb) {
      var context = _ref6.context,
          fn = _ref6.fn,
          args = _ref6.args,
          detached = _ref6.detached;

      var taskIterator = createTaskIterator({ context: context, fn: fn, args: args });

      try {
        suspend();
        var _task = proc(taskIterator, subscribe, dispatch, getState, taskContext, options, effectId, fn.name, detached ? null : noop);

        if (detached) {
          cb(_task);
        } else {
          if (taskIterator._isRunning) {
            taskQueue.addTask(_task);
            cb(_task);
          } else if (taskIterator._error) {
            taskQueue.abort(taskIterator._error);
          } else {
            cb(_task);
          }
        }
      } finally {
        flush();
      }
      // Fork effects are non cancellables
    }

    function runJoinEffect(t, cb) {
      if (t.isRunning()) {
        var joiner = { task: task, cb: cb };
        cb.cancel = function () {
          return remove(t.joiners, joiner);
        };
        t.joiners.push(joiner);
      } else {
        t.isAborted() ? cb(t.error(), true) : cb(t.result());
      }
    }

    function runCancelEffect(taskToCancel, cb) {
      if (taskToCancel === SELF_CANCELLATION) {
        taskToCancel = task;
      }
      if (taskToCancel.isRunning()) {
        taskToCancel.cancel();
      }
      cb();
      // cancel effects are non cancellables
    }

    function runAllEffect(effects, effectId, cb) {
      var keys = Object.keys(effects);

      if (!keys.length) {
        return cb(is.array(effects) ? [] : {});
      }

      var completedCount = 0;
      var completed = void 0;
      var results = {};
      var childCbs = {};

      function checkEffectEnd() {
        if (completedCount === keys.length) {
          completed = true;
          cb(is.array(effects) ? array.from(_extends$2({}, results, { length: keys.length })) : results);
        }
      }

      keys.forEach(function (key) {
        var chCbAtKey = function chCbAtKey(res, isErr) {
          if (completed) {
            return;
          }
          if (isErr || isEnd(res) || res === CHANNEL_END || res === TASK_CANCEL) {
            cb.cancel();
            cb(res, isErr);
          } else {
            results[key] = res;
            completedCount++;
            checkEffectEnd();
          }
        };
        chCbAtKey.cancel = noop;
        childCbs[key] = chCbAtKey;
      });

      cb.cancel = function () {
        if (!completed) {
          completed = true;
          keys.forEach(function (key) {
            return childCbs[key].cancel();
          });
        }
      };

      keys.forEach(function (key) {
        return runEffect(effects[key], effectId, key, childCbs[key]);
      });
    }

    function runRaceEffect(effects, effectId, cb) {
      var completed = void 0;
      var keys = Object.keys(effects);
      var childCbs = {};

      keys.forEach(function (key) {
        var chCbAtKey = function chCbAtKey(res, isErr) {
          if (completed) {
            return;
          }

          if (isErr) {
            // Race Auto cancellation
            cb.cancel();
            cb(res, true);
          } else if (!isEnd(res) && res !== CHANNEL_END && res !== TASK_CANCEL) {
            var _response;

            cb.cancel();
            completed = true;
            var response = (_response = {}, _response[key] = res, _response);
            cb(is.array(effects) ? [].slice.call(_extends$2({}, response, { length: keys.length })) : response);
          }
        };
        chCbAtKey.cancel = noop;
        childCbs[key] = chCbAtKey;
      });

      cb.cancel = function () {
        // prevents unnecessary cancellation
        if (!completed) {
          completed = true;
          keys.forEach(function (key) {
            return childCbs[key].cancel();
          });
        }
      };
      keys.forEach(function (key) {
        if (completed) {
          return;
        }
        runEffect(effects[key], effectId, key, childCbs[key]);
      });
    }

    function runSelectEffect(_ref7, cb) {
      var selector = _ref7.selector,
          args = _ref7.args;

      try {
        var state = selector.apply(undefined, [getState()].concat(args));
        cb(state);
      } catch (error) {
        cb(error, true);
      }
    }

    function runChannelEffect(_ref8, cb) {
      var pattern = _ref8.pattern,
          buffer = _ref8.buffer;

      var match = matcher(pattern);
      match.pattern = pattern;
      cb(eventChannel(subscribe, buffer || buffers.fixed(), match));
    }

    function runCancelledEffect(data, cb) {
      cb(!!mainTask.isCancelled);
    }

    function runFlushEffect(channel, cb) {
      channel.flush(cb);
    }

    function runGetContextEffect(prop, cb) {
      cb(taskContext[prop]);
    }

    function runSetContextEffect(props, cb) {
      object.assign(taskContext, props);
      cb();
    }

    function newTask(id, name, iterator, cont) {
      var _done, _ref9, _mutatorMap;

      iterator._deferredEnd = null;
      return _ref9 = {}, _ref9[TASK] = true, _ref9.id = id, _ref9.name = name, _done = 'done', _mutatorMap = {}, _mutatorMap[_done] = _mutatorMap[_done] || {}, _mutatorMap[_done].get = function () {
        if (iterator._deferredEnd) {
          return iterator._deferredEnd.promise;
        } else {
          var def = deferred();
          iterator._deferredEnd = def;
          if (!iterator._isRunning) {
            iterator._error ? def.reject(iterator._error) : def.resolve(iterator._result);
          }
          return def.promise;
        }
      }, _ref9.cont = cont, _ref9.joiners = [], _ref9.cancel = cancel, _ref9.isRunning = function isRunning() {
        return iterator._isRunning;
      }, _ref9.isCancelled = function isCancelled() {
        return iterator._isCancelled;
      }, _ref9.isAborted = function isAborted() {
        return iterator._isAborted;
      }, _ref9.result = function result() {
        return iterator._result;
      }, _ref9.error = function error() {
        return iterator._error;
      }, _ref9.setContext = function setContext(props) {
        check(props, is.object, createSetContextWarning('task', props));
        object.assign(taskContext, props);
      }, _defineEnumerableProperties(_ref9, _mutatorMap), _ref9;
    }
  }

  var RUN_SAGA_SIGNATURE = 'runSaga(storeInterface, saga, ...args)';
  var NON_GENERATOR_ERR = RUN_SAGA_SIGNATURE + ': saga argument must be a Generator function!';

  function runSaga(storeInterface, saga) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var iterator = void 0;

    if (is.iterator(storeInterface)) {
      if (process.env.NODE_ENV === 'development') {
        log('warn', 'runSaga(iterator, storeInterface) has been deprecated in favor of ' + RUN_SAGA_SIGNATURE);
      }
      iterator = storeInterface;
      storeInterface = saga;
    } else {
      check(saga, is.func, NON_GENERATOR_ERR);
      iterator = saga.apply(undefined, args);
      check(iterator, is.iterator, NON_GENERATOR_ERR);
    }

    var _storeInterface = storeInterface,
        subscribe = _storeInterface.subscribe,
        dispatch = _storeInterface.dispatch,
        getState = _storeInterface.getState,
        context = _storeInterface.context,
        sagaMonitor = _storeInterface.sagaMonitor,
        logger = _storeInterface.logger,
        onError = _storeInterface.onError;


    var effectId = uid();

    if (sagaMonitor) {
      // monitors are expected to have a certain interface, let's fill-in any missing ones
      sagaMonitor.effectTriggered = sagaMonitor.effectTriggered || noop;
      sagaMonitor.effectResolved = sagaMonitor.effectResolved || noop;
      sagaMonitor.effectRejected = sagaMonitor.effectRejected || noop;
      sagaMonitor.effectCancelled = sagaMonitor.effectCancelled || noop;
      sagaMonitor.actionDispatched = sagaMonitor.actionDispatched || noop;

      sagaMonitor.effectTriggered({ effectId: effectId, root: true, parentEffectId: 0, effect: { root: true, saga: saga, args: args } });
    }

    var task = proc(iterator, subscribe, wrapSagaDispatch(dispatch), getState, context, { sagaMonitor: sagaMonitor, logger: logger, onError: onError }, effectId, saga.name);

    if (sagaMonitor) {
      sagaMonitor.effectResolved(effectId, task);
    }

    return task;
  }

  function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

  function sagaMiddlewareFactory() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _ref$context = _ref.context,
        context = _ref$context === undefined ? {} : _ref$context,
        options = _objectWithoutProperties(_ref, ['context']);

    var sagaMonitor = options.sagaMonitor,
        logger = options.logger,
        onError = options.onError;


    if (is.func(options)) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Saga middleware no longer accept Generator functions. Use sagaMiddleware.run instead');
      } else {
        throw new Error('You passed a function to the Saga middleware. You are likely trying to start a        Saga by directly passing it to the middleware. This is no longer possible starting from 0.10.0.        To run a Saga, you must do it dynamically AFTER mounting the middleware into the store.\n        Example:\n          import createSagaMiddleware from \'redux-saga\'\n          ... other imports\n\n          const sagaMiddleware = createSagaMiddleware()\n          const store = createStore(reducer, applyMiddleware(sagaMiddleware))\n          sagaMiddleware.run(saga, ...args)\n      ');
      }
    }

    if (logger && !is.func(logger)) {
      throw new Error('`options.logger` passed to the Saga middleware is not a function!');
    }

    if (process.env.NODE_ENV === 'development' && options.onerror) {
      throw new Error('`options.onerror` was removed. Use `options.onError` instead.');
    }

    if (onError && !is.func(onError)) {
      throw new Error('`options.onError` passed to the Saga middleware is not a function!');
    }

    if (options.emitter && !is.func(options.emitter)) {
      throw new Error('`options.emitter` passed to the Saga middleware is not a function!');
    }

    function sagaMiddleware(_ref2) {
      var getState = _ref2.getState,
          dispatch = _ref2.dispatch;

      var sagaEmitter = emitter();
      sagaEmitter.emit = (options.emitter || ident)(sagaEmitter.emit);

      sagaMiddleware.run = runSaga.bind(null, {
        context: context,
        subscribe: sagaEmitter.subscribe,
        dispatch: dispatch,
        getState: getState,
        sagaMonitor: sagaMonitor,
        logger: logger,
        onError: onError
      });

      return function (next) {
        return function (action) {
          if (sagaMonitor && sagaMonitor.actionDispatched) {
            sagaMonitor.actionDispatched(action);
          }
          var result = next(action); // hit reducers
          sagaEmitter.emit(action);
          return result;
        };
      };
    }

    sagaMiddleware.run = function () {
      throw new Error('Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware');
    };

    sagaMiddleware.setContext = function (props) {
      check(props, is.object, createSetContextWarning('sagaMiddleware', props));
      object.assign(context, props);
    };

    return sagaMiddleware;
  }

  var done = { done: true, value: undefined };
  var qEnd = {};

  function safeName(patternOrChannel) {
    if (is.channel(patternOrChannel)) {
      return 'channel';
    } else if (Array.isArray(patternOrChannel)) {
      return String(patternOrChannel.map(function (entry) {
        return String(entry);
      }));
    } else {
      return String(patternOrChannel);
    }
  }

  function fsmIterator(fsm, q0) {
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iterator';

    var updateState = void 0,
        qNext = q0;

    function next(arg, error) {
      if (qNext === qEnd) {
        return done;
      }

      if (error) {
        qNext = qEnd;
        throw error;
      } else {
        updateState && updateState(arg);

        var _fsm$qNext = fsm[qNext](),
            q = _fsm$qNext[0],
            output = _fsm$qNext[1],
            _updateState = _fsm$qNext[2];

        qNext = q;
        updateState = _updateState;
        return qNext === qEnd ? done : output;
      }
    }

    return makeIterator(next, function (error) {
      return next(null, error);
    }, name, true);
  }

  function takeEvery(patternOrChannel, worker) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var yTake = { done: false, value: take(patternOrChannel) };
    var yFork = function yFork(ac) {
      return { done: false, value: fork.apply(undefined, [worker].concat(args, [ac])) };
    };

    var action = void 0,
        setAction = function setAction(ac) {
      return action = ac;
    };

    return fsmIterator({
      q1: function q1() {
        return ['q2', yTake, setAction];
      },
      q2: function q2() {
        return action === END ? [qEnd] : ['q1', yFork(action)];
      }
    }, 'q1', 'takeEvery(' + safeName(patternOrChannel) + ', ' + worker.name + ')');
  }

  function takeLatest(patternOrChannel, worker) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var yTake = { done: false, value: take(patternOrChannel) };
    var yFork = function yFork(ac) {
      return { done: false, value: fork.apply(undefined, [worker].concat(args, [ac])) };
    };
    var yCancel = function yCancel(task) {
      return { done: false, value: cancel(task) };
    };

    var task = void 0,
        action = void 0;
    var setTask = function setTask(t) {
      return task = t;
    };
    var setAction = function setAction(ac) {
      return action = ac;
    };

    return fsmIterator({
      q1: function q1() {
        return ['q2', yTake, setAction];
      },
      q2: function q2() {
        return action === END ? [qEnd] : task ? ['q3', yCancel(task)] : ['q1', yFork(action), setTask];
      },
      q3: function q3() {
        return ['q1', yFork(action), setTask];
      }
    }, 'q1', 'takeLatest(' + safeName(patternOrChannel) + ', ' + worker.name + ')');
  }

  function throttle(delayLength, pattern, worker) {
    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    var action = void 0,
        channel = void 0;

    var yActionChannel = { done: false, value: actionChannel(pattern, buffers.sliding(1)) };
    var yTake = function yTake() {
      return { done: false, value: take(channel) };
    };
    var yFork = function yFork(ac) {
      return { done: false, value: fork.apply(undefined, [worker].concat(args, [ac])) };
    };
    var yDelay = { done: false, value: call(delay, delayLength) };

    var setAction = function setAction(ac) {
      return action = ac;
    };
    var setChannel = function setChannel(ch) {
      return channel = ch;
    };

    return fsmIterator({
      q1: function q1() {
        return ['q2', yActionChannel, setChannel];
      },
      q2: function q2() {
        return ['q3', yTake(), setAction];
      },
      q3: function q3() {
        return action === END ? [qEnd] : ['q4', yFork(action)];
      },
      q4: function q4() {
        return ['q2', yDelay];
      }
    }, 'q1', 'throttle(' + safeName(pattern) + ', ' + worker.name + ')');
  }

  function takeEvery$1(patternOrChannel, worker) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return fork.apply(undefined, [takeEvery, patternOrChannel, worker].concat(args));
  }

  function takeLatest$1(patternOrChannel, worker) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    return fork.apply(undefined, [takeLatest, patternOrChannel, worker].concat(args));
  }

  function throttle$1(ms, pattern, worker) {
    for (var _len3 = arguments.length, args = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
      args[_key3 - 3] = arguments[_key3];
    }

    return fork.apply(undefined, [throttle, ms, pattern, worker].concat(args));
  }

  var effects = /*#__PURE__*/Object.freeze({
    __proto__: null,
    take: take,
    takem: takem,
    put: put,
    all: all,
    race: race,
    call: call,
    apply: apply,
    cps: cps,
    fork: fork,
    spawn: spawn,
    join: join,
    cancel: cancel,
    select: select,
    actionChannel: actionChannel,
    cancelled: cancelled,
    flush: flush$1,
    getContext: getContext,
    setContext: setContext,
    takeEvery: takeEvery$1,
    takeLatest: takeLatest$1,
    throttle: throttle$1
  });

  function _typeof$2(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof$2 = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof$2 = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof$2(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  var isArray = Array.isArray.bind(Array);
  var isFunction = function isFunction(o) {
    return typeof o === 'function';
  };
  var returnSelf = function returnSelf(m) {
    return m;
  };
  var noop$1 = function noop() {};
  var findIndex = function findIndex(array, predicate) {
    for (var i = 0, length = array.length; i < length; i += 1) {
      if (predicate(array[i], i)) return i;
    }

    return -1;
  };

  function checkModel(model, existModels) {
    var namespace = model.namespace,
        reducers = model.reducers,
        effects = model.effects,
        subscriptions = model.subscriptions; // namespace 必须被定义

    invariant__default['default'](namespace, "[app.model] namespace should be defined"); // 并且是字符串

    invariant__default['default'](typeof namespace === 'string', "[app.model] namespace should be string, but got ".concat(_typeof$2(namespace))); // 并且唯一

    invariant__default['default'](!existModels.some(function (model) {
      return model.namespace === namespace;
    }), "[app.model] namespace should be unique"); // state 可以为任意值
    // reducers 可以为空，PlainObject 或者数组

    if (reducers) {
      invariant__default['default'](isPlainObject__default['default'](reducers) || isArray(reducers), "[app.model] reducers should be plain object or array, but got ".concat(_typeof$2(reducers))); // 数组的 reducers 必须是 [Object, Function] 的格式

      invariant__default['default'](!isArray(reducers) || isPlainObject__default['default'](reducers[0]) && isFunction(reducers[1]), "[app.model] reducers with array should be [Object, Function]");
    } // effects 可以为空，PlainObject


    if (effects) {
      invariant__default['default'](isPlainObject__default['default'](effects), "[app.model] effects should be plain object, but got ".concat(_typeof$2(effects)));
    }

    if (subscriptions) {
      // subscriptions 可以为空，PlainObject
      invariant__default['default'](isPlainObject__default['default'](subscriptions), "[app.model] subscriptions should be plain object, but got ".concat(_typeof$2(subscriptions))); // subscription 必须为函数

      invariant__default['default'](isAllFunction(subscriptions), "[app.model] subscription should be function");
    }
  }

  function isAllFunction(obj) {
    return Object.keys(obj).every(function (key) {
      return isFunction(obj[key]);
    });
  }

  var NAMESPACE_SEP = '/';

  function prefix(obj, namespace, type) {
    return Object.keys(obj).reduce(function (memo, key) {
      warning__default['default'](key.indexOf("".concat(namespace).concat(NAMESPACE_SEP)) !== 0, "[prefixNamespace]: ".concat(type, " ").concat(key, " should not be prefixed with namespace ").concat(namespace));
      var newKey = "".concat(namespace).concat(NAMESPACE_SEP).concat(key);
      memo[newKey] = obj[key];
      return memo;
    }, {});
  }

  function prefixNamespace(model) {
    var namespace = model.namespace,
        reducers = model.reducers,
        effects = model.effects;

    if (reducers) {
      if (isArray(reducers)) {
        model.reducers[0] = prefix(reducers[0], namespace, 'reducer');
      } else {
        model.reducers = prefix(reducers, namespace, 'reducer');
      }
    }

    if (effects) {
      model.effects = prefix(effects, namespace, 'effect');
    }

    return model;
  }

  var hooks = ['onError', 'onStateChange', 'onAction', 'onHmr', 'onReducer', 'onEffect', 'extraReducers', 'extraEnhancers', '_handleActions'];
  function filterHooks(obj) {
    return Object.keys(obj).reduce(function (memo, key) {
      if (hooks.indexOf(key) > -1) {
        memo[key] = obj[key];
      }

      return memo;
    }, {});
  }

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin() {
      _classCallCheck(this, Plugin);

      this._handleActions = null;
      this.hooks = hooks.reduce(function (memo, key) {
        memo[key] = [];
        return memo;
      }, {});
    }

    _createClass(Plugin, [{
      key: "use",
      value: function use(plugin) {
        invariant__default['default'](isPlainObject__default['default'](plugin), 'plugin.use: plugin should be plain object');
        var hooks = this.hooks;

        for (var key in plugin) {
          if (Object.prototype.hasOwnProperty.call(plugin, key)) {
            invariant__default['default'](hooks[key], "plugin.use: unknown plugin property: ".concat(key));

            if (key === '_handleActions') {
              this._handleActions = plugin[key];
            } else if (key === 'extraEnhancers') {
              hooks[key] = plugin[key];
            } else {
              hooks[key].push(plugin[key]);
            }
          }
        }
      }
    }, {
      key: "apply",
      value: function apply(key, defaultHandler) {
        var hooks = this.hooks;
        var validApplyHooks = ['onError', 'onHmr'];
        invariant__default['default'](validApplyHooks.indexOf(key) > -1, "plugin.apply: hook ".concat(key, " cannot be applied"));
        var fns = hooks[key];
        return function () {
          if (fns.length) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = fns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var fn = _step.value;
                fn.apply(void 0, arguments);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          } else if (defaultHandler) {
            defaultHandler.apply(void 0, arguments);
          }
        };
      }
    }, {
      key: "get",
      value: function get(key) {
        var hooks = this.hooks;
        invariant__default['default'](key in hooks, "plugin.get: hook ".concat(key, " cannot be got"));

        if (key === 'extraReducers') {
          return getExtraReducers(hooks[key]);
        } else if (key === 'onReducer') {
          return getOnReducer(hooks[key]);
        } else {
          return hooks[key];
        }
      }
    }]);

    return Plugin;
  }();

  function getExtraReducers(hook) {
    var ret = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = hook[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var reducerObj = _step2.value;
        ret = _objectSpread({}, ret, reducerObj);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return ret;
  }

  function getOnReducer(hook) {
    return function (reducer) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = hook[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var reducerEnhancer = _step3.value;
          reducer = reducerEnhancer(reducer);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return reducer;
    };
  }

  function createStore$1 (_ref) {
    var reducers = _ref.reducers,
        initialState = _ref.initialState,
        plugin = _ref.plugin,
        sagaMiddleware = _ref.sagaMiddleware,
        promiseMiddleware = _ref.promiseMiddleware,
        _ref$createOpts$setup = _ref.createOpts.setupMiddlewares,
        setupMiddlewares = _ref$createOpts$setup === void 0 ? returnSelf : _ref$createOpts$setup;
    // extra enhancers
    var extraEnhancers = plugin.get('extraEnhancers');
    invariant__default['default'](isArray(extraEnhancers), "[app.start] extraEnhancers should be array, but got ".concat(_typeof$2(extraEnhancers)));
    var extraMiddlewares = plugin.get('onAction');
    var middlewares = setupMiddlewares([promiseMiddleware, sagaMiddleware].concat(_toConsumableArray(flatten__default['default'](extraMiddlewares))));
    var composeEnhancers = process.env.NODE_ENV !== 'production' && win__default['default'].__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? win__default['default'].__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      maxAge: 30
    }) : compose;
    var enhancers = [applyMiddleware.apply(void 0, _toConsumableArray(middlewares))].concat(_toConsumableArray(extraEnhancers));
    return createStore(reducers, initialState, composeEnhancers.apply(void 0, _toConsumableArray(enhancers)));
  }

  function prefixType(type, model) {
    var prefixedType = "".concat(model.namespace).concat(NAMESPACE_SEP).concat(type);
    var typeWithoutAffix = prefixedType.replace(/\/@@[^/]+?$/, '');
    var reducer = Array.isArray(model.reducers) ? model.reducers[0][typeWithoutAffix] : model.reducers && model.reducers[typeWithoutAffix];

    if (reducer || model.effects && model.effects[typeWithoutAffix]) {
      return prefixedType;
    }

    return type;
  }

  function getSaga(effects$1, model, onError, onEffect) {
    var opts = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    return (
      /*#__PURE__*/
      _regeneratorRuntime__default['default'].mark(function _callee3() {
        var key;
        return _regeneratorRuntime__default['default'].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.t0 = _regeneratorRuntime__default['default'].keys(effects$1);

              case 1:
                if ((_context3.t1 = _context3.t0()).done) {
                  _context3.next = 7;
                  break;
                }

                key = _context3.t1.value;

                if (!Object.prototype.hasOwnProperty.call(effects$1, key)) {
                  _context3.next = 5;
                  break;
                }

                return _context3.delegateYield(
                /*#__PURE__*/
                _regeneratorRuntime__default['default'].mark(function _callee2() {
                  var watcher, task;
                  return _regeneratorRuntime__default['default'].wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          watcher = getWatcher(key, effects$1[key], model, onError, onEffect, opts);
                          _context2.next = 3;
                          return fork(watcher);

                        case 3:
                          task = _context2.sent;
                          _context2.next = 6;
                          return fork(
                          /*#__PURE__*/
                          _regeneratorRuntime__default['default'].mark(function _callee() {
                            return _regeneratorRuntime__default['default'].wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    _context.next = 2;
                                    return take("".concat(model.namespace, "/@@CANCEL_EFFECTS"));

                                  case 2:
                                    _context.next = 4;
                                    return cancel(task);

                                  case 4:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                        case 6:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                })(), "t2", 5);

              case 5:
                _context3.next = 1;
                break;

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      })
    );
  }

  function getWatcher(key, _effect, model, onError, onEffect, opts) {
    var _marked =
    /*#__PURE__*/
    _regeneratorRuntime__default['default'].mark(sagaWithCatch);

    var effect = _effect;
    var type = 'takeEvery';
    var ms;
    var delayMs;

    if (Array.isArray(_effect)) {
      var _effect2 = _slicedToArray(_effect, 1);

      effect = _effect2[0];
      var _opts = _effect[1];

      if (_opts && _opts.type) {
        type = _opts.type;

        if (type === 'throttle') {
          invariant__default['default'](_opts.ms, 'app.start: opts.ms should be defined if type is throttle');
          ms = _opts.ms;
        }

        if (type === 'poll') {
          invariant__default['default'](_opts.delay, 'app.start: opts.delay should be defined if type is poll');
          delayMs = _opts.delay;
        }
      }

      invariant__default['default'](['watcher', 'takeEvery', 'takeLatest', 'throttle', 'poll'].indexOf(type) > -1, 'app.start: effect type should be takeEvery, takeLatest, throttle, poll or watcher');
    }

    function noop() {}

    function sagaWithCatch() {
      var _len,
          args,
          _key,
          _ref,
          _ref$__dva_resolve,
          resolve,
          _ref$__dva_reject,
          reject,
          ret,
          _args4 = arguments;

      return _regeneratorRuntime__default['default'].wrap(function sagaWithCatch$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              for (_len = _args4.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = _args4[_key];
              }

              _ref = args.length > 0 ? args[0] : {}, _ref$__dva_resolve = _ref.__dva_resolve, resolve = _ref$__dva_resolve === void 0 ? noop : _ref$__dva_resolve, _ref$__dva_reject = _ref.__dva_reject, reject = _ref$__dva_reject === void 0 ? noop : _ref$__dva_reject;
              _context4.prev = 2;
              _context4.next = 5;
              return put({
                type: "".concat(key).concat(NAMESPACE_SEP, "@@start")
              });

            case 5:
              _context4.next = 7;
              return effect.apply(void 0, _toConsumableArray(args.concat(createEffects(model, opts))));

            case 7:
              ret = _context4.sent;
              _context4.next = 10;
              return put({
                type: "".concat(key).concat(NAMESPACE_SEP, "@@end")
              });

            case 10:
              resolve(ret);
              _context4.next = 17;
              break;

            case 13:
              _context4.prev = 13;
              _context4.t0 = _context4["catch"](2);
              onError(_context4.t0, {
                key: key,
                effectArgs: args
              });

              if (!_context4.t0._dontReject) {
                reject(_context4.t0);
              }

            case 17:
            case "end":
              return _context4.stop();
          }
        }
      }, _marked, null, [[2, 13]]);
    }

    var sagaWithOnEffect = applyOnEffect(onEffect, sagaWithCatch, model, key);

    switch (type) {
      case 'watcher':
        return sagaWithCatch;

      case 'takeLatest':
        return (
          /*#__PURE__*/
          _regeneratorRuntime__default['default'].mark(function _callee4() {
            return _regeneratorRuntime__default['default'].wrap(function _callee4$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return takeLatest$1(key, sagaWithOnEffect);

                  case 2:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee4);
          })
        );

      case 'throttle':
        return (
          /*#__PURE__*/
          _regeneratorRuntime__default['default'].mark(function _callee5() {
            return _regeneratorRuntime__default['default'].wrap(function _callee5$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return throttle$1(ms, key, sagaWithOnEffect);

                  case 2:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee5);
          })
        );

      case 'poll':
        return (
          /*#__PURE__*/
          _regeneratorRuntime__default['default'].mark(function _callee6() {
            var _marked2, delay, pollSagaWorker, call$1, take$1, race$1, action;

            return _regeneratorRuntime__default['default'].wrap(function _callee6$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    pollSagaWorker = function _ref3(sagaEffects, action) {
                      var call;
                      return _regeneratorRuntime__default['default'].wrap(function pollSagaWorker$(_context7) {
                        while (1) {
                          switch (_context7.prev = _context7.next) {
                            case 0:
                              call = sagaEffects.call;

                            case 1:

                              _context7.next = 4;
                              return call(sagaWithOnEffect, action);

                            case 4:
                              _context7.next = 6;
                              return call(delay, delayMs);

                            case 6:
                              _context7.next = 1;
                              break;

                            case 8:
                            case "end":
                              return _context7.stop();
                          }
                        }
                      }, _marked2);
                    };

                    delay = function _ref2(timeout) {
                      return new Promise(function (resolve) {
                        return setTimeout(resolve, timeout);
                      });
                    };

                    _marked2 =
                    /*#__PURE__*/
                    _regeneratorRuntime__default['default'].mark(pollSagaWorker);
                    call$1 = call, take$1 = take, race$1 = race;

                  case 4:

                    _context8.next = 7;
                    return take$1("".concat(key, "-start"));

                  case 7:
                    action = _context8.sent;
                    _context8.next = 10;
                    return race$1([call$1(pollSagaWorker, effects, action), take$1("".concat(key, "-stop"))]);

                  case 10:
                    _context8.next = 4;
                    break;

                  case 12:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee6);
          })
        );

      default:
        return (
          /*#__PURE__*/
          _regeneratorRuntime__default['default'].mark(function _callee7() {
            return _regeneratorRuntime__default['default'].wrap(function _callee7$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return takeEvery$1(key, sagaWithOnEffect);

                  case 2:
                  case "end":
                    return _context9.stop();
                }
              }
            }, _callee7);
          })
        );
    }
  }

  function createEffects(model, opts) {
    function assertAction(type, name) {
      invariant__default['default'](type, 'dispatch: action should be a plain Object with type');
      var _opts$namespacePrefix = opts.namespacePrefixWarning,
          namespacePrefixWarning = _opts$namespacePrefix === void 0 ? true : _opts$namespacePrefix;

      if (namespacePrefixWarning) {
        warning__default['default'](type.indexOf("".concat(model.namespace).concat(NAMESPACE_SEP)) !== 0, "[".concat(name, "] ").concat(type, " should not be prefixed with namespace ").concat(model.namespace));
      }
    }

    function put$1(action) {
      var type = action.type;
      assertAction(type, 'sagaEffects.put');
      return put(_objectSpread({}, action, {
        type: prefixType(type, model)
      }));
    } // The operator `put` doesn't block waiting the returned promise to resolve.
    // Using `put.resolve` will wait until the promsie resolve/reject before resuming.
    // It will be helpful to organize multi-effects in order,
    // and increase the reusability by seperate the effect in stand-alone pieces.
    // https://github.com/redux-saga/redux-saga/issues/336


    function putResolve(action) {
      var type = action.type;
      assertAction(type, 'sagaEffects.put.resolve');
      return put.resolve(_objectSpread({}, action, {
        type: prefixType(type, model)
      }));
    }

    put$1.resolve = putResolve;

    function take$1(type) {
      if (typeof type === 'string') {
        assertAction(type, 'sagaEffects.take');
        return take(prefixType(type, model));
      } else if (Array.isArray(type)) {
        return take(type.map(function (t) {
          if (typeof t === 'string') {
            assertAction(t, 'sagaEffects.take');
            return prefixType(t, model);
          }

          return t;
        }));
      } else {
        return take(type);
      }
    }

    return _objectSpread({}, effects, {
      put: put$1,
      take: take$1
    });
  }

  function applyOnEffect(fns, effect, model, key) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = fns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var fn = _step.value;
        effect = fn(effect, effects, model, key);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return effect;
  }

  function identify(value) {
    return value;
  }

  function handleAction(actionType) {
    var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identify;
    return function (state, action) {
      var type = action.type;
      invariant__default['default'](type, 'dispatch: action should be a plain Object with type');

      if (actionType === type) {
        return reducer(state, action);
      }

      return state;
    };
  }

  function reduceReducers() {
    for (var _len = arguments.length, reducers = new Array(_len), _key = 0; _key < _len; _key++) {
      reducers[_key] = arguments[_key];
    }

    return function (previous, current) {
      return reducers.reduce(function (p, r) {
        return r(p, current);
      }, previous);
    };
  }

  function handleActions(handlers, defaultState) {
    var reducers = Object.keys(handlers).map(function (type) {
      return handleAction(type, handlers[type]);
    });
    var reducer = reduceReducers.apply(void 0, _toConsumableArray(reducers));
    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
      var action = arguments.length > 1 ? arguments[1] : undefined;
      return reducer(state, action);
    };
  }

  function getReducer(reducers, state, handleActions$1) {
    // Support reducer enhancer
    // e.g. reducers: [realReducers, enhancer]
    if (Array.isArray(reducers)) {
      return reducers[1]((handleActions$1 || handleActions)(reducers[0], state));
    } else {
      return (handleActions$1 || handleActions)(reducers || {}, state);
    }
  }

  function createPromiseMiddleware(app) {
    return function () {
      return function (next) {
        return function (action) {
          var type = action.type;

          if (isEffect(type)) {
            return new Promise(function (resolve, reject) {
              next(_objectSpread({
                __dva_resolve: resolve,
                __dva_reject: reject
              }, action));
            });
          } else {
            return next(action);
          }
        };
      };
    };

    function isEffect(type) {
      if (!type || typeof type !== 'string') return false;

      var _type$split = type.split(NAMESPACE_SEP),
          _type$split2 = _slicedToArray(_type$split, 1),
          namespace = _type$split2[0];

      var model = app._models.filter(function (m) {
        return m.namespace === namespace;
      })[0];

      if (model) {
        if (model.effects && model.effects[type]) {
          return true;
        }
      }

      return false;
    }
  }

  function prefixedDispatch(dispatch, model) {
    return function (action) {
      var type = action.type;
      invariant__default['default'](type, 'dispatch: action should be a plain Object with type');
      warning__default['default'](type.indexOf("".concat(model.namespace).concat(NAMESPACE_SEP)) !== 0, "dispatch: ".concat(type, " should not be prefixed with namespace ").concat(model.namespace));
      return dispatch(_objectSpread({}, action, {
        type: prefixType(type, model)
      }));
    };
  }

  function run(subs, model, app, onError) {
    var funcs = [];
    var nonFuncs = [];

    for (var key in subs) {
      if (Object.prototype.hasOwnProperty.call(subs, key)) {
        var sub = subs[key];
        var unlistener = sub({
          dispatch: prefixedDispatch(app._store.dispatch, model),
          history: app._history
        }, onError);

        if (isFunction(unlistener)) {
          funcs.push(unlistener);
        } else {
          nonFuncs.push(key);
        }
      }
    }

    return {
      funcs: funcs,
      nonFuncs: nonFuncs
    };
  }
  function unlisten(unlisteners, namespace) {
    if (!unlisteners[namespace]) return;
    var _unlisteners$namespac = unlisteners[namespace],
        funcs = _unlisteners$namespac.funcs,
        nonFuncs = _unlisteners$namespac.nonFuncs;
    warning__default['default'](nonFuncs.length === 0, "[app.unmodel] subscription should return unlistener function, check these subscriptions ".concat(nonFuncs.join(', ')));
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = funcs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var unlistener = _step.value;
        unlistener();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    delete unlisteners[namespace];
  }

  var noop$1$1 = noop$1,
      findIndex$1 = findIndex; // Internal model to update global state when do unmodel

  var dvaModel = {
    namespace: '@@dva',
    state: 0,
    reducers: {
      UPDATE: function UPDATE(state) {
        return state + 1;
      }
    }
  };
  /**
   * Create dva-core instance.
   *
   * @param hooksAndOpts
   * @param createOpts
   */

  function create() {
    var hooksAndOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var createOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var initialReducer = createOpts.initialReducer,
        _createOpts$setupApp = createOpts.setupApp,
        setupApp = _createOpts$setupApp === void 0 ? noop$1$1 : _createOpts$setupApp;
    var plugin = new Plugin();
    plugin.use(filterHooks(hooksAndOpts));
    var app = {
      _models: [prefixNamespace(_objectSpread({}, dvaModel))],
      _store: null,
      _plugin: plugin,
      use: plugin.use.bind(plugin),
      model: model,
      start: start
    };
    return app;
    /**
     * Register model before app is started.
     *
     * @param m {Object} model to register
     */

    function model(m) {
      if (process.env.NODE_ENV !== 'production') {
        checkModel(m, app._models);
      }

      var prefixedModel = prefixNamespace(_objectSpread({}, m));

      app._models.push(prefixedModel);

      return prefixedModel;
    }
    /**
     * Inject model after app is started.
     *
     * @param createReducer
     * @param onError
     * @param unlisteners
     * @param m
     */


    function injectModel(createReducer, onError, unlisteners, m) {
      m = model(m);
      var store = app._store;
      store.asyncReducers[m.namespace] = getReducer(m.reducers, m.state, plugin._handleActions);
      store.replaceReducer(createReducer());

      if (m.effects) {
        store.runSaga(app._getSaga(m.effects, m, onError, plugin.get('onEffect'), hooksAndOpts));
      }

      if (m.subscriptions) {
        unlisteners[m.namespace] = run(m.subscriptions, m, app, onError);
      }
    }
    /**
     * Unregister model.
     *
     * @param createReducer
     * @param reducers
     * @param unlisteners
     * @param namespace
     *
     * Unexpected key warn problem:
     * https://github.com/reactjs/redux/issues/1636
     */


    function unmodel(createReducer, reducers, unlisteners, namespace) {
      var store = app._store; // Delete reducers

      delete store.asyncReducers[namespace];
      delete reducers[namespace];
      store.replaceReducer(createReducer());
      store.dispatch({
        type: '@@dva/UPDATE'
      }); // Cancel effects

      store.dispatch({
        type: "".concat(namespace, "/@@CANCEL_EFFECTS")
      }); // Unlisten subscrioptions

      unlisten(unlisteners, namespace); // Delete model from app._models

      app._models = app._models.filter(function (model) {
        return model.namespace !== namespace;
      });
    }
    /**
     * Replace a model if it exsits, if not, add it to app
     * Attention:
     * - Only available after dva.start gets called
     * - Will not check origin m is strict equal to the new one
     * Useful for HMR
     * @param createReducer
     * @param reducers
     * @param unlisteners
     * @param onError
     * @param m
     */


    function replaceModel(createReducer, reducers, unlisteners, onError, m) {
      var store = app._store;
      var namespace = m.namespace;
      var oldModelIdx = findIndex$1(app._models, function (model) {
        return model.namespace === namespace;
      });

      if (~oldModelIdx) {
        // Cancel effects
        store.dispatch({
          type: "".concat(namespace, "/@@CANCEL_EFFECTS")
        }); // Delete reducers

        delete store.asyncReducers[namespace];
        delete reducers[namespace]; // Unlisten subscrioptions

        unlisten(unlisteners, namespace); // Delete model from app._models

        app._models.splice(oldModelIdx, 1);
      } // add new version model to store


      app.model(m);
      store.dispatch({
        type: '@@dva/UPDATE'
      });
    }
    /**
     * Start the app.
     *
     * @returns void
     */


    function start() {
      // Global error handler
      var onError = function onError(err, extension) {
        if (err) {
          if (typeof err === 'string') err = new Error(err);

          err.preventDefault = function () {
            err._dontReject = true;
          };

          plugin.apply('onError', function (err) {
            throw new Error(err.stack || err);
          })(err, app._store.dispatch, extension);
        }
      };

      var sagaMiddleware = sagaMiddlewareFactory();
      var promiseMiddleware = createPromiseMiddleware(app);
      app._getSaga = getSaga.bind(null);
      var sagas = [];

      var reducers = _objectSpread({}, initialReducer);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = app._models[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var m = _step.value;
          reducers[m.namespace] = getReducer(m.reducers, m.state, plugin._handleActions);

          if (m.effects) {
            sagas.push(app._getSaga(m.effects, m, onError, plugin.get('onEffect'), hooksAndOpts));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var reducerEnhancer = plugin.get('onReducer');
      var extraReducers = plugin.get('extraReducers');
      invariant__default['default'](Object.keys(extraReducers).every(function (key) {
        return !(key in reducers);
      }), "[app.start] extraReducers is conflict with other reducers, reducers list: ".concat(Object.keys(reducers).join(', '))); // Create store

      app._store = createStore$1({
        reducers: createReducer(),
        initialState: hooksAndOpts.initialState || {},
        plugin: plugin,
        createOpts: createOpts,
        sagaMiddleware: sagaMiddleware,
        promiseMiddleware: promiseMiddleware
      });
      var store = app._store; // Extend store

      store.runSaga = sagaMiddleware.run;
      store.asyncReducers = {}; // Execute listeners when state is changed

      var listeners = plugin.get('onStateChange');
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function _loop() {
          var listener = _step2.value;
          store.subscribe(function () {
            listener(store.getState());
          });
        };

        for (var _iterator2 = listeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop();
        } // Run sagas

      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      sagas.forEach(sagaMiddleware.run); // Setup app

      setupApp(app); // Run subscriptions

      var unlisteners = {};
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this._models[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _model = _step3.value;

          if (_model.subscriptions) {
            unlisteners[_model.namespace] = run(_model.subscriptions, _model, app, onError);
          }
        } // Setup app.model and app.unmodel

      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      app.model = injectModel.bind(app, createReducer, onError, unlisteners);
      app.unmodel = unmodel.bind(app, createReducer, reducers, unlisteners);
      app.replaceModel = replaceModel.bind(app, createReducer, reducers, unlisteners, onError);
      /**
       * Create global reducer for redux.
       *
       * @returns {Object}
       */

      function createReducer() {
        return reducerEnhancer(combineReducers(_objectSpread({}, reducers, extraReducers, app._store ? app._store.asyncReducers : {})));
      }
    }
  }

  function initStore(models, options) {
    var app = create({
      extraEnhancers: [persistEnhancer(_objectSpread2({}, options))]
    });
    models.forEach(function (model) {
      return app.model(model);
    });
    app.start();
    return app._store;
  }

  exports.initStore = initStore;
  exports.persistEnhancer = persistEnhancer;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
