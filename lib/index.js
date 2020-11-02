(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.dva = {}, global._));
}(this, (function (exports, _) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var ___default = /*#__PURE__*/_interopDefaultLegacy(_);

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

  var engine = require("store/src/store-engine");

  var storages = [require("store/storages/sessionStorage")];
  var plugins = [require("store/plugins/defaults")];
  var storage = engine.createStore(storages, plugins);

  var config = {
    key: "model",
    storage: storage,
    blacklist: ["@@dva"],
    whitelist: [],
    keyPrefix: "persist"
  };

  var lastState = {};
  function enhancer () {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    console.log(opts);

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
  }

  exports.persistEnhancer = enhancer;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
