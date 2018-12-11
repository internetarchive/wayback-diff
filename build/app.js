var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance$1 = global$1.performance || {};
var performanceNow =
  performance$1.now        ||
  performance$1.mozNow     ||
  performance$1.msNow      ||
  performance$1.oNow       ||
  performance$1.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance$1)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

function aa(a,b,e,c,d,g,h,f){if(!a){a=void 0;if(void 0===b)a=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[e,c,d,g,h,f],m=0;a=Error(b.replace(/%s/g,function(){return l[m++]}));a.name="Invariant Violation";}a.framesToPop=1;throw a;}}
function D(a){for(var b=arguments.length-1,e="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=0;c<b;c++)e+="&args[]="+encodeURIComponent(arguments[c+1]);aa(!1,"Minified React error #"+a+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",e);}var E={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},F={};
function G(a,b,e){this.props=a;this.context=b;this.refs=F;this.updater=e||E;}G.prototype.isReactComponent={};G.prototype.setState=function(a,b){"object"!==typeof a&&"function"!==typeof a&&null!=a?D("85"):void 0;this.updater.enqueueSetState(this,a,b,"setState");};G.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function H(){}H.prototype=G.prototype;function I(a,b,e){this.props=a;this.context=b;this.refs=F;this.updater=e||E;}var J=I.prototype=new H;
J.constructor=I;objectAssign(J,G.prototype);J.isPureReactComponent=!0;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning = function() {};

{
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );

        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

var checkPropTypes_1 = checkPropTypes;

var react_development = createCommonjsModule(function (module) {



{
  (function() {

var _assign = objectAssign;
var checkPropTypes = checkPropTypes_1;

// TODO: this is special because it gets imported during build.

var ReactVersion = '16.6.3';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;

var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;

var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';

function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }
  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function () {};

{
  validateFormat = function (format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error = void 0;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

// Relying on the `invariant()` implementation lets us
// preserve the format and params in the www builds.

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var lowPriorityWarning$1 = lowPriorityWarning;

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warningWithoutStack = function () {};

{
  warningWithoutStack = function (condition, format) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (format === undefined) {
      throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (args.length > 8) {
      // Check before the condition to catch violations early.
      throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
    }
    if (condition) {
      return;
    }
    if (typeof console !== 'undefined') {
      var argsWithFormat = args.map(function (item) {
        return '' + item;
      });
      argsWithFormat.unshift('Warning: ' + format);

      // We intentionally don't use spread (or .apply) directly because it
      // breaks IE9: https://github.com/facebook/react/issues/13610
      Function.prototype.apply.call(console.error, console, argsWithFormat);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      throw new Error(message);
    } catch (x) {}
  };
}

var warningWithoutStack$1 = warningWithoutStack;

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    var warningKey = componentName + '.' + callerName;
    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }
    warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var emptyObject = {};
{
  Object.freeze(emptyObject);
}

/**
 * Base class helpers for the updating state of a component.
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
        return undefined;
      }
    });
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
_assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
function createRef() {
  var refObject = {
    current: null
  };
  {
    Object.seal(refObject);
  }
  return refObject;
}

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null,
  currentDispatcher: null
};

var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

var describeComponentFrame = function (name, source, ownerName) {
  var sourceInfo = '';
  if (source) {
    var path = source.fileName;
    var fileName = path.replace(BEFORE_SLASH_RE, '');
    {
      // In DEV, include code for a common special case:
      // prefer "folder/index.js" instead of just "index.js".
      if (/^index\./.test(fileName)) {
        var match = path.match(BEFORE_SLASH_RE);
        if (match) {
          var pathBeforeSlash = match[1];
          if (pathBeforeSlash) {
            var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
            fileName = folderName + '/' + fileName;
          }
        }
      }
    }
    sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
  } else if (ownerName) {
    sourceInfo = ' (created by ' + ownerName + ')';
  }
  return '\n    in ' + (name || 'Unknown') + sourceInfo;
};

var Resolved = 1;


function refineResolvedLazyComponent(lazyComponent) {
  return lazyComponent._status === Resolved ? lazyComponent._result : null;
}

function getWrappedName(outerType, innerType, wrapperName) {
  var functionName = innerType.displayName || innerType.name || '';
  return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
}

function getComponentName(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }
  {
    if (typeof type.tag === 'number') {
      warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }
  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }
  if (typeof type === 'string') {
    return type;
  }
  switch (type) {
    case REACT_CONCURRENT_MODE_TYPE:
      return 'ConcurrentMode';
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';
    case REACT_PORTAL_TYPE:
      return 'Portal';
    case REACT_PROFILER_TYPE:
      return 'Profiler';
    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';
    case REACT_SUSPENSE_TYPE:
      return 'Suspense';
  }
  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        return 'Context.Consumer';
      case REACT_PROVIDER_TYPE:
        return 'Context.Provider';
      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');
      case REACT_MEMO_TYPE:
        return getComponentName(type.type);
      case REACT_LAZY_TYPE:
        {
          var thenable = type;
          var resolvedThenable = refineResolvedLazyComponent(thenable);
          if (resolvedThenable) {
            return getComponentName(resolvedThenable);
          }
        }
    }
  }
  return null;
}

var ReactDebugCurrentFrame = {};

var currentlyValidatingElement = null;

function setCurrentlyValidatingElement(element) {
  {
    currentlyValidatingElement = element;
  }
}

{
  // Stack implementation injected by the current renderer.
  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var stack = '';

    // Add an extra top frame while an element is being validated
    if (currentlyValidatingElement) {
      var name = getComponentName(currentlyValidatingElement.type);
      var owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
    }

    // Delegate to the injected renderer-specific implementation
    var impl = ReactDebugCurrentFrame.getCurrentStack;
    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

var ReactSharedInternals = {
  ReactCurrentOwner: ReactCurrentOwner,
  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
  assign: _assign
};

{
  _assign(ReactSharedInternals, {
    // These should not be included in production.
    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
    // TODO: remove in React 17.0.
    ReactComponentTreeHook: {}
  });
}

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = warningWithoutStack$1;

{
  warning = function (condition, format) {
    if (condition) {
      return;
    }
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();
    // eslint-disable-next-line react-internal/warning-and-invariant-args

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
  };
}

var warning$1 = warning;

var hasOwnProperty = Object.prototype.hasOwnProperty;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown = void 0;
var specialPropRefWarningShown = void 0;

function hasValidRef(config$$1) {
  {
    if (hasOwnProperty.call(config$$1, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config$$1, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config$$1.ref !== undefined;
}

function hasValidKey(config$$1) {
  {
    if (hasOwnProperty.call(config$$1, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config$$1, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config$$1.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
function createElement(type, config$$1, children) {
  var propName = void 0;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config$$1 != null) {
    if (hasValidRef(config$$1)) {
      ref = config$$1.ref;
    }
    if (hasValidKey(config$$1)) {
      key = '' + config$$1.key;
    }

    self = config$$1.__self === undefined ? null : config$$1.__self;
    source = config$$1.__source === undefined ? null : config$$1.__source;
    // Remaining properties are added to a new props object
    for (propName in config$$1) {
      if (hasOwnProperty.call(config$$1, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config$$1[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}

/**
 * Return a function that produces ReactElements of a given type.
 * See https://reactjs.org/docs/react-api.html#createfactory
 */


function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
}

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */
function cloneElement(element, config$$1, children) {
  !!(element === null || element === undefined) ? invariant(false, 'React.cloneElement(...): The argument must be a React element, but you passed %s.', element) : void 0;

  var propName = void 0;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config$$1 != null) {
    if (hasValidRef(config$$1)) {
      // Silently steal the ref from the parent.
      ref = config$$1.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config$$1)) {
      key = '' + config$$1.key;
    }

    // Remaining properties override existing props
    var defaultProps = void 0;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config$$1) {
      if (hasOwnProperty.call(config$$1, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config$$1[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config$$1[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}

/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */
function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

var POOL_SIZE = 10;
var traverseContextPool = [];
function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0
    };
  }
}

function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }

  if (invokeCallback) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child = void 0;
  var nextName = void 0;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === 'function') {
      {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step = void 0;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = '';
      {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
      }
      var childrenString = '' + children;
      invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
      return c;
    });
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children) {
  return traverseAllChildren(children, function () {
    return null;
  }, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
    return child;
  });
  return result;
}

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
  return children;
}

function createContext(defaultValue, calculateChangedBits) {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  } else {
    {
      !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
    }
  }

  var context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };

  var hasWarnedAboutUsingNestedContextConsumers = false;
  var hasWarnedAboutUsingConsumerProvider = false;

  {
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer = {
      $$typeof: REACT_CONTEXT_TYPE,
      _context: context,
      _calculateChangedBits: context._calculateChangedBits
    };
    // $FlowFixMe: Flow complains about not setting a value, which is intentional here
    Object.defineProperties(Consumer, {
      Provider: {
        get: function () {
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;
            warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }
          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;
            warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }
          return context.Consumer;
        }
      }
    });
    // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
    context.Consumer = Consumer;
  }

  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

function lazy(ctor) {
  return {
    $$typeof: REACT_LAZY_TYPE,
    _ctor: ctor,
    // React uses these fields to store the result.
    _status: -1,
    _result: null
  };
}

function forwardRef(render) {
  {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
    } else if (typeof render !== 'function') {
      warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    } else {
      !(
      // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
      render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
    }

    if (render != null) {
      !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
    }
  }

  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };
}

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' ||
  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
}

function memo(type, compare) {
  {
    if (!isValidElementType(type)) {
      warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
  }
  return {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
  };
}

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

var propTypesMisspellWarningShown = void 0;

{
  propTypesMisspellWarningShown = false;
}

function getDeclarationErrorAddendum() {
  return '';
}

function getSourceInfoErrorAddendum(elementProps) {
  if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
    var source = elementProps.__source;
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = '\n\nCheck the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + getComponentName(element._owner.type) + '.';
  }

  setCurrentlyValidatingElement(element);
  {
    warning$1(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
  }
  setCurrentlyValidatingElement(null);
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step = void 0;
        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var type = element.type;
  var name = void 0,
      propTypes = void 0;
  if (typeof type === 'function') {
    // Class or function component
    name = type.displayName || type.name;
    propTypes = type.propTypes;
  } else if (typeof type === 'object' && type !== null && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    // ForwardRef
    var functionName = type.render.displayName || type.render.name || '';
    name = type.displayName || (functionName !== '' ? 'ForwardRef(' + functionName + ')' : 'ForwardRef');
    propTypes = type.propTypes;
  } else {
    return;
  }
  if (propTypes) {
    setCurrentlyValidatingElement(element);
    checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
    setCurrentlyValidatingElement(null);
  } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
    propTypesMisspellWarningShown = true;
    warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
  }
  if (typeof type.getDefaultProps === 'function') {
    !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */
function validateFragmentProps(fragment) {
  setCurrentlyValidatingElement(fragment);

  var keys = Object.keys(fragment.props);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key !== 'children' && key !== 'key') {
      warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
      break;
    }
  }

  if (fragment.ref !== null) {
    warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
  }

  setCurrentlyValidatingElement(null);
}

function createElementWithValidation(type, props, children) {
  var validType = isValidElementType(type);

  // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.
  if (!validType) {
    var info = '';
    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendum(props);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString = void 0;
    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
  }

  var element = createElement.apply(this, arguments);

  // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.
  if (element == null) {
    return element;
  }

  // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)
  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}

function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;
  // Legacy hook: remove it
  {
    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}

function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);
  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }
  validatePropTypes(newElement);
  return newElement;
}

var React = {
  Children: {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray: toArray,
    only: onlyChild
  },

  createRef: createRef,
  Component: Component,
  PureComponent: PureComponent,

  createContext: createContext,
  forwardRef: forwardRef,
  lazy: lazy,
  memo: memo,

  Fragment: REACT_FRAGMENT_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  Suspense: REACT_SUSPENSE_TYPE,

  createElement: createElementWithValidation,
  cloneElement: cloneElementWithValidation,
  createFactory: createFactoryWithValidation,
  isValidElement: isValidElement,

  version: ReactVersion,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
};

{
  React.unstable_ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
  React.unstable_Profiler = REACT_PROFILER_TYPE;
}



var React$2 = Object.freeze({
	default: React
});

var React$3 = ( React$2 && React ) || React$2;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
var react = React$3.default || React$3;

module.exports = react;
  })();
}
});

var react = createCommonjsModule(function (module) {

{
  module.exports = react_development;
}
});
var react_1 = react.PureComponent;
var react_2 = react.Component;

var printWarning$1 = function() {};

{
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      printWarning$1('Invalid argument supplied to oneOf, expected an instance of array.');
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.');
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
}
});

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".side-by-side-render,\n.inline-render {\n    display: flex;\n    flex: 1 0 auto;\n}\n\n.side-by-side-render > iframe,\n.side-by-side-render > div,\n.inline-render > iframe {\n    border: 1px solid #ccc;\n    border-radius: 2px;\n    width: 100%;\n}\n\n.side-by-side-render > iframe:first-of-type {\n    margin-right: 0.5em;\n}\n\n.diff-view__alert.alert.alert-warning{\n    text-align: center;\n}\n\n.loading {\n    align-items: center;\n    background: transparent;\n    display: flex;\n    justify-content: center;\n}";
styleInject(css);

/**
 * Tools for dealing with media types.
 */

/**
 * @typedef MediaType Represents a media type.
 * @property {string} mediaType The full media type string, e.g. 'text/plain'
 * @property {string} type The primary type, e.g. 'text' in 'text/plain'
 * @property {string} subType The sub type, e.g. 'plain' in 'text/plain'
 * @property {string} genericType The generic type, e.g. 'text/*'
 * @property {(MediaType) => boolean} equals Compare this MediaType with another
 */

/**
 * The "unknown" media type.
 * @type {MediaType}
 */
var unknownType = {
  genericType: '*/*',
  mediaType: '*/*',
  type: '*',
  subType: '*',
  equals: function equals(otherType) {
    return !!otherType && this.mediaType === otherType.mediaType;
  }
};

/**
 * The canonical HTML media type.
 * @type {MediaType}
 */
var htmlType = MediaType('text', 'html');

/**
 * Create an object representing a media type.
 * @param {string} [type]
 * @param {string} [subtype]
 * @returns {MediaType}
 */
function MediaType(type, subtype) {
  type = type || '*';
  subtype = subtype || '*';

  return Object.assign(Object.create(unknownType), {
    genericType: type + '/*',
    mediaType: type + '/' + (subtype || '*'),
    type: type,
    subtype: subtype
  });
}

// TODO: remove this when we have content types for everything in the DB
var mediaTypeForExtension = {
  '.html': htmlType,
  '.pdf': MediaType('application', 'pdf'),
  '.wsdl': MediaType('application', 'wsdl+xml'),
  '.xml': MediaType('application', 'xml'),
  '.ksh': MediaType('text', '*'),
  '.ics': MediaType('text', 'calendar'),
  '.txt': MediaType('text', 'plain'),
  '.rss': MediaType('application', 'rss+xml'),
  '.jpg': MediaType('image', 'jpeg'),
  '.obj': MediaType('application', 'x-tgif'),
  '.doc': MediaType('application', 'msword'),
  '.zip': MediaType('application', 'zip'),
  '.atom': MediaType('application', 'atom+xml'),
  '.xlb': MediaType('application', 'excel'),
  '.pwz': MediaType('application', 'powerpoint'),
  '.gif': MediaType('image', 'gif'),
  '.rtf': MediaType('application', 'rtf'),
  '.csv': MediaType('text', 'csv'),
  '.xls': MediaType('application', 'vnd.ms-excel'),
  '.xlsx': MediaType('application', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
  '.png': MediaType('image', 'png'),
  '.docx': MediaType('application', 'vnd.openxmlformats-officedocument.wordprocessingml.document'),
  '.jpeg': MediaType('image', 'jpeg'),
  '.mp3': MediaType('audio', 'mpeg'),
  '.ai': MediaType('application', 'postscript')
};

var diffTypes = {
  RAW_FROM_CONTENT: {
    description: '“From” Version'
  },
  RAW_TO_CONTENT: {
    description: '“To” Version'
  },
  RAW_SIDE_BY_SIDE: {
    description: 'Side-by-side Content'
  },
  HIGHLIGHTED_TEXT: {
    description: 'Highlighted Text',
    diffService: 'html_text_dmp'
  },
  HIGHLIGHTED_SOURCE: {
    description: 'Highlighted Source',
    diffService: 'html_source_dmp'
  },
  HIGHLIGHTED_RENDERED: {
    description: 'Highlighted Rendered',
    diffService: 'html_token'
  },
  SIDE_BY_SIDE_RENDERED: {
    description: 'Side-by-Side Rendered',
    diffService: 'html_token',
    options: { include: 'all' }
  },
  OUTGOING_LINKS: {
    description: 'Outgoing Links',
    diffService: 'links'
  },
  CHANGES_ONLY_TEXT: {
    description: 'Changes Only Text',
    diffService: 'html_text_dmp'
  },
  CHANGES_ONLY_SOURCE: {
    description: 'Changes Only Source',
    diffService: 'html_source_dmp'
  }
};

for (var key in diffTypes) {
  diffTypes[key].value = key;
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
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
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 * Display a single deleted/added/unchanged element within a diff
 *
 * @class DiffItem
 * @extends {React.Component}
 */

var DiffItem = function (_React$Component) {
  inherits(DiffItem, _React$Component);

  function DiffItem() {
    classCallCheck(this, DiffItem);
    return possibleConstructorReturn(this, (DiffItem.__proto__ || Object.getPrototypeOf(DiffItem)).apply(this, arguments));
  }

  createClass(DiffItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          data = _props.data,
          onSelect = _props.onSelect;

      // here we do inline style-editing and class switching.
      // in the real world it's probably a good idea to associate
      // styles with the class and remove the "styles" object entirely.

      var styles = {};
      var diffTypeClass = 'unchanged';

      var _data = slicedToArray(data, 2),
          itemType = _data[0],
          itemText = _data[1];

      // this data comes from https://github.com/edgi-govdata-archiving/go-calc-diff
      // it may be necessary to adjust the "data.Type" inspections based on differ


      if (itemType === -1) {
        diffTypeClass = 'removed';
        styles.background = '#ffc0cb';
      } else if (itemType === 1) {
        diffTypeClass = 'added';
        styles.background = '#90ee90';
      }

      return react.createElement(
        'span',
        {
          className: 'diff item ' + diffTypeClass,
          style: styles,
          onClick: onSelect
        },
        itemText
      );
    }
  }]);
  return DiffItem;
}(react.Component);

// Basic list component taken from http://github.com/datatogether/context
// List accepts an array of data, and an item component. It iterates through the
// data array, creating an item component for each item in the array, passing
// it a prop "data" with the array element.

var List = function (_React$Component) {
  inherits(List, _React$Component);

  function List() {
    classCallCheck(this, List);
    return possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).apply(this, arguments));
  }

  createClass(List, [{
    key: 'render',

    // const List = (props) => {
    value: function render() {
      var _this2 = this;

      // This strange props destructuring is so props.component
      // can be referenced as a jsx component below
      var _props = this.props,
          data = _props.data,
          onSelectItem = _props.onSelectItem,
          className = _props.className;

      var selectFunc = function selectFunc(fn, d, i) {
        return function () {
          if (fn) {
            fn(i, d);
          }
        };
      };

      var children = data.map(function (item, i) {
        return react.createElement(_this2.props.component, {
          data: item,
          key: i,
          index: i,
          onSelect: selectFunc(onSelectItem, item, i)
        });
      });

      return react.createElement(
        'div',
        { className: className },
        children
      );
    }
  }]);
  return List;
}(react.Component);

/**
 * Display a plaintext diff with additions and removals inline.
 *
 * @class HighlightedTextDiff
 * @extends {React.Component}
 * @param {Object} props
 * @param {DiffData} props.diffData
 * @param {string} props.className
 */

var HighlightedTextDiff = function (_React$Component) {
  inherits(HighlightedTextDiff, _React$Component);

  function HighlightedTextDiff() {
    classCallCheck(this, HighlightedTextDiff);
    return possibleConstructorReturn(this, (HighlightedTextDiff.__proto__ || Object.getPrototypeOf(HighlightedTextDiff)).apply(this, arguments));
  }

  createClass(HighlightedTextDiff, [{
    key: 'render',
    value: function render() {
      return react.createElement(List, {
        data: this.props.diffData.diff,
        component: DiffItem,
        className: this.props.className
      });
    }
  }]);
  return HighlightedTextDiff;
}(react.Component);

/**
 * @typedef {Object} SandboxedHtmlProps
 * @property {string} html The HTML source or document to render
 * @property {string} [baseUrl] A base URL to set for the view
 * @property {(HTMLDocument) => HTMLDocument} [transform] An optional transform
 *           function to apply to the document before rendering.
 */

/**
 * Display HTML source code or document in a sandboxed frame.
 *
 * @class SandboxedHtml
 * @extends {React.Component}
 * @params {SandboxedHtmlProps} props
 */

var SandboxedHtml = function (_React$PureComponent) {
  inherits(SandboxedHtml, _React$PureComponent);

  function SandboxedHtml(props) {
    classCallCheck(this, SandboxedHtml);

    var _this = possibleConstructorReturn(this, (SandboxedHtml.__proto__ || Object.getPrototypeOf(SandboxedHtml)).call(this, props));

    _this._frame = null;
    return _this;
  }

  createClass(SandboxedHtml, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      this.addLoaderImg();
      return true;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._updateContent();
      this.addLoaderImg();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._updateContent();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return react.createElement('iframe', { height: window.innerHeight, onLoad: function onLoad() {
          _this2.handleHeight();
          _this2.removeLoaderImg();
        },
        sandbox: 'allow-same-origin allow-forms allow-scripts',
        ref: function ref(frame) {
          return _this2._frame = frame;
        }
      });
    }
  }, {
    key: '_updateContent',
    value: function _updateContent() {
      var _this3 = this;

      var source = transformSource(this.props.html, function (document) {
        if (_this3.props.transform) {
          document = _this3.props.transform(document) || document;
        }
        return setDocumentBase(document, _this3.props.baseUrl);
      });

      this._frame.setAttribute('srcdoc', source);
    }
  }, {
    key: 'handleHeight',
    value: function handleHeight() {
      var offsetHeight = this._frame.contentDocument.documentElement.scrollHeight;
      var offsetWidth = this._frame.contentDocument.documentElement.scrollWidth;
      if (offsetHeight > 0.1 * this._frame.height) {
        this._frame.height = offsetHeight + offsetHeight * 0.01;
      } else {
        this._frame.height = 0.5 * this._frame.height;
      }
      if (offsetWidth > this._frame.clientWidth) {
        this._frame.width = offsetWidth;
      }
    }
  }, {
    key: 'removeLoaderImg',
    value: function removeLoaderImg() {
      this._frame.loaderImage.parentNode.removeChild(this._frame.loaderImage);
    }
  }, {
    key: 'addLoaderImg',
    value: function addLoaderImg() {
      var width = this._frame.contentDocument.scrollingElement.offsetWidth;

      var centerX = this._frame.offsetLeft + width / 2;

      var elem = document.createElement('img');
      elem.className = 'waybackDiffIframeLoader';
      var cssText = 'position:absolute;left:' + centerX + 'px;top:50%;';
      elem.setAttribute('style', cssText);
      elem.src = this.props.iframeLoader;
      document.body.appendChild(elem);
      this._frame.loaderImage = elem;
    }
  }]);
  return SandboxedHtml;
}(react.PureComponent);
function transformSource(source, transformer) {
  var parser = new DOMParser();
  var newDocument = parser.parseFromString(source, 'text/html');
  newDocument = transformer(newDocument);
  return '<!doctype html>\n' + newDocument.documentElement.outerHTML;
}

/**
 * Set the `base` URL for a document, which alters where links, images, etc.
 * point to if they do not include a domain name.
 * @private
 *
 * @param {HTMLDocument} document
 * @param {string} baseUrl
 * @returns {HTMLDocument}
 */
function setDocumentBase(document, baseUrl) {
  if (baseUrl) {
    var base = document.querySelector('base') || document.createElement('base');
    base.href = baseUrl;

    // <meta charset> tags don't work unless they are first, so if one is
    // present, modify <head> content *after* it.
    var charsetElement = document.querySelector('meta[charset]');
    var beforeElement = document.head.firstChild;
    if (charsetElement) {
      beforeElement = charsetElement.nextSibling;
    }
    if (beforeElement) {
      beforeElement.parentNode.insertBefore(base, beforeElement);
    } else {
      document.head.appendChild(base);
    }
  }

  return document;
}

/**
 * @typedef {Object} InlineRenderedDiffProps
 * @property {DiffData} diffData Object containing diff to render and its metadata
 * @property {Page} page The page this diff pertains to
 */

/**
 * Display two versions of a page with their changes inline together.
 *
 * @class InlineRenderedDiff
 * @extends {React.Component}
 * @param {InlineRenderedDiffProps} props
 */

var InlineRenderedDiff = function (_React$Component) {
  inherits(InlineRenderedDiff, _React$Component);

  function InlineRenderedDiff() {
    classCallCheck(this, InlineRenderedDiff);
    return possibleConstructorReturn(this, (InlineRenderedDiff.__proto__ || Object.getPrototypeOf(InlineRenderedDiff)).apply(this, arguments));
  }

  createClass(InlineRenderedDiff, [{
    key: 'render',
    value: function render() {
      var diff = this.props.diffData.combined || this.props.diffData.diff;

      return react.createElement(
        'div',
        { className: 'inline-render' },
        react.createElement(SandboxedHtml, { html: diff, baseUrl: this.props.page.url })
      );
    }
  }]);
  return InlineRenderedDiff;
}(react.Component);

var showRemovals = showType.bind(null, 'removals');
var showAdditions = showType.bind(null, 'additions');

/**
 * @typedef {Object} SideBySideRenderedDiffProps
 * @property {DiffData} diffData Object containing diff to render and its metadata
 * @property {Page} page The page this diff pertains to
 */

/**
 * Display two versions of a page, side-by-side.
 *
 * @class SideBySideRenderedDiff
 * @extends {React.Component}
 * @param {SideBySideRenderedDiffProps} props
 */

var SideBySideRenderedDiff = function (_React$Component) {
  inherits(SideBySideRenderedDiff, _React$Component);

  function SideBySideRenderedDiff() {
    classCallCheck(this, SideBySideRenderedDiff);
    return possibleConstructorReturn(this, (SideBySideRenderedDiff.__proto__ || Object.getPrototypeOf(SideBySideRenderedDiff)).apply(this, arguments));
  }

  createClass(SideBySideRenderedDiff, [{
    key: 'render',
    value: function render() {
      // The newest version of this diff includes separate, more accurate
      // versions to show for each side, but the old one needs transformations.
      // TODO: remove this transforms business when new diffs are fully deployed.
      var transformDeletions = function transformDeletions(x) {
        return x;
      };
      var transformInsertions = transformDeletions;
      if (!this.props.diffData.deletions) {
        transformDeletions = showRemovals;
        transformInsertions = showAdditions;
      }

      return react.createElement(
        'div',
        { className: 'side-by-side-render' },
        react.createElement(SandboxedHtml, {
          iframeLoader: this.props.iframeLoader,
          html: this.props.diffData.deletions || this.props.diffData.diff,
          baseUrl: this.props.page.url,
          transform: transformDeletions
        }),
        react.createElement(SandboxedHtml, {
          iframeLoader: this.props.iframeLoader,
          html: this.props.diffData.insertions || this.props.diffData.diff,
          baseUrl: this.props.page.url,
          transform: transformInsertions
        })
      );
    }
  }]);
  return SideBySideRenderedDiff;
}(react.Component);


function showType(viewType, sourceDocument) {
  // Show correct version of document `<head>`
  if (viewType !== 'additions') {
    var oldHead = sourceDocument.getElementById('wm-diff-old-head').content;
    var styling = sourceDocument.getElementById('wm-diff-style');
    var titleDiff = sourceDocument.querySelector('meta[name="wm-diff-title"]');
    sourceDocument.head.innerHTML = '';
    sourceDocument.head.appendChild(oldHead);
    sourceDocument.head.appendChild(styling);
    sourceDocument.head.appendChild(titleDiff);
  }

  var elementToRemove = viewType === 'additions' ? 'del' : 'ins';
  removeChangeElements(elementToRemove, sourceDocument);
  activateInertChangeElements(viewType, sourceDocument);

  return sourceDocument;
}

/**
 * Remove HTML elements representing additions or removals from a document.
 * If removing an element leaves its parent element empty, the parent element
 * is also removed, and so on recursively up the tree. This is meant to
 * compensate for the fact that our diff is really a text diff that is
 * sensitive to the tree and not an actual tree diff.
 *
 * @param {string} type  Element type to remove, i.e. `ins` or `del`.
 * @param {HTMLDocument} sourceDocument  Document to remove elements from.
 */
function removeChangeElements(type, sourceDocument) {
  function removeEmptyParents(elements) {
    if (elements.size === 0) return;

    var parents = new Set();
    elements.forEach(function (element) {
      if (element.parentNode && element.childElementCount === 0 && /^[\s\n\r]*$/.test(element.textContent)) {
        parents.add(element.parentNode);
        element.parentNode.removeChild(element);
      }
    });

    return removeEmptyParents(parents);
  }

  var parents = new Set();
  sourceDocument.querySelectorAll(type).forEach(function (element) {
    parents.add(element.parentNode);
    element.parentNode.removeChild(element);
  });
  removeEmptyParents(parents);
}

/**
 * Activate inert (embedded in `<template>`) elements (e.g. scripts and styles)
 * that were removed as part of the represented change and remove elements that
 * were added. If the `viewType` is `additions`, this does nothing, since added
 * elements are already active.
 *
 * @param {'additions'|'deletions'} viewType Type of view to restrict to
 * @param {HTMLDocument} sourceDocument Document to activate or deactivate
 *                                      elements within
 */
function activateInertChangeElements(viewType, sourceDocument) {
  if (viewType === 'additions') {
    return;
  }

  sourceDocument.querySelectorAll('.wm-diff-inserted-active').forEach(function (item) {
    return item.remove();
  });

  sourceDocument.querySelectorAll('.wm-diff-deleted-inert').forEach(function (item) {
    var content = item.content;
    item.parentNode.insertBefore(content, item);
    item.remove();
  });
}

// The context for a change should be constrained to this many lines
var maxContextLines = 3;
// If the context is only a single line, it should be constrained to this length
var maxContextLineLength = 300;

/**
 * Display a plaintext diff with additions and removals inline.
 *
 * @class ChangesOnlyDiff
 * @extends {React.Component}
 * @param {Object} props
 * @param {DiffData} props.diffData
 * @param {string} props.className
 */

var ChangesOnlyDiff = function (_React$Component) {
  inherits(ChangesOnlyDiff, _React$Component);

  function ChangesOnlyDiff() {
    classCallCheck(this, ChangesOnlyDiff);
    return possibleConstructorReturn(this, (ChangesOnlyDiff.__proto__ || Object.getPrototypeOf(ChangesOnlyDiff)).apply(this, arguments));
  }

  createClass(ChangesOnlyDiff, [{
    key: 'render',
    value: function render() {
      var changesOnly = this.props.diffData.diff.reduce(getContextualDiff, []);

      return react.createElement(List, {
        data: changesOnly,
        component: DiffItem,
        className: this.props.className
      });
    }
  }]);
  return ChangesOnlyDiff;
}(react.Component);
function getContextualDiff(newDiff, currentValue, index, diff) {
  var _currentValue = slicedToArray(currentValue, 2),
      itemType = _currentValue[0],
      itemText = _currentValue[1];

  if (itemType !== 0) return newDiff.concat([currentValue]);

  // Determine whether there is content that actually needs trimming
  var lines = itemText.split('\n');
  var singleLine = lines.length === 1;
  if (!singleLine && lines.length <= maxContextLines) {
    return newDiff.concat([currentValue]);
  }

  var hasPreviousChange = diff[index - 1] && diff[index - 1][0] !== 0;
  var hasNextChange = diff[index + 1] && diff[index + 1][0] !== 0;

  var contextLength = singleLine ? maxContextLineLength : maxContextLines;
  if (hasPreviousChange && hasNextChange) {
    contextLength *= 2;
  }
  if ((singleLine ? lines[0] : lines).length <= contextLength) {
    return newDiff.concat([currentValue]);
  }

  // ...and actually do the trimming
  var newEntries = [];
  if (hasPreviousChange) {
    var newText = [];

    if (singleLine) {
      newText.push(lines[0].slice(0, maxContextLineLength));
    } else {
      var newLines = lines.slice(0, maxContextLines).map(function (line) {
        if (line.length > maxContextLineLength) {
          return line.slice(0, maxContextLineLength) + '…';
        }
        return line;
      });
      newText.push(newLines.join('\n') + '\n');
    }

    newEntries.push([itemType, newText.join('')]);
  }

  // Just divide with an ellipsis for now, could be fancier in the future
  newEntries.push([itemType, '…']);

  if (hasNextChange) {
    var _newText = [];

    if (singleLine) {
      _newText.push(lines[0].slice(-maxContextLineLength));
    } else {
      var _newLines = lines.slice(0, maxContextLines).map(function (line, index, lines) {
        if (line.length > maxContextLineLength) {
          // If this is the last line preceding a change, trim at the start.
          if (lines[index + 1] == null) {
            return '…' + line.slice(-maxContextLineLength);
          }
          return line.slice(0, maxContextLineLength) + '…';
        }
        return line;
      });
      _newText.push('\n' + _newLines.join('\n'));
    }

    newEntries.push([itemType, _newText.join('')]);
  }

  return newDiff.concat(newEntries);
}

/**
 * @typedef {Object} RawVersionProps
 * @property {Page} page The page this diff pertains to
 * @property {Version} version
 * @property {string} content
 */

/**
 * Display the raw content of a version.
 *
 * @class RawVersion
 * @extends {React.Component}
 * @param {RawVersionProps} props
 */

var RawVersion = function (_React$Component) {
  inherits(RawVersion, _React$Component);

  function RawVersion() {
    classCallCheck(this, RawVersion);
    return possibleConstructorReturn(this, (RawVersion.__proto__ || Object.getPrototypeOf(RawVersion)).apply(this, arguments));
  }

  createClass(RawVersion, [{
    key: 'render',
    value: function render() {
      if (this.props.content && /^[\s\n\r]*</.test(this.props.content)) {
        return react.createElement(
          'div',
          { className: 'inline-render' },
          react.createElement(SandboxedHtml, { html: this.props.content, baseUrl: this.props.page.url })
        );
      }

      return react.createElement(
        'div',
        { className: 'inline-render' },
        react.createElement('iframe', { src: this.props.version })
      );
    }
  }]);
  return RawVersion;
}(react.Component);

/**
 * @typedef {Object} SideBySideRawVersionsProps
 * @property {DiffData} diffData Object containing diff to render and its metadata
 * @property {Page} page The page this diff pertains to
 * @property {Version} a
 * @property {Version} b
 */

/**
 * Display two versions of a page, side-by-side.
 *
 * @class SideBySideRawVersions
 * @extends {React.Component}
 * @param {SideBySideRawVersionsProps} props
 */

var SideBySideRawVersions = function (_React$Component) {
  inherits(SideBySideRawVersions, _React$Component);

  function SideBySideRawVersions() {
    classCallCheck(this, SideBySideRawVersions);
    return possibleConstructorReturn(this, (SideBySideRawVersions.__proto__ || Object.getPrototypeOf(SideBySideRawVersions)).apply(this, arguments));
  }

  createClass(SideBySideRawVersions, [{
    key: 'render',
    value: function render() {
      return react.createElement(
        'div',
        { className: 'side-by-side-render' },
        renderVersion(this.props.page, this.props.a, this.props.diffData.rawA),
        renderVersion(this.props.page, this.props.b, this.props.diffData.rawB)
      );
    }
  }]);
  return SideBySideRawVersions;
}(react.Component);


function renderVersion(page, version, content) {
  if (content && /^[\s\n\r]*</.test(content)) {
    return react.createElement(SandboxedHtml, { html: content, baseUrl: page.url });
  }

  return react.createElement('iframe', { src: version });
}

/*eslint-disable no-useless-escape*/
var urlRegex = new RegExp(/[\w\.]{2,256}\.[a-z]{2,4}/gi);
/*eslint-enable no-useless-escape*/

function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}

function looksLikeUrl(str) {
  return !!str.match(urlRegex);
}

function startsWith(str, start) {
  return str.indexOf(start) === 0;
}

/*eslint-disable no-mixed-operators*/
function isStrUrl() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var processedValue = str.toLocaleLowerCase();
  return (startsWith(processedValue, 'ftp://') || startsWith(processedValue, 'http://') || startsWith(processedValue, 'https://') || looksLikeUrl(processedValue) && !hasWhiteSpace(processedValue)) && !startsWith(processedValue, 'site:');
}
/*eslint-enable no-mixed-operators*/

function handleRelativeURL(url) {
  var regex = new RegExp(/^http.*/gm);
  if (url.match(regex)) {
    return url;
  }
  if (window.location.port === '80' || window.location.port === '') {
    return window.location.protocol + '//' + window.location.hostname + url;
  }
  return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + url;
}

function hammingWeight(l) {
  var c;
  for (c = 0; l; c++) {
    l &= l - 1;
  }
  return c;
}

function similarity(simhash1, simhash2) {
  return hammingWeight(simhash1 & simhash2) / hammingWeight(simhash1 | simhash2);
}

function checkResponse(response) {
  if (response) {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  }
}

function fetch_with_timeout(promise) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('timeout'));
    }, 45000);
    promise.then(resolve, reject);
  });
}

function getTwoDigitInt(n) {
  if (typeof n === 'string') {
    return n;
  }
  return n > 9 ? '' + n : '0' + n;
}

function getKeyByValue(obj, value) {
  return Object.keys(obj).find(function (key) {
    return obj[key] === value;
  });
}

function selectHasValue(select, value) {
  var obj = document.getElementById(select);

  if (obj !== null) {
    return obj.innerHTML.indexOf('value="' + value + '"') > -1;
  } else {
    return false;
  }
}

/**
 * @typedef DiffViewProps
 * @property {Page} page
 * @property {string} diffType
 * @property {Version} a
 * @property {Version} b
 */

/**
 * Fetches and renders all sorts of diffs between two versions (props a and b)
 *
 * @class DiffView
 * @extends {React.Component}
 * @param {DiffViewProps} props
 */

var DiffView = function (_React$Component) {
  inherits(DiffView, _React$Component);

  function DiffView(props) {
    classCallCheck(this, DiffView);

    var _this = possibleConstructorReturn(this, (DiffView.__proto__ || Object.getPrototypeOf(DiffView)).call(this, props));

    _this.ABORT_CONTROLLER = new window.AbortController();
    _this.isMountedNow = false;

    _this.state = { diffData: null };
    return _this;
  }

  createClass(DiffView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var props = this.props;

      if (this._canFetch(props)) {
        this._loadDiffData(props.page, props.a, props.b, props.diffType);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.isMountedNow = true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.isMountedNow = false;
      this.ABORT_CONTROLLER.abort();
    }

    /**
     * @param {DiffViewProps} nextProps
     */

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this._canFetch(nextProps) && !this._propsSpecifySameDiff(nextProps)) {
        this._loadDiffData(nextProps.page, nextProps.a, nextProps.b, nextProps.diffType);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.state.diffData) {
        var Loader = function Loader() {
          return _this2.props.loader;
        };
        return react.createElement(Loader, null);
      }
      return react.createElement(
        'div',
        { className: 'diff-view' },
        this.renderNoChangeMessage() || this.renderUndiffableMessage(),
        this.renderDiff()
      );
    }
  }, {
    key: 'renderNoChangeMessage',
    value: function renderNoChangeMessage() {

      var className = 'diff-view__alert alert alert-warning';

      if (this.state.diffData.change_count === 0) {

        return react.createElement(
          'div',
          { className: className },
          'There were ',
          react.createElement(
            'strong',
            null,
            'no changes for this diff type'
          ),
          '. (Other diff types may show changes.)'
        );
      }

      return null;
    }
  }, {
    key: 'renderUndiffableMessage',
    value: function renderUndiffableMessage() {
      if (this.state.diffData.raw) {
        return react.createElement(
          'div',
          { className: 'diff-view__alert alert alert-info' },
          'We can\u2019t compare the selected versions of page; you are viewing the content without deletions and insertions highlighted.'
        );
      }
      return null;
    }
  }, {
    key: 'renderDiff',
    value: function renderDiff() {
      // TODO: if we have multiple ways to render content from a single service
      // in the future (e.g. inline vs. side-by-side text), we need a better
      // way to ensure we use the correct rendering and avoid race conditions
      switch (this.props.diffType) {
        case diffTypes.RAW_SIDE_BY_SIDE.value:
          return react.createElement(SideBySideRawVersions, { page: this.props.page, a: this.props.a, b: this.props.b, diffData: this.state.diffData });
        case diffTypes.RAW_FROM_CONTENT.value:
          return react.createElement(RawVersion, { page: this.props.page, version: this.props.a, content: this.state.diffData.rawA });
        case diffTypes.RAW_TO_CONTENT.value:
          return react.createElement(RawVersion, { page: this.props.page, version: this.props.b, content: this.state.diffData.rawB });
        case diffTypes.HIGHLIGHTED_RENDERED.value:
          return react.createElement(InlineRenderedDiff, { diffData: this.state.diffData, page: this.props.page });
        case diffTypes.SIDE_BY_SIDE_RENDERED.value:
          return react.createElement(SideBySideRenderedDiff, { diffData: this.state.diffData, page: this.props.page,
            iframeLoader: this.props.iframeLoader });
        case diffTypes.OUTGOING_LINKS.value:
          return react.createElement(InlineRenderedDiff, { diffData: this.state.diffData, page: this.props.page });
        case diffTypes.HIGHLIGHTED_TEXT.value:
          return react.createElement(HighlightedTextDiff, { diffData: this.state.diffData, className: 'diff-text-inline' });
        case diffTypes.HIGHLIGHTED_SOURCE.value:
          return react.createElement(HighlightedTextDiff, { diffData: this.state.diffData, className: 'diff-source-inline' });
        case diffTypes.CHANGES_ONLY_TEXT.value:
          return react.createElement(ChangesOnlyDiff, { diffData: this.state.diffData, className: 'diff-text-inline' });
        case diffTypes.CHANGES_ONLY_SOURCE.value:
          return react.createElement(ChangesOnlyDiff, { diffData: this.state.diffData, className: 'diff-source-inline' });
        default:
          return null;
      }
    }

    /**
     * Determine whether a set of props specifies the same diff as another set of
     * props (or the current props, if omitted).
     *
     * @private
     * @param {DiffViewProps} newProps The new props to check
     * @param {DiffViewProps} [props=this.props] The current props to compare to
     * @returns {boolean}
     */

  }, {
    key: '_propsSpecifySameDiff',
    value: function _propsSpecifySameDiff(newProps, props) {
      props = props || this.props;
      return props.a === newProps.a && props.b === newProps.b && props.diffType === newProps.diffType;
    }

    /**
     * Check whether this props object has everything needed to perform a fetch
     * @private
     * @param {DiffViewProps} props
     * @returns  {boolean}
     */

  }, {
    key: '_canFetch',
    value: function _canFetch(props) {
      return props.diffType && props.a && props.b;
    }
  }, {
    key: '_loadDiffData',
    value: function _loadDiffData(page, a, b, diffType) {
      var _this3 = this;

      // TODO - this seems to be some sort of caching mechanism, would be smart to have this for diffs
      // const fromList = this.props.pages && this.props.pages.find(
      //     (page: Page) => page.uuid === pageId);
      // Promise.resolve(fromList || this.context.api.getDiff(pageId, aId, bId, changeDiffTypes[diffType]))
      this.setState({ diffData: null });
      if (!diffTypes[diffType].diffService) {
        return Promise.all([fetch_with_timeout(fetch(a.uri, { mode: 'cors' })), fetch_with_timeout(fetch(b.uri, { mode: 'cors' }))]).then(function (_ref) {
          var _ref2 = slicedToArray(_ref, 2),
              rawA = _ref2[0],
              rawB = _ref2[1];

          return { raw: true, rawA: rawA, rawB: rawB };
        }).catch(function (error) {
          return error;
        }).then(function (data) {
          return _this3.setState({ diffData: data });
        });
      }
      var url = this.props.webMonitoringProcessingURL + '/';
      url += diffTypes[diffType].diffService + '?format=json&pass_headers=cookie&include=all&a=' + a + '&b=' + b;
      fetch_with_timeout(fetch(url, { credentials: 'include' })).then(function (response) {
        return checkResponse(response);
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this3.setState({
          diffData: data
        });
      }).catch(function (error) {
        _this3._errorHandled(error.message);
      });
    }
  }, {
    key: '_errorHandled',
    value: function _errorHandled(error) {
      if (this.isMountedNow) {
        this.props.errorHandledCallback(error);
        this.setState({ showError: true });
      }
    }
  }]);
  return DiffView;
}(react.Component);

var css$1 = "#diff-select{\n    margin-bottom: 0.7em;\n}\n\n.timestamp-container-view{\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n}\n\n#diff-footer{\n    text-align: center;\n}\n\nyellow-diff-footer{\n    background-color: #f7f417;\n}\n\nblue-diff-footer{\n    background-color: #1d9efd;\n}\n\n.align-items-center > .col-auto {\n    margin-left: auto;\n    margin-right: auto;\n}\n\n#timestamp-select-left, #timestamp-select-right,\n#year-select-left, #year-select-right,\n#month-select-right, #month-select-left{\n    width: auto;\n    padding-left: 1px;\n    padding-right: 1px;\n}\n\n#explanation-middle{\n    text-align: center;\n}\n\n#timestamp-left{\n    display: inline-block;\n    float: left;\n    margin-left: 15px;\n}\n\n#timestamp-right{\n    display: inline-block;\n    float: right;\n    margin-right: 15px;\n}\n\n#restart-btn{\n    display: block;\n    margin-left: auto;\n    margin-right: auto;\n}\n\n.wayback-ymd-timestamp{\n    display: flex;\n}\n\n.wayback-timestamps> * {\n    margin-left: 10px;\n    margin-right: 10px;\n}\n\n.wayback-timestamps {\n    flex: 2 auto;\n    display: flex;\n    flex-flow: row wrap;\n    justify-content: center;\n}\n\n.wayback-ymd-buttons {\n    flex: 1 auto;\n    display: flex;\n    flex-flow: row wrap;\n    justify-content: center;\n}\n\n";
styleInject(css$1);

/**
 * Display a timestamp selector
 *
 * @class YmdTimestampHeader
 * @extends {React.Component}
 */

var YmdTimestampHeader = function (_React$Component) {
  inherits(YmdTimestampHeader, _React$Component);

  function YmdTimestampHeader(props) {
    classCallCheck(this, YmdTimestampHeader);

    var _this = possibleConstructorReturn(this, (YmdTimestampHeader.__proto__ || Object.getPrototypeOf(YmdTimestampHeader)).call(this, props));

    _this.ABORT_CONTROLLER = new window.AbortController();
    _this._isMountedNow = false;
    _this._shouldValidateTimestamp = true;
    _this._monthNames = {
      1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May',
      6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
    };
    _this._leftMonthIndex = -1;
    _this._rightMonthIndex = -1;
    _this._leftTimestampIndex = -1;
    _this._rightTimestampIndex = -1;
    _this._visibilityState = ['visible', 'hidden'];


    var leftYear = _this.props.timestampA === undefined ? null : _this.props.timestampA.substring(0, 4);
    var rightYear = _this.props.timestampB === undefined ? null : _this.props.timestampB.substring(0, 4);

    _this.state = {
      cdxData: false,
      showDiff: false,
      showError: false,
      timestampA: _this.props.timestampA,
      timestampB: _this.props.timestampB,
      leftYear: leftYear,
      rightYear: rightYear,
      showSteps: _this.props.isInitial
    };

    _this._handleLeftTimestampChange = _this._handleLeftTimestampChange.bind(_this);

    _this._handleRightTimestampChange = _this._handleRightTimestampChange.bind(_this);

    _this._restartPressed = _this._restartPressed.bind(_this);

    _this._showDiffs = _this._showDiffs.bind(_this);

    _this._errorHandled = _this._errorHandled.bind(_this);

    _this._showMonths = _this._showMonths.bind(_this);

    _this._getTimestamps = _this._getTimestamps.bind(_this);

    _this._handleYearChange = _this._handleYearChange.bind(_this);

    return _this;
  }

  createClass(YmdTimestampHeader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._isMountedNow = true;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state.cdxData) {
        if (!this.state.sparkline && !this.state.showLoader) {
          this._fetchSparklineData();
        }
        if (!this.state.showLoader) {
          this._selectValues();
          if (this.state.sparkline && !this.state.leftMonthOptions && !this.state.rightMonthOptions) {
            if (this._leftMonthIndex !== -1 || this._rightMonthIndex !== -1) {
              this._showMonths();
            }
          }
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMountedNow = false;
      this.ABORT_CONTROLLER.abort();
    }
  }, {
    key: '_handleRightTimestampChange',
    value: function _handleRightTimestampChange() {
      this._rightTimestampIndex = document.getElementById('timestamp-select-right').selectedIndex;
      if (this._isShowing('timestamp-select-left')) {
        this._showElement('restart-btn');
        this._showElement('show-diff-btn');
        var selectedDigest = this.state.rightSnaps[this._rightTimestampIndex][1];
        var allowedSnapshots = this.state.leftSnaps;
        allowedSnapshots = allowedSnapshots.filter(function (hash) {
          return hash[1] !== selectedDigest;
        });
        this.setState({
          leftSnapElements: this._prepareOptionElements(allowedSnapshots)
        });
      }
    }
  }, {
    key: '_handleLeftTimestampChange',
    value: function _handleLeftTimestampChange() {
      this._leftTimestampIndex = document.getElementById('timestamp-select-left').selectedIndex;
      if (this._isShowing('timestamp-select-right')) {
        this._showElement('restart-btn');
        this._showElement('show-diff-btn');
        var selectedDigest = this.state.leftSnaps[this._leftTimestampIndex][1];
        var allowedSnapshots = this.state.rightSnaps;
        allowedSnapshots = allowedSnapshots.filter(function (hash) {
          return hash[1] !== selectedDigest;
        });
        this.setState({
          rightSnapElements: this._prepareOptionElements(allowedSnapshots)
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var Loader = function Loader() {
        return _this2.props.loader;
      };
      if (this.state.showLoader && !this.state.showError) {
        return react.createElement(Loader, null);
      }
      if (!this.state.showError) {
        if (this.state.showSteps) {
          if (this.state.yearOptions) {
            return react.createElement(
              'div',
              { className: 'timestamp-header-view' },
              this._showInfo(),
              this._showTimestampSelector(),
              this._showOpenLinks()
            );
          }
          this._fetchSparklineData();
          return react.createElement(Loader, null);
        }
        if (this.state.cdxData) {
          if (this._shouldValidateTimestamp) {
            this._checkTimestamps();
          }
          return react.createElement(
            'div',
            { className: 'timestamp-header-view' },
            this._showInfo(),
            this._showTimestampSelector(),
            this._showOpenLinks()
          );
        }
        this._fetchCDXData();
        return react.createElement(Loader, null);
      }
    }
  }, {
    key: '_checkTimestamps',
    value: function _checkTimestamps() {
      var _this3 = this;

      this._shouldValidateTimestamp = false;
      var fetchedTimestamps = { a: '', b: '' };
      if (this.state.timestampA && this.state.timestampB) {
        this._validateTimestamp(this.state.timestampA, fetchedTimestamps, 'a').then(function () {
          return _this3._validateTimestamp(_this3.state.timestampB, fetchedTimestamps, 'b');
        }).then(function () {
          if (_this3._redirectToValidatedTimestamps) {
            _this3._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(function (error) {
          _this3._errorHandled(error.message);
        });
      } else if (this.state.timestampA) {
        this._validateTimestamp(this.state.timestampA, fetchedTimestamps, 'a').then(function () {
          if (_this3._redirectToValidatedTimestamps) {
            _this3._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(function (error) {
          _this3._errorHandled(error.message);
        });
      } else if (this.state.timestampB) {
        this._validateTimestamp(this.state.timestampB, fetchedTimestamps, 'b').then(function () {
          if (_this3._redirectToValidatedTimestamps) {
            _this3._setNewURL(fetchedTimestamps.a, fetchedTimestamps.b);
          }
        }).catch(function (error) {
          _this3._errorHandled(error.message);
        });
      }
    }
  }, {
    key: '_validateTimestamp',
    value: function _validateTimestamp(timestamp, fetchedTimestamps, position) {
      if (this.props.fetchSnapshotCallback) {
        return this._handleTimestampValidationFetch(this.props.fetchSnapshotCallback(timestamp), timestamp, fetchedTimestamps, position);
      }
      var url = handleRelativeURL(this.props.conf.snapshotsPrefix) + timestamp + '/' + encodeURIComponent(this.props.url);
      return this._handleTimestampValidationFetch(fetch_with_timeout(fetch(url, { redirect: 'follow' })), timestamp, fetchedTimestamps, position);
    }
  }, {
    key: '_handleTimestampValidationFetch',
    value: function _handleTimestampValidationFetch(promise, timestamp, fetchedTimestamps, position) {
      var _this4 = this;

      return promise.then(function (response) {
        return checkResponse(response);
      }).then(function (response) {
        var url = response.url;
        fetchedTimestamps[position] = url.split('/')[4];
        if (timestamp !== fetchedTimestamps[position]) {
          _this4._redirectToValidatedTimestamps = true;
        }
      }).catch(function (error) {
        _this4.errorHandled(error.message);
      });
    }
  }, {
    key: '_setNewURL',
    value: function _setNewURL(fetchedTimestampA, fetchedTimestampB) {
      this._redirectToValidatedTimestamps = false;
      if (fetchedTimestampA === undefined) {
        fetchedTimestampA = '';
      }
      if (fetchedTimestampB === undefined) {
        fetchedTimestampB = '';
      }
      window.history.pushState({}, '', this.props.conf.urlPrefix + fetchedTimestampA + '/' + fetchedTimestampB + '/' + this.props.url);
      this.setState({ timestampA: fetchedTimestampA, timestampB: fetchedTimestampB });
      document.getElementById('timestamp-select-left').value = fetchedTimestampA;
      document.getElementById('timestamp-select-right').value = fetchedTimestampB;
    }
  }, {
    key: '_fetchCDXData',
    value: function _fetchCDXData() {
      this.setState({ showLoader: true });
      var leftFetchPromise = void 0;
      var rightFetchPromise = void 0;
      this._saveMonthsIndex();
      if (this.props.fetchCDXCallback) {
        leftFetchPromise = this._handleFetch(this.props.fetchCDXCallback());
      } else {
        var url = void 0;
        if (this._leftMonthIndex !== -1 && !isNaN(this._leftMonthIndex)) {
          url = handleRelativeURL(this.props.conf.cdxServer) + 'search?&url=' + encodeURIComponent(this.props.url) + '&status=200&fl=timestamp,digest&output=json&from=' + this.state.leftYear + getTwoDigitInt(this._leftMonthIndex) + '&to=' + this.state.leftYear + getTwoDigitInt(this._leftMonthIndex) + '&limit=' + this.props.conf.limit;
          leftFetchPromise = this._handleFetch(fetch_with_timeout(fetch(url, { signal: this.ABORT_CONTROLLER.signal })));
        }
        if (this._rightMonthIndex !== -1 && !isNaN(this._rightMonthIndex)) {
          url = handleRelativeURL(this.props.conf.cdxServer) + 'search?&url=' + encodeURIComponent(this.props.url) + '&status=200&fl=timestamp,digest&output=json&from=' + this.state.rightYear + getTwoDigitInt(this._rightMonthIndex) + '&to=' + this.state.rightYear + getTwoDigitInt(this._rightMonthIndex) + '&limit=' + this.props.conf.limit;
          rightFetchPromise = this._handleFetch(fetch_with_timeout(fetch(url, { signal: this.ABORT_CONTROLLER.signal })));
        }
      }
      this._exportCDXData(leftFetchPromise, rightFetchPromise);
    }
  }, {
    key: '_handleFetch',
    value: function _handleFetch(promise) {
      return promise.then(function (response) {
        if (response) {
          if (!response.ok) {
            throw Error(response.status);
          }
          return response.json();
        }
      });
    }
  }, {
    key: '_exportCDXData',
    value: function _exportCDXData(leftFetchPromise, rightFetchPromise) {
      var _this5 = this;

      if (leftFetchPromise) {
        leftFetchPromise.then(function (data) {
          if (data && data.length > 0) {
            if (rightFetchPromise) {
              var leftData = data;
              rightFetchPromise.then(function (data) {
                if (data && data.length > 0) {
                  _this5._prepareCDXData(leftData, data);
                } else {
                  _this5.props.errorHandledCallback('404');
                  _this5.setState({ showError: true });
                }
              });
            } else {
              _this5._prepareCDXData(data, null);
            }
          } else {
            _this5.props.errorHandledCallback('404');
            _this5.setState({ showError: true });
          }
        }).catch(function (error) {
          _this5._errorHandled(error.message);
        });
      } else if (rightFetchPromise) {
        rightFetchPromise.then(function (data) {
          if (data && data.length > 0) {
            _this5._prepareCDXData(null, data);
          } else {
            _this5.props.errorHandledCallback('404');
            _this5.setState({ showError: true });
          }
        });
      }
    }
  }, {
    key: '_errorHandled',
    value: function _errorHandled(error) {
      if (this._isMountedNow) {
        this.props.errorHandledCallback(error);
        this.setState({ showError: true });
      }
    }
  }, {
    key: '_prepareCDXData',
    value: function _prepareCDXData(leftData, data) {
      if (data) {
        data.shift();
      }
      if (leftData) {
        leftData.shift();
      }
      this.setState({
        cdxData: true,
        leftSnaps: leftData,
        rightSnaps: data,
        leftSnapElements: this._prepareOptionElements(leftData),
        rightSnapElements: this._prepareOptionElements(data),
        showLoader: false
      });
    }
  }, {
    key: '_prepareOptionElements',
    value: function _prepareOptionElements(data) {
      if (data) {
        var initialSnapshots = [];
        for (var i = 0; i < data.length; i++) {
          var utcTime = this._getUTCDateFormat(data[i][0]);
          initialSnapshots.push(react.createElement(
            'option',
            { key: i, value: data[i][0] },
            utcTime
          ));
        }
        return initialSnapshots;
      }
    }
  }, {
    key: '_prepareSparklineOptionElements',
    value: function _prepareSparklineOptionElements(data) {
      if (data) {
        var options = [];
        for (var i = data.length - 1; i >= 0; i--) {
          var count = data[i][1];
          if (count > parseInt(this.props.conf.limit)) {
            count = this.props.conf.limit;
          }
          options.push(react.createElement(
            'option',
            { key: i, value: data[i][0] },
            data[i][0] + ' (' + count + ')'
          ));
        }
        return options;
      }
    }
  }, {
    key: '_getUTCDateFormat',
    value: function _getUTCDateFormat(date) {
      var year = parseInt(date.substring(0, 4), 10);
      var month = parseInt(date.substring(4, 6), 10) - 1;
      var day = parseInt(date.substring(6, 8), 10);
      var hour = parseInt(date.substring(8, 10), 10);
      var minutes = parseInt(date.substring(10, 12), 10);
      var seconds = parseInt(date.substring(12, 14), 10);

      var niceTime = new Date(Date.UTC(year, month, day, hour, minutes, seconds));
      return niceTime.toUTCString();
    }
  }, {
    key: '_getShortUTCDateFormat',
    value: function _getShortUTCDateFormat(date) {
      var year = parseInt(date.substring(0, 4), 10);
      var month = parseInt(date.substring(4, 6), 10) - 1;
      var day = parseInt(date.substring(6, 8), 10);
      var shortTime = new Date(Date.UTC(year, month, day));
      shortTime = shortTime.toUTCString();
      shortTime = shortTime.split(' ');
      var retTime = shortTime[0] + ' ' + shortTime[1] + ' ' + shortTime[2] + ' ' + shortTime[3];
      return retTime;
    }
  }, {
    key: '_getYear',
    value: function _getYear(date) {
      return parseInt(date.substring(0, 4), 10);
    }
  }, {
    key: '_restartPressed',
    value: function _restartPressed() {
      this._hideAndCollapseElement('restart-btn');
      this.setState({
        leftSnapElements: this._prepareOptionElements(this.state.leftSnaps),
        rightSnapElements: this._prepareOptionElements(this.state.rightSnaps)
      });
    }
  }, {
    key: '_showTimestampSelector',
    value: function _showTimestampSelector() {
      return react.createElement(
        'div',
        { className: 'wayback-ymd-timestamp' },
        react.createElement(
          'div',
          { className: 'wayback-timestamps' },
          react.createElement(
            'select',
            { className: 'form-control mr-sm-1', id: 'year-select-left', onClick: this._handleYearChange },
            react.createElement('optgroup', { label: 'Years and available captures' }),
            this.state.yearOptions
          ),
          react.createElement(
            'select',
            { className: 'form-control mr-sm-1', id: 'month-select-left', style: { visibility: this._visibilityState[+(this._leftMonthIndex === -1)] }, onClick: this._getTimestamps },
            react.createElement('optgroup', { label: 'Months and available captures' }),
            this.state.leftMonthOptions
          ),
          react.createElement(
            'select',
            { className: 'form-control mr-sm-1', id: 'timestamp-select-left', style: { visibility: this._visibilityState[+!this.state.leftSnapElements] }, onClick: this._handleLeftTimestampChange },
            react.createElement('optgroup', { label: 'Available captures' }),
            this.state.leftSnapElements
          )
        ),
        react.createElement(
          'div',
          { className: 'wayback-ymd-buttons' },
          react.createElement(
            'button',
            { className: 'btn btn-sm', id: 'show-diff-btn', style: { visibility: 'hidden' }, onClick: this._showDiffs },
            'Show differences'
          ),
          react.createElement(
            'button',
            { className: 'btn btn-sm', id: 'restart-btn', style: { visibility: 'hidden' }, onClick: this._restartPressed },
            'Restart'
          )
        ),
        react.createElement(
          'div',
          { className: 'wayback-timestamps' },
          react.createElement(
            'select',
            { className: 'form-control mr-sm-1', id: 'timestamp-select-right', style: { visibility: this._visibilityState[+!this.state.rightSnapElements] }, onClick: this._handleRightTimestampChange },
            react.createElement('optgroup', { label: 'Available captures' }),
            this.state.rightSnapElements
          ),
          react.createElement(
            'select',
            { className: 'form-control mr-sm-1', id: 'month-select-right', style: { visibility: this._visibilityState[+(this._rightMonthIndex === -1)] }, onClick: this._getTimestamps },
            react.createElement('optgroup', { label: 'Months and available captures' }),
            this.state.rightMonthOptions
          ),
          react.createElement(
            'select',
            { className: 'form-control mr-sm-1', id: 'year-select-right', onClick: this._handleYearChange },
            react.createElement('optgroup', { label: 'Years and available captures' }),
            this.state.yearOptions
          )
        )
      );
    }
  }, {
    key: '_showOpenLinks',
    value: function _showOpenLinks() {
      if (!this.state.showSteps || this.state.showDiff) {
        if (this.state.timestampA) {
          var aLeft = react.createElement(
            'a',
            { href: this.props.conf.snapshotsPrefix + this.state.timestampA + '/' + this.props.url,
              id: 'timestamp-left', target: '_blank', rel: 'noopener' },
            ' Open in new window'
          );
        }
        if (this.state.timestampB) {
          var aRight = react.createElement(
            'a',
            { href: this.props.conf.snapshotsPrefix + this.state.timestampB + '/' + this.props.url,
              id: 'timestamp-right', target: '_blank', rel: 'noopener' },
            'Open in new window'
          );
        }
        var div = react.createElement(
          'div',
          null,
          aLeft,
          aRight,
          react.createElement('br', null)
        );
        return div;
      }
    }
  }, {
    key: '_showDiffs',
    value: function _showDiffs() {

      var loaders = document.getElementsByClassName('waybackDiffIframeLoader');

      while (loaders.length > 0) {
        loaders[0].parentNode.removeChild(loaders[0]);
      }

      var timestampAelement = document.getElementById('timestamp-select-left');
      var timestampA = '';
      if (timestampAelement.style.visibility !== 'hidden') {
        timestampA = timestampAelement.value;
      }
      var timestampBelement = document.getElementById('timestamp-select-right');
      var timestampB = '';
      if (timestampBelement.style.visibility !== 'hidden') {
        timestampB = timestampBelement.value;
      }
      this.props.changeTimestampsCallback(timestampA, timestampB);
      this.setState({ showDiff: true,
        timestampA: timestampA,
        timestampB: timestampB });
    }
  }, {
    key: '_selectValues',
    value: function _selectValues() {
      if (this._isShowing('timestamp-select-left')) {
        if (this._leftTimestampIndex !== -1) {
          document.getElementById('timestamp-select-left').selectedIndex = this._leftTimestampIndex;
        } else {
          document.getElementById('timestamp-select-left').value = this.state.timestampA;
        }
      }
      if (this._isShowing('timestamp-select-right')) {
        if (this._rightTimestampIndex !== -1) {
          document.getElementById('timestamp-select-right').selectedIndex = this._rightTimestampIndex;
        } else {
          document.getElementById('timestamp-select-right').value = this.state.timestampB;
        }
      }
      var monthLeft = document.getElementById('month-select-left');
      var monthRight = document.getElementById('month-select-right');

      if (selectHasValue(monthLeft.id, this._monthNames[this._leftMonthIndex])) {
        monthLeft.value = this._monthNames[this._leftMonthIndex];
      } else {
        monthLeft.selectedIndex = 0;
      }
      if (selectHasValue(monthRight.id, this._monthNames[this._rightMonthIndex])) {
        monthRight.value = this._monthNames[this._rightMonthIndex];
      } else {
        monthRight.selectedIndex = 0;
      }

      document.getElementById('year-select-left').value = this.state.leftYear;
      document.getElementById('year-select-right').value = this.state.rightYear;
    }
  }, {
    key: '_getHeaderInfo',
    value: function _getHeaderInfo(firstTimestamp, lastTimestamp, count) {
      var first = this._getShortUTCDateFormat(firstTimestamp);
      var last = this._getShortUTCDateFormat(lastTimestamp);
      var numberWithCommas = function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      };
      return react.createElement(
        'p',
        { id: 'explanation-middle' },
        ' Compare any two captures of ',
        this.props.url,
        ' from our collection of ',
        numberWithCommas(count),
        ' dating from ',
        first,
        ' to ',
        last,
        '.'
      );
    }
  }, {
    key: '_fetchSparklineData',
    value: function _fetchSparklineData() {
      this.setState({ showLoader: true });
      var url = handleRelativeURL(this.props.conf.sparklineURL);
      url += '?url=' + encodeURIComponent(this.props.url) + '&collection=web&output=json';
      var fetchPromise = this._handleFetch(fetch_with_timeout(fetch(url, { signal: this.ABORT_CONTROLLER.signal })));
      this._exportSparklineData(fetchPromise);
    }
  }, {
    key: '_exportSparklineData',
    value: function _exportSparklineData(promise) {
      var _this6 = this;

      promise.then(function (data) {
        if (data) {
          _this6._prepareSparklineData(data);
        } else {
          _this6.props.errorHandledCallback('404');
          _this6.setState({ showError: true });
        }
      }).catch(function (error) {
        _this6._errorHandled(error.message);
      });
    }
  }, {
    key: '_prepareSparklineData',
    value: function _prepareSparklineData(data) {

      var snapshots = data['years'];
      var yearSum = new Array(snapshots.length);
      var j = 0;
      var allSum = 0;
      for (var year in snapshots) {
        yearSum[j] = [year, 0];
        for (var i = 0; i < snapshots[year].length; i++) {
          yearSum[j][1] = yearSum[j][1] + snapshots[year][i];
          allSum = allSum + snapshots[year][i];
        }
        j++;
      }
      this.setState({
        showLoader: false,
        sparkline: snapshots,
        yearOptions: this._prepareSparklineOptionElements(yearSum),
        headerInfo: this._getHeaderInfo(data['first_ts'], data['last_ts'], allSum)
      });
    }
  }, {
    key: '_showMonths',
    value: function _showMonths() {
      var leftYear = document.getElementById('year-select-left').value;
      var rightYear = document.getElementById('year-select-right').value;

      var leftMonths = this.state.sparkline[leftYear];
      var rightMonths = this.state.sparkline[rightYear];

      var leftMonthsData = this._getMonthData(leftMonths);
      var rightMonthsData = this._getMonthData(rightMonths);

      this.setState({
        leftYear: leftYear,
        rightYear: rightYear,
        leftMonthOptions: this._prepareSparklineOptionElements(leftMonthsData),
        rightMonthOptions: this._prepareSparklineOptionElements(rightMonthsData)
      });
    }
  }, {
    key: '_getMonthData',
    value: function _getMonthData(data) {
      if (data) {
        var monthData = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i] > 0) {
            monthData.push([this._monthNames[i + 1], data[i]]);
          }
        }
        return monthData;
      }
    }
  }, {
    key: '_getTimestamps',
    value: function _getTimestamps(e) {
      this._fetchCDXData();
      var elemToShow = void 0;
      if (e.target.id === 'month-select-left') {
        elemToShow = 'timestamp-select-left';
        this._leftTimestampIndex = 0;
      } else {
        elemToShow = 'timestamp-select-right';
        this._rightTimestampIndex = 0;
      }
      document.getElementById(elemToShow).selectedIndex = '0';
      this._showElement(elemToShow);
      this._showElement('show-diff-btn');
      this.setState({
        timestampA: null,
        timestampB: null
      });
    }
  }, {
    key: '_showElement',
    value: function _showElement(elementID) {
      var element = document.getElementById(elementID);
      if (element.style.visibility === 'hidden') {
        element.style.visibility = 'visible';
      } else if (element.style.display === 'none') {
        element.style.display = 'block';
      }
    }
  }, {
    key: '_isShowing',
    value: function _isShowing(elementID) {
      var element = document.getElementById(elementID);
      return element && element.style.visibility === 'visible';
    }
  }, {
    key: '_hideElement',
    value: function _hideElement(elementID) {
      var element = document.getElementById(elementID);
      if (element.style.visibility !== 'hidden') {
        element.style.visibility = 'hidden';
      }
    }
  }, {
    key: '_hideAndCollapseElement',
    value: function _hideAndCollapseElement(elementID) {
      var element = document.getElementById(elementID);
      if (element.style.display !== 'none') {
        element.style.display = 'none';
      }
    }
  }, {
    key: '_showInfo',
    value: function _showInfo() {
      return react.createElement(
        'div',
        null,
        this.state.headerInfo,
        react.createElement(
          'div',
          { id: 'timestamp-left' },
          'Please select a capture'
        ),
        react.createElement(
          'div',
          { id: 'timestamp-right' },
          'Please select a capture'
        ),
        react.createElement('br', null)
      );
    }
  }, {
    key: '_handleYearChange',
    value: function _handleYearChange(e) {
      var elemToHide = void 0;
      if (e.target.id === 'year-select-left') {
        elemToHide = 'timestamp-select-left';
        this._leftMonthIndex = 0;
      } else {
        elemToHide = 'timestamp-select-right';
        this._rightMonthIndex = 0;
      }
      this._hideElement(elemToHide);
      this._hideElement('show-diff-btn');
      var elemToShow = void 0;
      if (e.target.id === 'year-select-left') {
        elemToShow = 'month-select-left';
      } else {
        elemToShow = 'month-select-right';
      }
      this._showElement(elemToShow);
      this._showMonths();
    }
  }, {
    key: '_saveMonthsIndex',
    value: function _saveMonthsIndex() {
      if (this._isShowing('month-select-left')) {
        var monthLeft = document.getElementById('month-select-left').value;
        this._leftMonthIndex = parseInt(getKeyByValue(this._monthNames, monthLeft));
      } else if (this.props.timestampA) {
        this._leftMonthIndex = parseInt(this.props.timestampA.substring(4, 6));
      }
      if (this._isShowing('month-select-right')) {
        var monthRight = document.getElementById('month-select-right').value;
        this._rightMonthIndex = parseInt(getKeyByValue(this._monthNames, monthRight));
      } else if (this.props.timestampB) {
        this._rightMonthIndex = parseInt(this.props.timestampB.substring(4, 6));
      }
    }
  }]);
  return YmdTimestampHeader;
}(react.Component);

/**
 * Display a footer explaining the colors showing in the diffs
 *
 * @class DiffFooter
 * @extends {React.Component}
 */

var DiffFooter = function (_React$Component) {
  inherits(DiffFooter, _React$Component);

  function DiffFooter() {
    classCallCheck(this, DiffFooter);
    return possibleConstructorReturn(this, (DiffFooter.__proto__ || Object.getPrototypeOf(DiffFooter)).apply(this, arguments));
  }

  createClass(DiffFooter, [{
    key: 'render',
    value: function render() {
      // console.log('diff-Footer render');
      return react.createElement(
        'div',
        null,
        react.createElement(
          'p',
          { id: 'diff-footer' },
          react.createElement(
            'yellow-diff-footer',
            null,
            'Yellow'
          ),
          ' indicates content deletion. ',
          react.createElement(
            'blue-diff-footer',
            null,
            'Blue'
          ),
          ' indicates content addition'
        )
      );
    }
  }]);
  return DiffFooter;
}(react.Component);

/**
 * Display a message that no url is given so no snapshot is displayed
 *
 * @class NoSnapshotURL
 * @extends {React.Component}
 */

var NoSnapshotURL = function (_React$Component) {
  inherits(NoSnapshotURL, _React$Component);

  function NoSnapshotURL() {
    classCallCheck(this, NoSnapshotURL);
    return possibleConstructorReturn(this, (NoSnapshotURL.__proto__ || Object.getPrototypeOf(NoSnapshotURL)).apply(this, arguments));
  }

  createClass(NoSnapshotURL, [{
    key: 'render',
    value: function render() {
      return react.createElement(
        'div',
        null,
        react.createElement(
          'h1',
          null,
          'No capture is selected, please pick one from the list.'
        )
      );
    }
  }]);
  return NoSnapshotURL;
}(react.Component);

/**
 * Display an error message depending on props
 *
 * @class ErrorMessage
 * @extends {React.Component}
 */

var ErrorMessage = function (_React$Component) {
  inherits(ErrorMessage, _React$Component);

  function ErrorMessage() {
    classCallCheck(this, ErrorMessage);
    return possibleConstructorReturn(this, (ErrorMessage.__proto__ || Object.getPrototypeOf(ErrorMessage)).apply(this, arguments));
  }

  createClass(ErrorMessage, [{
    key: 'render',
    value: function render() {
      console.warn(this.props.code);
      if (this.props.code === '404') {
        return react.createElement(
          'div',
          { className: 'alert alert-warning', role: 'alert' },
          'The Wayback Machine doesn\'t have ',
          this.props.url,
          ' archived.'
        );
      }
      return react.createElement(
        'div',
        { className: 'alert alert-warning', role: 'alert' },
        'Communication with the Wayback Machine is not possible at the moment. Please try again later.'
      );
    }
  }]);
  return ErrorMessage;
}(react.Component);

/**
 * Display a change between two versions of a page.
 *
 * @class DiffContainer
 * @extends {React.Component}
 */

var DiffContainer = function (_React$Component) {
  inherits(DiffContainer, _React$Component);

  function DiffContainer(props) {
    classCallCheck(this, DiffContainer);

    var _this = possibleConstructorReturn(this, (DiffContainer.__proto__ || Object.getPrototypeOf(DiffContainer)).call(this, props));

    _this._errorCode = '';

    _this.state = {
      fetchedRaw: null,
      showError: false,
      timestampA: _this.props.timestampA,
      timestampB: _this.props.timestampB
    };
    _this._oneFrame = null;
    _this.errorHandled = _this.errorHandled.bind(_this);
    _this.changeTimestamps = _this.changeTimestamps.bind(_this);
    _this.prepareDiffView = _this.prepareDiffView.bind(_this);
    return _this;
  }

  createClass(DiffContainer, [{
    key: 'changeTimestamps',
    value: function changeTimestamps(timestampA, timestampB) {
      window.history.pushState({}, '', this.props.conf.urlPrefix + timestampA + '/' + timestampB + '/' + this.props.url);
      this.setState({
        fetchedRaw: null,
        showError: false,
        timestampA: timestampA,
        timestampB: timestampB });
    }
  }, {
    key: 'errorHandled',
    value: function errorHandled(errorCode) {
      this._errorCode = errorCode;
      this.setState({ showError: true });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this._urlIsInvalid()) {
        return this._invalidURL();
      }
      if (this.state.showError) {
        return react.createElement(ErrorMessage, { url: this.props.url, code: this._errorCode });
      }
      if (!this.state.timestampA && !this.state.timestampB) {
        if (this.props.noTimestamps) {
          return react.createElement(
            'div',
            { className: 'diffcontainer-view' },
            react.createElement(YmdTimestampHeader, _extends({}, this.props, { changeTimestampsCallback: this.changeTimestamps,
              isInitial: true, errorHandledCallback: this.errorHandled })),
            this._showNoTimestamps()
          );
        }
        return react.createElement(
          'div',
          { className: 'diffcontainer-view' },
          react.createElement(YmdTimestampHeader, _extends({ isInitial: true }, this.props, {
            errorHandledCallback: this.errorHandled,
            changeTimestampsCallback: this.changeTimestamps }))
        );
      }
      if (this.state.timestampA && this.state.timestampB) {
        return react.createElement(
          'div',
          { className: 'diffcontainer-view' },
          react.createElement(YmdTimestampHeader, _extends({ isInitial: false
          }, this.props, { changeTimestampsCallback: this.changeTimestamps,
            errorHandledCallback: this.errorHandled })),
          this.prepareDiffView(),
          react.createElement(DiffFooter, null)
        );
      }
      if (this.state.timestampA) {
        return react.createElement(
          'div',
          { className: 'diffcontainer-view' },
          react.createElement(YmdTimestampHeader, _extends({}, this.props, { changeTimestampsCallback: this.changeTimestamps,
            isInitial: false, errorHandledCallback: this.errorHandled })),
          this._showOneSnapshot(true, this.state.timestampA)
        );
      }
      if (this.state.timestampB) {
        return react.createElement(
          'div',
          { className: 'diffcontainer-view' },
          react.createElement(YmdTimestampHeader, _extends({ isInitial: false }, this.props, {
            errorHandledCallback: this.errorHandled,
            changeTimestampsCallback: this.changeTimestamps })),
          this._showOneSnapshot(false, this.state.timestampB)
        );
      }
    }
  }, {
    key: '_showNoTimestamps',
    value: function _showNoTimestamps() {
      return react.createElement(
        'div',
        { className: 'side-by-side-render' },
        react.createElement(NoSnapshotURL, null),
        react.createElement(NoSnapshotURL, null)
      );
    }
  }, {
    key: '_showOneSnapshot',
    value: function _showOneSnapshot(isLeft, timestamp) {
      var _this2 = this;

      this._timestampsValidated = true;
      if (this.state.fetchedRaw) {
        if (isLeft) {
          return react.createElement(
            'div',
            { className: 'side-by-side-render' },
            react.createElement('iframe', { height: window.innerHeight, onLoad: function onLoad() {
                _this2._handleHeight();
              },
              srcDoc: this.state.fetchedRaw,
              ref: function ref(frame) {
                return _this2._oneFrame = frame;
              }
            }),
            react.createElement(NoSnapshotURL, null)
          );
        }
        return react.createElement(
          'div',
          { className: 'side-by-side-render' },
          react.createElement(NoSnapshotURL, null),
          react.createElement('iframe', { height: window.innerHeight, onLoad: function onLoad() {
              _this2._handleHeight();
            },
            srcDoc: this.state.fetchedRaw,
            ref: function ref(frame) {
              return _this2._oneFrame = frame;
            }
          })
        );
      }
      if (this.props.fetchSnapshotCallback) {
        this._handleSnapshotFetch(this.props.fetchSnapshotCallback(timestamp));
      } else {
        var url = handleRelativeURL(this.props.conf.snapshotsPrefix) + timestamp + '/' + encodeURIComponent(this.props.url);
        this._handleSnapshotFetch(fetch_with_timeout(fetch(url)));
      }

      var Loader = function Loader() {
        return _this2.props.loader;
      };
      return react.createElement(Loader, null);
    }
  }, {
    key: '_handleSnapshotFetch',
    value: function _handleSnapshotFetch(promise) {
      var _this3 = this;

      promise.then(function (response) {
        return checkResponse(response);
      }).then(function (response) {
        var contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          return response.text();
        } else {
          return '<iframe src=' + response.url + ' style="width: 98%; position: absolute; height: 98%;" />';
        }
      }).then(function (responseText) {
        _this3.setState({ fetchedRaw: responseText });
      }).catch(function (error) {
        _this3.errorHandled(error.message);
      });
    }
  }, {
    key: 'prepareDiffView',
    value: function prepareDiffView() {
      if (!this.state.showError) {
        var urlA = handleRelativeURL(this.props.conf.snapshotsPrefix) + this.state.timestampA + '/' + encodeURIComponent(this.props.url);
        var urlB = handleRelativeURL(this.props.conf.snapshotsPrefix) + this.state.timestampB + '/' + encodeURIComponent(this.props.url);

        return react.createElement(DiffView, { webMonitoringProcessingURL: handleRelativeURL(this.props.conf.webMonitoringProcessingURL),
          page: { url: encodeURIComponent(this.props.url) }, diffType: 'SIDE_BY_SIDE_RENDERED', a: urlA, b: urlB,
          loader: this.props.loader, iframeLoader: this.props.conf.iframeLoader, errorHandledCallback: this.errorHandled });
      }
    }
  }, {
    key: '_handleHeight',
    value: function _handleHeight() {
      var offsetHeight = this._oneFrame.contentDocument.documentElement.scrollHeight;
      var offsetWidth = this._oneFrame.contentDocument.documentElement.scrollWidth;
      if (offsetHeight > 0.1 * this._oneFrame.height) {
        this._oneFrame.height = offsetHeight + offsetHeight * 0.01;
      } else {
        this._oneFrame.height = 0.5 * this._oneFrame.height;
      }
      if (offsetWidth > this._oneFrame.clientWidth) {
        this._oneFrame.width = offsetWidth;
      }
    }
  }, {
    key: '_urlIsInvalid',
    value: function _urlIsInvalid() {
      return !isStrUrl(this.props.url);
    }
  }, {
    key: '_invalidURL',
    value: function _invalidURL() {
      return react.createElement(
        'div',
        { className: 'alert alert-danger', role: 'alert' },
        react.createElement(
          'b',
          null,
          'Oh snap!'
        ),
        ' Invalid URL ',
        this.props.url
      );
    }
  }]);
  return DiffContainer;
}(react.Component);


DiffContainer.propTypes = {
  url: propTypes.string.isRequired,
  timestampA: propTypes.string,
  timestampB: propTypes.string,
  conf: propTypes.object.isRequired,
  loader: propTypes.element,
  fetchCDXCallback: propTypes.func,
  fetchSnapshotCallback: propTypes.func,

  noTimestamps: function noTimestamps(props, propName, componentName) {
    if (props.noTimestamps && !props.noTimestamps.isPrototypeOf(Boolean)) {
      return new Error('noTimestamps specified in \'' + componentName + ' should be boolean\'.');
    } else if (!(props.noTimestamps in window || props.timestampA in window || props.timestampB in window)) {
      return new Error('At least one of props \'timestampA\' or \'timestampB\' or noTimestamps must be specified in \'' + componentName + '\'.');
    }
  }
};

function constant(x) {
  return function() {
    return x;
  };
}

function x$1(d) {
  return d[0];
}

function y$1(d) {
  return d[1];
}

function RedBlackTree() {
  this._ = null; // root node
}

function RedBlackNode(node) {
  node.U = // parent node
  node.C = // color - true for red, false for black
  node.L = // left node
  node.R = // right node
  node.P = // previous node
  node.N = null; // next node
}

RedBlackTree.prototype = {
  constructor: RedBlackTree,

  insert: function(after, node) {
    var parent, grandpa, uncle;

    if (after) {
      node.P = after;
      node.N = after.N;
      if (after.N) after.N.P = node;
      after.N = node;
      if (after.R) {
        after = after.R;
        while (after.L) after = after.L;
        after.L = node;
      } else {
        after.R = node;
      }
      parent = after;
    } else if (this._) {
      after = RedBlackFirst(this._);
      node.P = null;
      node.N = after;
      after.P = after.L = node;
      parent = after;
    } else {
      node.P = node.N = null;
      this._ = node;
      parent = null;
    }
    node.L = node.R = null;
    node.U = parent;
    node.C = true;

    after = node;
    while (parent && parent.C) {
      grandpa = parent.U;
      if (parent === grandpa.L) {
        uncle = grandpa.R;
        if (uncle && uncle.C) {
          parent.C = uncle.C = false;
          grandpa.C = true;
          after = grandpa;
        } else {
          if (after === parent.R) {
            RedBlackRotateLeft(this, parent);
            after = parent;
            parent = after.U;
          }
          parent.C = false;
          grandpa.C = true;
          RedBlackRotateRight(this, grandpa);
        }
      } else {
        uncle = grandpa.L;
        if (uncle && uncle.C) {
          parent.C = uncle.C = false;
          grandpa.C = true;
          after = grandpa;
        } else {
          if (after === parent.L) {
            RedBlackRotateRight(this, parent);
            after = parent;
            parent = after.U;
          }
          parent.C = false;
          grandpa.C = true;
          RedBlackRotateLeft(this, grandpa);
        }
      }
      parent = after.U;
    }
    this._.C = false;
  },

  remove: function(node) {
    if (node.N) node.N.P = node.P;
    if (node.P) node.P.N = node.N;
    node.N = node.P = null;

    var parent = node.U,
        sibling,
        left = node.L,
        right = node.R,
        next,
        red;

    if (!left) next = right;
    else if (!right) next = left;
    else next = RedBlackFirst(right);

    if (parent) {
      if (parent.L === node) parent.L = next;
      else parent.R = next;
    } else {
      this._ = next;
    }

    if (left && right) {
      red = next.C;
      next.C = node.C;
      next.L = left;
      left.U = next;
      if (next !== right) {
        parent = next.U;
        next.U = node.U;
        node = next.R;
        parent.L = node;
        next.R = right;
        right.U = next;
      } else {
        next.U = parent;
        parent = next;
        node = next.R;
      }
    } else {
      red = node.C;
      node = next;
    }

    if (node) node.U = parent;
    if (red) return;
    if (node && node.C) { node.C = false; return; }

    do {
      if (node === this._) break;
      if (node === parent.L) {
        sibling = parent.R;
        if (sibling.C) {
          sibling.C = false;
          parent.C = true;
          RedBlackRotateLeft(this, parent);
          sibling = parent.R;
        }
        if ((sibling.L && sibling.L.C)
            || (sibling.R && sibling.R.C)) {
          if (!sibling.R || !sibling.R.C) {
            sibling.L.C = false;
            sibling.C = true;
            RedBlackRotateRight(this, sibling);
            sibling = parent.R;
          }
          sibling.C = parent.C;
          parent.C = sibling.R.C = false;
          RedBlackRotateLeft(this, parent);
          node = this._;
          break;
        }
      } else {
        sibling = parent.L;
        if (sibling.C) {
          sibling.C = false;
          parent.C = true;
          RedBlackRotateRight(this, parent);
          sibling = parent.L;
        }
        if ((sibling.L && sibling.L.C)
          || (sibling.R && sibling.R.C)) {
          if (!sibling.L || !sibling.L.C) {
            sibling.R.C = false;
            sibling.C = true;
            RedBlackRotateLeft(this, sibling);
            sibling = parent.L;
          }
          sibling.C = parent.C;
          parent.C = sibling.L.C = false;
          RedBlackRotateRight(this, parent);
          node = this._;
          break;
        }
      }
      sibling.C = true;
      node = parent;
      parent = parent.U;
    } while (!node.C);

    if (node) node.C = false;
  }
};

function RedBlackRotateLeft(tree, node) {
  var p = node,
      q = node.R,
      parent = p.U;

  if (parent) {
    if (parent.L === p) parent.L = q;
    else parent.R = q;
  } else {
    tree._ = q;
  }

  q.U = parent;
  p.U = q;
  p.R = q.L;
  if (p.R) p.R.U = p;
  q.L = p;
}

function RedBlackRotateRight(tree, node) {
  var p = node,
      q = node.L,
      parent = p.U;

  if (parent) {
    if (parent.L === p) parent.L = q;
    else parent.R = q;
  } else {
    tree._ = q;
  }

  q.U = parent;
  p.U = q;
  p.L = q.R;
  if (p.L) p.L.U = p;
  q.R = p;
}

function RedBlackFirst(node) {
  while (node.L) node = node.L;
  return node;
}

function createEdge(left, right, v0, v1) {
  var edge = [null, null],
      index = edges.push(edge) - 1;
  edge.left = left;
  edge.right = right;
  if (v0) setEdgeEnd(edge, left, right, v0);
  if (v1) setEdgeEnd(edge, right, left, v1);
  cells[left.index].halfedges.push(index);
  cells[right.index].halfedges.push(index);
  return edge;
}

function createBorderEdge(left, v0, v1) {
  var edge = [v0, v1];
  edge.left = left;
  return edge;
}

function setEdgeEnd(edge, left, right, vertex) {
  if (!edge[0] && !edge[1]) {
    edge[0] = vertex;
    edge.left = left;
    edge.right = right;
  } else if (edge.left === right) {
    edge[1] = vertex;
  } else {
    edge[0] = vertex;
  }
}

// Liang–Barsky line clipping.
function clipEdge(edge, x0, y0, x1, y1) {
  var a = edge[0],
      b = edge[1],
      ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      t0 = 0,
      t1 = 1,
      dx = bx - ax,
      dy = by - ay,
      r;

  r = x0 - ax;
  if (!dx && r > 0) return;
  r /= dx;
  if (dx < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dx > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = x1 - ax;
  if (!dx && r < 0) return;
  r /= dx;
  if (dx < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dx > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  r = y0 - ay;
  if (!dy && r > 0) return;
  r /= dy;
  if (dy < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dy > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = y1 - ay;
  if (!dy && r < 0) return;
  r /= dy;
  if (dy < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dy > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  if (!(t0 > 0) && !(t1 < 1)) return true; // TODO Better check?

  if (t0 > 0) edge[0] = [ax + t0 * dx, ay + t0 * dy];
  if (t1 < 1) edge[1] = [ax + t1 * dx, ay + t1 * dy];
  return true;
}

function connectEdge(edge, x0, y0, x1, y1) {
  var v1 = edge[1];
  if (v1) return true;

  var v0 = edge[0],
      left = edge.left,
      right = edge.right,
      lx = left[0],
      ly = left[1],
      rx = right[0],
      ry = right[1],
      fx = (lx + rx) / 2,
      fy = (ly + ry) / 2,
      fm,
      fb;

  if (ry === ly) {
    if (fx < x0 || fx >= x1) return;
    if (lx > rx) {
      if (!v0) v0 = [fx, y0];
      else if (v0[1] >= y1) return;
      v1 = [fx, y1];
    } else {
      if (!v0) v0 = [fx, y1];
      else if (v0[1] < y0) return;
      v1 = [fx, y0];
    }
  } else {
    fm = (lx - rx) / (ry - ly);
    fb = fy - fm * fx;
    if (fm < -1 || fm > 1) {
      if (lx > rx) {
        if (!v0) v0 = [(y0 - fb) / fm, y0];
        else if (v0[1] >= y1) return;
        v1 = [(y1 - fb) / fm, y1];
      } else {
        if (!v0) v0 = [(y1 - fb) / fm, y1];
        else if (v0[1] < y0) return;
        v1 = [(y0 - fb) / fm, y0];
      }
    } else {
      if (ly < ry) {
        if (!v0) v0 = [x0, fm * x0 + fb];
        else if (v0[0] >= x1) return;
        v1 = [x1, fm * x1 + fb];
      } else {
        if (!v0) v0 = [x1, fm * x1 + fb];
        else if (v0[0] < x0) return;
        v1 = [x0, fm * x0 + fb];
      }
    }
  }

  edge[0] = v0;
  edge[1] = v1;
  return true;
}

function clipEdges(x0, y0, x1, y1) {
  var i = edges.length,
      edge;

  while (i--) {
    if (!connectEdge(edge = edges[i], x0, y0, x1, y1)
        || !clipEdge(edge, x0, y0, x1, y1)
        || !(Math.abs(edge[0][0] - edge[1][0]) > epsilon
            || Math.abs(edge[0][1] - edge[1][1]) > epsilon)) {
      delete edges[i];
    }
  }
}

function createCell(site) {
  return cells[site.index] = {
    site: site,
    halfedges: []
  };
}

function cellHalfedgeAngle(cell, edge) {
  var site = cell.site,
      va = edge.left,
      vb = edge.right;
  if (site === vb) vb = va, va = site;
  if (vb) return Math.atan2(vb[1] - va[1], vb[0] - va[0]);
  if (site === va) va = edge[1], vb = edge[0];
  else va = edge[0], vb = edge[1];
  return Math.atan2(va[0] - vb[0], vb[1] - va[1]);
}

function cellHalfedgeStart(cell, edge) {
  return edge[+(edge.left !== cell.site)];
}

function cellHalfedgeEnd(cell, edge) {
  return edge[+(edge.left === cell.site)];
}

function sortCellHalfedges() {
  for (var i = 0, n = cells.length, cell, halfedges, j, m; i < n; ++i) {
    if ((cell = cells[i]) && (m = (halfedges = cell.halfedges).length)) {
      var index = new Array(m),
          array = new Array(m);
      for (j = 0; j < m; ++j) index[j] = j, array[j] = cellHalfedgeAngle(cell, edges[halfedges[j]]);
      index.sort(function(i, j) { return array[j] - array[i]; });
      for (j = 0; j < m; ++j) array[j] = halfedges[index[j]];
      for (j = 0; j < m; ++j) halfedges[j] = array[j];
    }
  }
}

function clipCells(x0, y0, x1, y1) {
  var nCells = cells.length,
      iCell,
      cell,
      site,
      iHalfedge,
      halfedges,
      nHalfedges,
      start,
      startX,
      startY,
      end,
      endX,
      endY,
      cover = true;

  for (iCell = 0; iCell < nCells; ++iCell) {
    if (cell = cells[iCell]) {
      site = cell.site;
      halfedges = cell.halfedges;
      iHalfedge = halfedges.length;

      // Remove any dangling clipped edges.
      while (iHalfedge--) {
        if (!edges[halfedges[iHalfedge]]) {
          halfedges.splice(iHalfedge, 1);
        }
      }

      // Insert any border edges as necessary.
      iHalfedge = 0, nHalfedges = halfedges.length;
      while (iHalfedge < nHalfedges) {
        end = cellHalfedgeEnd(cell, edges[halfedges[iHalfedge]]), endX = end[0], endY = end[1];
        start = cellHalfedgeStart(cell, edges[halfedges[++iHalfedge % nHalfedges]]), startX = start[0], startY = start[1];
        if (Math.abs(endX - startX) > epsilon || Math.abs(endY - startY) > epsilon) {
          halfedges.splice(iHalfedge, 0, edges.push(createBorderEdge(site, end,
              Math.abs(endX - x0) < epsilon && y1 - endY > epsilon ? [x0, Math.abs(startX - x0) < epsilon ? startY : y1]
              : Math.abs(endY - y1) < epsilon && x1 - endX > epsilon ? [Math.abs(startY - y1) < epsilon ? startX : x1, y1]
              : Math.abs(endX - x1) < epsilon && endY - y0 > epsilon ? [x1, Math.abs(startX - x1) < epsilon ? startY : y0]
              : Math.abs(endY - y0) < epsilon && endX - x0 > epsilon ? [Math.abs(startY - y0) < epsilon ? startX : x0, y0]
              : null)) - 1);
          ++nHalfedges;
        }
      }

      if (nHalfedges) cover = false;
    }
  }

  // If there weren’t any edges, have the closest site cover the extent.
  // It doesn’t matter which corner of the extent we measure!
  if (cover) {
    var dx, dy, d2, dc = Infinity;

    for (iCell = 0, cover = null; iCell < nCells; ++iCell) {
      if (cell = cells[iCell]) {
        site = cell.site;
        dx = site[0] - x0;
        dy = site[1] - y0;
        d2 = dx * dx + dy * dy;
        if (d2 < dc) dc = d2, cover = cell;
      }
    }

    if (cover) {
      var v00 = [x0, y0], v01 = [x0, y1], v11 = [x1, y1], v10 = [x1, y0];
      cover.halfedges.push(
        edges.push(createBorderEdge(site = cover.site, v00, v01)) - 1,
        edges.push(createBorderEdge(site, v01, v11)) - 1,
        edges.push(createBorderEdge(site, v11, v10)) - 1,
        edges.push(createBorderEdge(site, v10, v00)) - 1
      );
    }
  }

  // Lastly delete any cells with no edges; these were entirely clipped.
  for (iCell = 0; iCell < nCells; ++iCell) {
    if (cell = cells[iCell]) {
      if (!cell.halfedges.length) {
        delete cells[iCell];
      }
    }
  }
}

var circlePool = [];

var firstCircle;

function Circle() {
  RedBlackNode(this);
  this.x =
  this.y =
  this.arc =
  this.site =
  this.cy = null;
}

function attachCircle(arc) {
  var lArc = arc.P,
      rArc = arc.N;

  if (!lArc || !rArc) return;

  var lSite = lArc.site,
      cSite = arc.site,
      rSite = rArc.site;

  if (lSite === rSite) return;

  var bx = cSite[0],
      by = cSite[1],
      ax = lSite[0] - bx,
      ay = lSite[1] - by,
      cx = rSite[0] - bx,
      cy = rSite[1] - by;

  var d = 2 * (ax * cy - ay * cx);
  if (d >= -epsilon2) return;

  var ha = ax * ax + ay * ay,
      hc = cx * cx + cy * cy,
      x = (cy * ha - ay * hc) / d,
      y = (ax * hc - cx * ha) / d;

  var circle = circlePool.pop() || new Circle;
  circle.arc = arc;
  circle.site = cSite;
  circle.x = x + bx;
  circle.y = (circle.cy = y + by) + Math.sqrt(x * x + y * y); // y bottom

  arc.circle = circle;

  var before = null,
      node = circles._;

  while (node) {
    if (circle.y < node.y || (circle.y === node.y && circle.x <= node.x)) {
      if (node.L) node = node.L;
      else { before = node.P; break; }
    } else {
      if (node.R) node = node.R;
      else { before = node; break; }
    }
  }

  circles.insert(before, circle);
  if (!before) firstCircle = circle;
}

function detachCircle(arc) {
  var circle = arc.circle;
  if (circle) {
    if (!circle.P) firstCircle = circle.N;
    circles.remove(circle);
    circlePool.push(circle);
    RedBlackNode(circle);
    arc.circle = null;
  }
}

var beachPool = [];

function Beach() {
  RedBlackNode(this);
  this.edge =
  this.site =
  this.circle = null;
}

function createBeach(site) {
  var beach = beachPool.pop() || new Beach;
  beach.site = site;
  return beach;
}

function detachBeach(beach) {
  detachCircle(beach);
  beaches.remove(beach);
  beachPool.push(beach);
  RedBlackNode(beach);
}

function removeBeach(beach) {
  var circle = beach.circle,
      x = circle.x,
      y = circle.cy,
      vertex = [x, y],
      previous = beach.P,
      next = beach.N,
      disappearing = [beach];

  detachBeach(beach);

  var lArc = previous;
  while (lArc.circle
      && Math.abs(x - lArc.circle.x) < epsilon
      && Math.abs(y - lArc.circle.cy) < epsilon) {
    previous = lArc.P;
    disappearing.unshift(lArc);
    detachBeach(lArc);
    lArc = previous;
  }

  disappearing.unshift(lArc);
  detachCircle(lArc);

  var rArc = next;
  while (rArc.circle
      && Math.abs(x - rArc.circle.x) < epsilon
      && Math.abs(y - rArc.circle.cy) < epsilon) {
    next = rArc.N;
    disappearing.push(rArc);
    detachBeach(rArc);
    rArc = next;
  }

  disappearing.push(rArc);
  detachCircle(rArc);

  var nArcs = disappearing.length,
      iArc;
  for (iArc = 1; iArc < nArcs; ++iArc) {
    rArc = disappearing[iArc];
    lArc = disappearing[iArc - 1];
    setEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
  }

  lArc = disappearing[0];
  rArc = disappearing[nArcs - 1];
  rArc.edge = createEdge(lArc.site, rArc.site, null, vertex);

  attachCircle(lArc);
  attachCircle(rArc);
}

function addBeach(site) {
  var x = site[0],
      directrix = site[1],
      lArc,
      rArc,
      dxl,
      dxr,
      node = beaches._;

  while (node) {
    dxl = leftBreakPoint(node, directrix) - x;
    if (dxl > epsilon) node = node.L; else {
      dxr = x - rightBreakPoint(node, directrix);
      if (dxr > epsilon) {
        if (!node.R) {
          lArc = node;
          break;
        }
        node = node.R;
      } else {
        if (dxl > -epsilon) {
          lArc = node.P;
          rArc = node;
        } else if (dxr > -epsilon) {
          lArc = node;
          rArc = node.N;
        } else {
          lArc = rArc = node;
        }
        break;
      }
    }
  }

  createCell(site);
  var newArc = createBeach(site);
  beaches.insert(lArc, newArc);

  if (!lArc && !rArc) return;

  if (lArc === rArc) {
    detachCircle(lArc);
    rArc = createBeach(lArc.site);
    beaches.insert(newArc, rArc);
    newArc.edge = rArc.edge = createEdge(lArc.site, newArc.site);
    attachCircle(lArc);
    attachCircle(rArc);
    return;
  }

  if (!rArc) { // && lArc
    newArc.edge = createEdge(lArc.site, newArc.site);
    return;
  }

  // else lArc !== rArc
  detachCircle(lArc);
  detachCircle(rArc);

  var lSite = lArc.site,
      ax = lSite[0],
      ay = lSite[1],
      bx = site[0] - ax,
      by = site[1] - ay,
      rSite = rArc.site,
      cx = rSite[0] - ax,
      cy = rSite[1] - ay,
      d = 2 * (bx * cy - by * cx),
      hb = bx * bx + by * by,
      hc = cx * cx + cy * cy,
      vertex = [(cy * hb - by * hc) / d + ax, (bx * hc - cx * hb) / d + ay];

  setEdgeEnd(rArc.edge, lSite, rSite, vertex);
  newArc.edge = createEdge(lSite, site, null, vertex);
  rArc.edge = createEdge(site, rSite, null, vertex);
  attachCircle(lArc);
  attachCircle(rArc);
}

function leftBreakPoint(arc, directrix) {
  var site = arc.site,
      rfocx = site[0],
      rfocy = site[1],
      pby2 = rfocy - directrix;

  if (!pby2) return rfocx;

  var lArc = arc.P;
  if (!lArc) return -Infinity;

  site = lArc.site;
  var lfocx = site[0],
      lfocy = site[1],
      plby2 = lfocy - directrix;

  if (!plby2) return lfocx;

  var hl = lfocx - rfocx,
      aby2 = 1 / pby2 - 1 / plby2,
      b = hl / plby2;

  if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;

  return (rfocx + lfocx) / 2;
}

function rightBreakPoint(arc, directrix) {
  var rArc = arc.N;
  if (rArc) return leftBreakPoint(rArc, directrix);
  var site = arc.site;
  return site[1] === directrix ? site[0] : Infinity;
}

var epsilon = 1e-6;
var epsilon2 = 1e-12;
var beaches;
var cells;
var circles;
var edges;

function triangleArea(a, b, c) {
  return (a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]);
}

function lexicographic(a, b) {
  return b[1] - a[1]
      || b[0] - a[0];
}

function Diagram(sites, extent) {
  var site = sites.sort(lexicographic).pop(),
      x,
      y,
      circle;

  edges = [];
  cells = new Array(sites.length);
  beaches = new RedBlackTree;
  circles = new RedBlackTree;

  while (true) {
    circle = firstCircle;
    if (site && (!circle || site[1] < circle.y || (site[1] === circle.y && site[0] < circle.x))) {
      if (site[0] !== x || site[1] !== y) {
        addBeach(site);
        x = site[0], y = site[1];
      }
      site = sites.pop();
    } else if (circle) {
      removeBeach(circle.arc);
    } else {
      break;
    }
  }

  sortCellHalfedges();

  if (extent) {
    var x0 = +extent[0][0],
        y0 = +extent[0][1],
        x1 = +extent[1][0],
        y1 = +extent[1][1];
    clipEdges(x0, y0, x1, y1);
    clipCells(x0, y0, x1, y1);
  }

  this.edges = edges;
  this.cells = cells;

  beaches =
  circles =
  edges =
  cells = null;
}

Diagram.prototype = {
  constructor: Diagram,

  polygons: function() {
    var edges = this.edges;

    return this.cells.map(function(cell) {
      var polygon = cell.halfedges.map(function(i) { return cellHalfedgeStart(cell, edges[i]); });
      polygon.data = cell.site.data;
      return polygon;
    });
  },

  triangles: function() {
    var triangles = [],
        edges = this.edges;

    this.cells.forEach(function(cell, i) {
      if (!(m = (halfedges = cell.halfedges).length)) return;
      var site = cell.site,
          halfedges,
          j = -1,
          m,
          s0,
          e1 = edges[halfedges[m - 1]],
          s1 = e1.left === site ? e1.right : e1.left;

      while (++j < m) {
        s0 = s1;
        e1 = edges[halfedges[j]];
        s1 = e1.left === site ? e1.right : e1.left;
        if (s0 && s1 && i < s0.index && i < s1.index && triangleArea(site, s0, s1) < 0) {
          triangles.push([site.data, s0.data, s1.data]);
        }
      }
    });

    return triangles;
  },

  links: function() {
    return this.edges.filter(function(edge) {
      return edge.right;
    }).map(function(edge) {
      return {
        source: edge.left.data,
        target: edge.right.data
      };
    });
  },

  find: function(x, y, radius) {
    var that = this, i0, i1 = that._found || 0, n = that.cells.length, cell;

    // Use the previously-found cell, or start with an arbitrary one.
    while (!(cell = that.cells[i1])) if (++i1 >= n) return null;
    var dx = x - cell.site[0], dy = y - cell.site[1], d2 = dx * dx + dy * dy;

    // Traverse the half-edges to find a closer cell, if any.
    do {
      cell = that.cells[i0 = i1], i1 = null;
      cell.halfedges.forEach(function(e) {
        var edge = that.edges[e], v = edge.left;
        if ((v === cell.site || !v) && !(v = edge.right)) return;
        var vx = x - v[0], vy = y - v[1], v2 = vx * vx + vy * vy;
        if (v2 < d2) d2 = v2, i1 = v.index;
      });
    } while (i1 !== null);

    that._found = i0;

    return radius == null || d2 <= radius * radius ? cell.site : null;
  }
};

function voronoi() {
  var x$$1 = x$1,
      y$$1 = y$1,
      extent = null;

  function voronoi(data) {
    return new Diagram(data.map(function(d, i) {
      var s = [Math.round(x$$1(d, i, data) / epsilon) * epsilon, Math.round(y$$1(d, i, data) / epsilon) * epsilon];
      s.index = i;
      s.data = d;
      return s;
    }), extent);
  }

  voronoi.polygons = function(data) {
    return voronoi(data).polygons();
  };

  voronoi.links = function(data) {
    return voronoi(data).links();
  };

  voronoi.triangles = function(data) {
    return voronoi(data).triangles();
  };

  voronoi.x = function(_) {
    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant(+_), voronoi) : x$$1;
  };

  voronoi.y = function(_) {
    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant(+_), voronoi) : y$$1;
  };

  voronoi.extent = function(_) {
    return arguments.length ? (extent = _ == null ? null : [[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]], voronoi) : extent && [[extent[0][0], extent[0][1]], [extent[1][0], extent[1][1]]];
  };

  voronoi.size = function(_) {
    return arguments.length ? (extent = _ == null ? null : [[0, 0], [+_[0], +_[1]]], voronoi) : extent && [extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]];
  };

  return voronoi;
}

function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex3 = /^#([0-9a-f]{3})$/,
    reHex6 = /^#([0-9a-f]{6})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: function() {
    return this.rgb().hex();
  },
  toString: function() {
    return this.rgb() + "";
  }
});

function color(format) {
  var m;
  format = (format + "").trim().toLowerCase();
  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
      : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format])
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return (0 <= this.r && this.r <= 255)
        && (0 <= this.g && this.g <= 255)
        && (0 <= this.b && this.b <= 255)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: function() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  },
  toString: function() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(")
        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
        + (a === 1 ? ")" : ", " + a + ")");
  }
}));

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

var deg2rad = Math.PI / 180;
var rad2deg = 180 / Math.PI;

// https://beta.observablehq.com/@mbostock/lab-and-rgb
var K$1 = 18,
    Xn = 0.96422,
    Yn = 1,
    Zn = 0.82521,
    t0 = 4 / 29,
    t1 = 6 / 29,
    t2 = 3 * t1 * t1,
    t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) {
    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
    var h = o.h * deg2rad;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = rgb2lrgb(o.r),
      g = rgb2lrgb(o.g),
      b = rgb2lrgb(o.b),
      y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
  if (r === g && g === b) x = z = y; else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

define(Lab, lab, extend(Color, {
  brighter: function(k) {
    return new Lab(this.l + K$1 * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function(k) {
    return new Lab(this.l - K$1 * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new Rgb(
      lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
      lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
      lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
      this.opacity
    );
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function lrgb2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0, o.l, o.opacity);
  var h = Math.atan2(o.b, o.a) * rad2deg;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hcl, hcl, extend(Color, {
  brighter: function(k) {
    return new Hcl(this.h, this.c, this.l + K$1 * (k == null ? 1 : k), this.opacity);
  },
  darker: function(k) {
    return new Hcl(this.h, this.c, this.l - K$1 * (k == null ? 1 : k), this.opacity);
  },
  rgb: function() {
    return labConvert(this).rgb();
  }
}));

var A$1 = -0.14861,
    B$1 = +1.78277,
    C$1 = -0.29227,
    D$1 = -0.90649,
    E$1 = +1.97294,
    ED = E$1 * D$1,
    EB = E$1 * B$1,
    BC_DA = B$1 * C$1 - D$1 * A$1;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E$1 * (g - l) - C$1 * bl) / D$1,
      s = Math.sqrt(k * k + bl * bl) / (E$1 * l * (1 - l)), // NaN if l=0 or l=1
      h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Cubehelix, cubehelix, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(
      255 * (l + a * (A$1 * cosh + B$1 * sinh)),
      255 * (l + a * (C$1 * cosh + D$1 * sinh)),
      255 * (l + a * (E$1 * cosh)),
      this.opacity
    );
  }
}));

function constant$1(x) {
  return function() {
    return x;
  };
}

function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$1(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
}

var rgb$1 = (function rgbGamma(y) {
  var color$$1 = gamma(y);

  function rgb$$1(start, end) {
    var r = color$$1((start = rgb(start)).r, (end = rgb(end)).r),
        g = color$$1(start.g, end.g),
        b = color$$1(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$$1.gamma = rgbGamma;

  return rgb$$1;
})(1);

function array(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];

  return function(t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);
    return c;
  };
}

function date(a, b) {
  var d = new Date;
  return a = +a, b -= a, function(t) {
    return d.setTime(a + b * t), d;
  };
}

function reinterpolate(a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t;
  };
}

function object(a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = interpolateValue(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

function string(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: reinterpolate(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

function interpolateValue(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant$1(b)
      : (t === "number" ? reinterpolate
      : t === "string" ? ((c = color(b)) ? (b = c, rgb$1) : string)
      : b instanceof color ? rgb$1
      : b instanceof Date ? date
      : Array.isArray(b) ? array
      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
      : reinterpolate)(a, b);
}

function interpolateRound(a, b) {
  return a = +a, b -= a, function(t) {
    return Math.round(a + b * t);
  };
}

var degrees = 180 / Math.PI;

var rho = Math.SQRT2;

function cubehelix$1(hue$$1) {
  return (function cubehelixGamma(y) {
    y = +y;

    function cubehelix$$1(start, end) {
      var h = hue$$1((start = cubehelix(start)).h, (end = cubehelix(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix$$1.gamma = cubehelixGamma;

    return cubehelix$$1;
  })(1);
}

cubehelix$1(hue);
var cubehelixLong = cubehelix$1(nogamma);

var mapToZero_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports['default'] = mapToZero;

function mapToZero(obj) {
  var ret = {};
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      ret[key] = 0;
    }
  }
  return ret;
}

module.exports = exports['default'];
});

unwrapExports(mapToZero_1);

var stripStyle_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports['default'] = stripStyle;

function stripStyle(style) {
  var ret = {};
  for (var key in style) {
    if (!Object.prototype.hasOwnProperty.call(style, key)) {
      continue;
    }
    ret[key] = typeof style[key] === 'number' ? style[key] : style[key].val;
  }
  return ret;
}

module.exports = exports['default'];
});

unwrapExports(stripStyle_1);

var stepper_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports["default"] = stepper;

var reusedTuple = [0, 0];

function stepper(secondPerFrame, x, v, destX, k, b, precision) {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  var Fspring = -k * (x - destX);

  // Damping, in kg / s
  var Fdamper = -b * v;

  // usually we put mass here, but for animation purposes, specifying mass is a
  // bit redundant. you could simply adjust k and b accordingly
  // let a = (Fspring + Fdamper) / mass;
  var a = Fspring + Fdamper;

  var newV = v + a * secondPerFrame;
  var newX = x + newV * secondPerFrame;

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {
    reusedTuple[0] = destX;
    reusedTuple[1] = 0;
    return reusedTuple;
  }

  reusedTuple[0] = newX;
  reusedTuple[1] = newV;
  return reusedTuple;
}

module.exports = exports["default"];
// array reference around.
});

unwrapExports(stepper_1);

var performanceNow$1 = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime$$1, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime$$1 = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime$$1();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(commonjsGlobal);
});

var performanceNow$2 = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime$$1, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime$$1 = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime$$1();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(commonjsGlobal);


});

var root = typeof window === 'undefined' ? commonjsGlobal : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix];

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix];
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix];
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue$1 = []
    , frameDuration = 1000 / 60;

  raf = function(callback) {
    if(queue$1.length === 0) {
      var _now = performanceNow$2()
        , next = Math.max(0, frameDuration - (_now - last));
      last = next + _now;
      setTimeout(function() {
        var cp = queue$1.slice(0);
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue$1.length = 0;
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last);
            } catch(e) {
              setTimeout(function() { throw e }, 0);
            }
          }
        }
      }, Math.round(next));
    }
    queue$1.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    });
    return id
  };

  caf = function(handle) {
    for(var i = 0; i < queue$1.length; i++) {
      if(queue$1[i].handle === handle) {
        queue$1[i].cancelled = true;
      }
    }
  };
}

var raf_1 = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
};
var cancel = function() {
  caf.apply(root, arguments);
};
var polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf;
  object.cancelAnimationFrame = caf;
};
raf_1.cancel = cancel;
raf_1.polyfill = polyfill;

var shouldStopAnimation_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports['default'] = shouldStopAnimation;

function shouldStopAnimation(currentStyle, style, currentVelocity) {
  for (var key in style) {
    if (!Object.prototype.hasOwnProperty.call(style, key)) {
      continue;
    }

    if (currentVelocity[key] !== 0) {
      return false;
    }

    var styleValue = typeof style[key] === 'number' ? style[key] : style[key].val;
    // stepper will have already taken care of rounding precision errors, so
    // won't have such thing as 0.9999 !=== 1
    if (currentStyle[key] !== styleValue) {
      return false;
    }
  }

  return true;
}

module.exports = exports['default'];
});

unwrapExports(shouldStopAnimation_1);

var Motion_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var _mapToZero2 = _interopRequireDefault(mapToZero_1);



var _stripStyle2 = _interopRequireDefault(stripStyle_1);



var _stepper4 = _interopRequireDefault(stepper_1);



var _performanceNow2 = _interopRequireDefault(performanceNow$1);



var _raf2 = _interopRequireDefault(raf_1);



var _shouldStopAnimation2 = _interopRequireDefault(shouldStopAnimation_1);



var _react2 = _interopRequireDefault(react);



var _propTypes2 = _interopRequireDefault(propTypes);

var msPerFrame = 1000 / 60;

var Motion = (function (_React$Component) {
  _inherits(Motion, _React$Component);

  _createClass(Motion, null, [{
    key: 'propTypes',
    value: {
      // TOOD: warn against putting a config in here
      defaultStyle: _propTypes2['default'].objectOf(_propTypes2['default'].number),
      style: _propTypes2['default'].objectOf(_propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].object])).isRequired,
      children: _propTypes2['default'].func.isRequired,
      onRest: _propTypes2['default'].func
    },
    enumerable: true
  }]);

  function Motion(props) {
    var _this = this;

    _classCallCheck(this, Motion);

    _React$Component.call(this, props);
    this.wasAnimating = false;
    this.animationID = null;
    this.prevTime = 0;
    this.accumulatedTime = 0;
    this.unreadPropStyle = null;

    this.clearUnreadPropStyle = function (destStyle) {
      var dirty = false;
      var _state = _this.state;
      var currentStyle = _state.currentStyle;
      var currentVelocity = _state.currentVelocity;
      var lastIdealStyle = _state.lastIdealStyle;
      var lastIdealVelocity = _state.lastIdealVelocity;

      for (var key in destStyle) {
        if (!Object.prototype.hasOwnProperty.call(destStyle, key)) {
          continue;
        }

        var styleValue = destStyle[key];
        if (typeof styleValue === 'number') {
          if (!dirty) {
            dirty = true;
            currentStyle = _extends({}, currentStyle);
            currentVelocity = _extends({}, currentVelocity);
            lastIdealStyle = _extends({}, lastIdealStyle);
            lastIdealVelocity = _extends({}, lastIdealVelocity);
          }

          currentStyle[key] = styleValue;
          currentVelocity[key] = 0;
          lastIdealStyle[key] = styleValue;
          lastIdealVelocity[key] = 0;
        }
      }

      if (dirty) {
        _this.setState({ currentStyle: currentStyle, currentVelocity: currentVelocity, lastIdealStyle: lastIdealStyle, lastIdealVelocity: lastIdealVelocity });
      }
    };

    this.startAnimationIfNecessary = function () {
      // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
      // call cb? No, otherwise accidental parent rerender causes cb trigger
      _this.animationID = _raf2['default'](function (timestamp) {
        // check if we need to animate in the first place
        var propsStyle = _this.props.style;
        if (_shouldStopAnimation2['default'](_this.state.currentStyle, propsStyle, _this.state.currentVelocity)) {
          if (_this.wasAnimating && _this.props.onRest) {
            _this.props.onRest();
          }

          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.wasAnimating = false;
          _this.accumulatedTime = 0;
          return;
        }

        _this.wasAnimating = true;

        var currentTime = timestamp || _performanceNow2['default']();
        var timeDelta = currentTime - _this.prevTime;
        _this.prevTime = currentTime;
        _this.accumulatedTime = _this.accumulatedTime + timeDelta;
        // more than 10 frames? prolly switched browser tab. Restart
        if (_this.accumulatedTime > msPerFrame * 10) {
          _this.accumulatedTime = 0;
        }

        if (_this.accumulatedTime === 0) {
          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.startAnimationIfNecessary();
          return;
        }

        var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
        var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

        var newLastIdealStyle = {};
        var newLastIdealVelocity = {};
        var newCurrentStyle = {};
        var newCurrentVelocity = {};

        for (var key in propsStyle) {
          if (!Object.prototype.hasOwnProperty.call(propsStyle, key)) {
            continue;
          }

          var styleValue = propsStyle[key];
          if (typeof styleValue === 'number') {
            newCurrentStyle[key] = styleValue;
            newCurrentVelocity[key] = 0;
            newLastIdealStyle[key] = styleValue;
            newLastIdealVelocity[key] = 0;
          } else {
            var newLastIdealStyleValue = _this.state.lastIdealStyle[key];
            var newLastIdealVelocityValue = _this.state.lastIdealVelocity[key];
            for (var i = 0; i < framesToCatchUp; i++) {
              var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

              newLastIdealStyleValue = _stepper[0];
              newLastIdealVelocityValue = _stepper[1];
            }

            var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

            var nextIdealX = _stepper2[0];
            var nextIdealV = _stepper2[1];

            newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
            newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
            newLastIdealStyle[key] = newLastIdealStyleValue;
            newLastIdealVelocity[key] = newLastIdealVelocityValue;
          }
        }

        _this.animationID = null;
        // the amount we're looped over above
        _this.accumulatedTime -= framesToCatchUp * msPerFrame;

        _this.setState({
          currentStyle: newCurrentStyle,
          currentVelocity: newCurrentVelocity,
          lastIdealStyle: newLastIdealStyle,
          lastIdealVelocity: newLastIdealVelocity
        });

        _this.unreadPropStyle = null;

        _this.startAnimationIfNecessary();
      });
    };

    this.state = this.defaultState();
  }

  Motion.prototype.defaultState = function defaultState() {
    var _props = this.props;
    var defaultStyle = _props.defaultStyle;
    var style = _props.style;

    var currentStyle = defaultStyle || _stripStyle2['default'](style);
    var currentVelocity = _mapToZero2['default'](currentStyle);
    return {
      currentStyle: currentStyle,
      currentVelocity: currentVelocity,
      lastIdealStyle: currentStyle,
      lastIdealVelocity: currentVelocity
    };
  };

  // it's possible that currentStyle's value is stale: if props is immediately
  // changed from 0 to 400 to spring(0) again, the async currentStyle is still
  // at 0 (didn't have time to tick and interpolate even once). If we naively
  // compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
  // In reality currentStyle should be 400

  Motion.prototype.componentDidMount = function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  };

  Motion.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (this.unreadPropStyle != null) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyle);
    }

    this.unreadPropStyle = props.style;
    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  };

  Motion.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  };

  Motion.prototype.render = function render() {
    var renderedChildren = this.props.children(this.state.currentStyle);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  };

  return Motion;
})(_react2['default'].Component);

exports['default'] = Motion;
module.exports = exports['default'];

// after checking for unreadPropStyle != null, we manually go set the
// non-interpolating values (those that are a number, without a spring
// config)
});

unwrapExports(Motion_1);

var StaggeredMotion_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var _mapToZero2 = _interopRequireDefault(mapToZero_1);



var _stripStyle2 = _interopRequireDefault(stripStyle_1);



var _stepper4 = _interopRequireDefault(stepper_1);



var _performanceNow2 = _interopRequireDefault(performanceNow$1);



var _raf2 = _interopRequireDefault(raf_1);



var _shouldStopAnimation2 = _interopRequireDefault(shouldStopAnimation_1);



var _react2 = _interopRequireDefault(react);



var _propTypes2 = _interopRequireDefault(propTypes);

var msPerFrame = 1000 / 60;

function shouldStopAnimationAll(currentStyles, styles, currentVelocities) {
  for (var i = 0; i < currentStyles.length; i++) {
    if (!_shouldStopAnimation2['default'](currentStyles[i], styles[i], currentVelocities[i])) {
      return false;
    }
  }
  return true;
}

var StaggeredMotion = (function (_React$Component) {
  _inherits(StaggeredMotion, _React$Component);

  _createClass(StaggeredMotion, null, [{
    key: 'propTypes',
    value: {
      // TOOD: warn against putting a config in here
      defaultStyles: _propTypes2['default'].arrayOf(_propTypes2['default'].objectOf(_propTypes2['default'].number)),
      styles: _propTypes2['default'].func.isRequired,
      children: _propTypes2['default'].func.isRequired
    },
    enumerable: true
  }]);

  function StaggeredMotion(props) {
    var _this = this;

    _classCallCheck(this, StaggeredMotion);

    _React$Component.call(this, props);
    this.animationID = null;
    this.prevTime = 0;
    this.accumulatedTime = 0;
    this.unreadPropStyles = null;

    this.clearUnreadPropStyle = function (unreadPropStyles) {
      var _state = _this.state;
      var currentStyles = _state.currentStyles;
      var currentVelocities = _state.currentVelocities;
      var lastIdealStyles = _state.lastIdealStyles;
      var lastIdealVelocities = _state.lastIdealVelocities;

      var someDirty = false;
      for (var i = 0; i < unreadPropStyles.length; i++) {
        var unreadPropStyle = unreadPropStyles[i];
        var dirty = false;

        for (var key in unreadPropStyle) {
          if (!Object.prototype.hasOwnProperty.call(unreadPropStyle, key)) {
            continue;
          }

          var styleValue = unreadPropStyle[key];
          if (typeof styleValue === 'number') {
            if (!dirty) {
              dirty = true;
              someDirty = true;
              currentStyles[i] = _extends({}, currentStyles[i]);
              currentVelocities[i] = _extends({}, currentVelocities[i]);
              lastIdealStyles[i] = _extends({}, lastIdealStyles[i]);
              lastIdealVelocities[i] = _extends({}, lastIdealVelocities[i]);
            }
            currentStyles[i][key] = styleValue;
            currentVelocities[i][key] = 0;
            lastIdealStyles[i][key] = styleValue;
            lastIdealVelocities[i][key] = 0;
          }
        }
      }

      if (someDirty) {
        _this.setState({ currentStyles: currentStyles, currentVelocities: currentVelocities, lastIdealStyles: lastIdealStyles, lastIdealVelocities: lastIdealVelocities });
      }
    };

    this.startAnimationIfNecessary = function () {
      // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
      // call cb? No, otherwise accidental parent rerender causes cb trigger
      _this.animationID = _raf2['default'](function (timestamp) {
        var destStyles = _this.props.styles(_this.state.lastIdealStyles);

        // check if we need to animate in the first place
        if (shouldStopAnimationAll(_this.state.currentStyles, destStyles, _this.state.currentVelocities)) {
          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.accumulatedTime = 0;
          return;
        }

        var currentTime = timestamp || _performanceNow2['default']();
        var timeDelta = currentTime - _this.prevTime;
        _this.prevTime = currentTime;
        _this.accumulatedTime = _this.accumulatedTime + timeDelta;
        // more than 10 frames? prolly switched browser tab. Restart
        if (_this.accumulatedTime > msPerFrame * 10) {
          _this.accumulatedTime = 0;
        }

        if (_this.accumulatedTime === 0) {
          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.startAnimationIfNecessary();
          return;
        }

        var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
        var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

        var newLastIdealStyles = [];
        var newLastIdealVelocities = [];
        var newCurrentStyles = [];
        var newCurrentVelocities = [];

        for (var i = 0; i < destStyles.length; i++) {
          var destStyle = destStyles[i];
          var newCurrentStyle = {};
          var newCurrentVelocity = {};
          var newLastIdealStyle = {};
          var newLastIdealVelocity = {};

          for (var key in destStyle) {
            if (!Object.prototype.hasOwnProperty.call(destStyle, key)) {
              continue;
            }

            var styleValue = destStyle[key];
            if (typeof styleValue === 'number') {
              newCurrentStyle[key] = styleValue;
              newCurrentVelocity[key] = 0;
              newLastIdealStyle[key] = styleValue;
              newLastIdealVelocity[key] = 0;
            } else {
              var newLastIdealStyleValue = _this.state.lastIdealStyles[i][key];
              var newLastIdealVelocityValue = _this.state.lastIdealVelocities[i][key];
              for (var j = 0; j < framesToCatchUp; j++) {
                var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

                newLastIdealStyleValue = _stepper[0];
                newLastIdealVelocityValue = _stepper[1];
              }

              var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

              var nextIdealX = _stepper2[0];
              var nextIdealV = _stepper2[1];

              newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
              newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
              newLastIdealStyle[key] = newLastIdealStyleValue;
              newLastIdealVelocity[key] = newLastIdealVelocityValue;
            }
          }

          newCurrentStyles[i] = newCurrentStyle;
          newCurrentVelocities[i] = newCurrentVelocity;
          newLastIdealStyles[i] = newLastIdealStyle;
          newLastIdealVelocities[i] = newLastIdealVelocity;
        }

        _this.animationID = null;
        // the amount we're looped over above
        _this.accumulatedTime -= framesToCatchUp * msPerFrame;

        _this.setState({
          currentStyles: newCurrentStyles,
          currentVelocities: newCurrentVelocities,
          lastIdealStyles: newLastIdealStyles,
          lastIdealVelocities: newLastIdealVelocities
        });

        _this.unreadPropStyles = null;

        _this.startAnimationIfNecessary();
      });
    };

    this.state = this.defaultState();
  }

  StaggeredMotion.prototype.defaultState = function defaultState() {
    var _props = this.props;
    var defaultStyles = _props.defaultStyles;
    var styles = _props.styles;

    var currentStyles = defaultStyles || styles().map(_stripStyle2['default']);
    var currentVelocities = currentStyles.map(function (currentStyle) {
      return _mapToZero2['default'](currentStyle);
    });
    return {
      currentStyles: currentStyles,
      currentVelocities: currentVelocities,
      lastIdealStyles: currentStyles,
      lastIdealVelocities: currentVelocities
    };
  };

  StaggeredMotion.prototype.componentDidMount = function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  };

  StaggeredMotion.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (this.unreadPropStyles != null) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyles);
    }

    this.unreadPropStyles = props.styles(this.state.lastIdealStyles);
    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  };

  StaggeredMotion.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  };

  StaggeredMotion.prototype.render = function render() {
    var renderedChildren = this.props.children(this.state.currentStyles);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  };

  return StaggeredMotion;
})(_react2['default'].Component);

exports['default'] = StaggeredMotion;
module.exports = exports['default'];

// it's possible that currentStyle's value is stale: if props is immediately
// changed from 0 to 400 to spring(0) again, the async currentStyle is still
// at 0 (didn't have time to tick and interpolate even once). If we naively
// compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
// In reality currentStyle should be 400

// after checking for unreadPropStyles != null, we manually go set the
// non-interpolating values (those that are a number, without a spring
// config)
});

unwrapExports(StaggeredMotion_1);

var mergeDiff_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports['default'] = mergeDiff;

function mergeDiff(prev, next, onRemove) {
  // bookkeeping for easier access of a key's index below. This is 2 allocations +
  // potentially triggering chrome hash map mode for objs (so it might be faster

  var prevKeyIndex = {};
  for (var i = 0; i < prev.length; i++) {
    prevKeyIndex[prev[i].key] = i;
  }
  var nextKeyIndex = {};
  for (var i = 0; i < next.length; i++) {
    nextKeyIndex[next[i].key] = i;
  }

  // first, an overly elaborate way of merging prev and next, eliminating
  // duplicates (in terms of keys). If there's dupe, keep the item in next).
  // This way of writing it saves allocations
  var ret = [];
  for (var i = 0; i < next.length; i++) {
    ret[i] = next[i];
  }
  for (var i = 0; i < prev.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(nextKeyIndex, prev[i].key)) {
      // this is called my TM's `mergeAndSync`, which calls willLeave. We don't
      // merge in keys that the user desires to kill
      var fill = onRemove(i, prev[i]);
      if (fill != null) {
        ret.push(fill);
      }
    }
  }

  // now all the items all present. Core sorting logic to have the right order
  return ret.sort(function (a, b) {
    var nextOrderA = nextKeyIndex[a.key];
    var nextOrderB = nextKeyIndex[b.key];
    var prevOrderA = prevKeyIndex[a.key];
    var prevOrderB = prevKeyIndex[b.key];

    if (nextOrderA != null && nextOrderB != null) {
      // both keys in next
      return nextKeyIndex[a.key] - nextKeyIndex[b.key];
    } else if (prevOrderA != null && prevOrderB != null) {
      // both keys in prev
      return prevKeyIndex[a.key] - prevKeyIndex[b.key];
    } else if (nextOrderA != null) {
      // key a in next, key b in prev

      // how to determine the order between a and b? We find a "pivot" (term
      // abuse), a key present in both prev and next, that is sandwiched between
      // a and b. In the context of our above example, if we're comparing a and
      // d, b's (the only) pivot
      for (var i = 0; i < next.length; i++) {
        var pivot = next[i].key;
        if (!Object.prototype.hasOwnProperty.call(prevKeyIndex, pivot)) {
          continue;
        }

        if (nextOrderA < nextKeyIndex[pivot] && prevOrderB > prevKeyIndex[pivot]) {
          return -1;
        } else if (nextOrderA > nextKeyIndex[pivot] && prevOrderB < prevKeyIndex[pivot]) {
          return 1;
        }
      }
      // pluggable. default to: next bigger than prev
      return 1;
    }
    // prevOrderA, nextOrderB
    for (var i = 0; i < next.length; i++) {
      var pivot = next[i].key;
      if (!Object.prototype.hasOwnProperty.call(prevKeyIndex, pivot)) {
        continue;
      }
      if (nextOrderB < nextKeyIndex[pivot] && prevOrderA > prevKeyIndex[pivot]) {
        return 1;
      } else if (nextOrderB > nextKeyIndex[pivot] && prevOrderA < prevKeyIndex[pivot]) {
        return -1;
      }
    }
    // pluggable. default to: next bigger than prev
    return -1;
  });
}

module.exports = exports['default'];
// to loop through and find a key's index each time), but I no longer care
});

unwrapExports(mergeDiff_1);

var TransitionMotion_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var _mapToZero2 = _interopRequireDefault(mapToZero_1);



var _stripStyle2 = _interopRequireDefault(stripStyle_1);



var _stepper4 = _interopRequireDefault(stepper_1);



var _mergeDiff2 = _interopRequireDefault(mergeDiff_1);



var _performanceNow2 = _interopRequireDefault(performanceNow$1);



var _raf2 = _interopRequireDefault(raf_1);



var _shouldStopAnimation2 = _interopRequireDefault(shouldStopAnimation_1);



var _react2 = _interopRequireDefault(react);



var _propTypes2 = _interopRequireDefault(propTypes);

var msPerFrame = 1000 / 60;

// the children function & (potential) styles function asks as param an
// Array<TransitionPlainStyle>, where each TransitionPlainStyle is of the format
// {key: string, data?: any, style: PlainStyle}. However, the way we keep
// internal states doesn't contain such a data structure (check the state and
// TransitionMotionState). So when children function and others ask for such
// data we need to generate them on the fly by combining mergedPropsStyles and
// currentStyles/lastIdealStyles
function rehydrateStyles(mergedPropsStyles, unreadPropStyles, plainStyles) {
  // Copy the value to a `const` so that Flow understands that the const won't
  // change and will be non-nullable in the callback below.
  var cUnreadPropStyles = unreadPropStyles;
  if (cUnreadPropStyles == null) {
    return mergedPropsStyles.map(function (mergedPropsStyle, i) {
      return {
        key: mergedPropsStyle.key,
        data: mergedPropsStyle.data,
        style: plainStyles[i]
      };
    });
  }
  return mergedPropsStyles.map(function (mergedPropsStyle, i) {
    for (var j = 0; j < cUnreadPropStyles.length; j++) {
      if (cUnreadPropStyles[j].key === mergedPropsStyle.key) {
        return {
          key: cUnreadPropStyles[j].key,
          data: cUnreadPropStyles[j].data,
          style: plainStyles[i]
        };
      }
    }
    return { key: mergedPropsStyle.key, data: mergedPropsStyle.data, style: plainStyles[i] };
  });
}

function shouldStopAnimationAll(currentStyles, destStyles, currentVelocities, mergedPropsStyles) {
  if (mergedPropsStyles.length !== destStyles.length) {
    return false;
  }

  for (var i = 0; i < mergedPropsStyles.length; i++) {
    if (mergedPropsStyles[i].key !== destStyles[i].key) {
      return false;
    }
  }

  // we have the invariant that mergedPropsStyles and
  // currentStyles/currentVelocities/last* are synced in terms of cells, see
  // mergeAndSync comment for more info
  for (var i = 0; i < mergedPropsStyles.length; i++) {
    if (!_shouldStopAnimation2['default'](currentStyles[i], destStyles[i].style, currentVelocities[i])) {
      return false;
    }
  }

  return true;
}

// core key merging logic

// things to do: say previously merged style is {a, b}, dest style (prop) is {b,
// c}, previous current (interpolating) style is {a, b}
// **invariant**: current[i] corresponds to merged[i] in terms of key

// steps:
// turn merged style into {a?, b, c}
//    add c, value of c is destStyles.c
//    maybe remove a, aka call willLeave(a), then merged is either {b, c} or {a, b, c}
// turn current (interpolating) style from {a, b} into {a?, b, c}
//    maybe remove a
//    certainly add c, value of c is willEnter(c)
// loop over merged and construct new current
// dest doesn't change, that's owner's
function mergeAndSync(willEnter, willLeave, didLeave, oldMergedPropsStyles, destStyles, oldCurrentStyles, oldCurrentVelocities, oldLastIdealStyles, oldLastIdealVelocities) {
  var newMergedPropsStyles = _mergeDiff2['default'](oldMergedPropsStyles, destStyles, function (oldIndex, oldMergedPropsStyle) {
    var leavingStyle = willLeave(oldMergedPropsStyle);
    if (leavingStyle == null) {
      didLeave({ key: oldMergedPropsStyle.key, data: oldMergedPropsStyle.data });
      return null;
    }
    if (_shouldStopAnimation2['default'](oldCurrentStyles[oldIndex], leavingStyle, oldCurrentVelocities[oldIndex])) {
      didLeave({ key: oldMergedPropsStyle.key, data: oldMergedPropsStyle.data });
      return null;
    }
    return { key: oldMergedPropsStyle.key, data: oldMergedPropsStyle.data, style: leavingStyle };
  });

  var newCurrentStyles = [];
  var newCurrentVelocities = [];
  var newLastIdealStyles = [];
  var newLastIdealVelocities = [];
  for (var i = 0; i < newMergedPropsStyles.length; i++) {
    var newMergedPropsStyleCell = newMergedPropsStyles[i];
    var foundOldIndex = null;
    for (var j = 0; j < oldMergedPropsStyles.length; j++) {
      if (oldMergedPropsStyles[j].key === newMergedPropsStyleCell.key) {
        foundOldIndex = j;
        break;
      }
    }
    // TODO: key search code
    if (foundOldIndex == null) {
      var plainStyle = willEnter(newMergedPropsStyleCell);
      newCurrentStyles[i] = plainStyle;
      newLastIdealStyles[i] = plainStyle;

      var velocity = _mapToZero2['default'](newMergedPropsStyleCell.style);
      newCurrentVelocities[i] = velocity;
      newLastIdealVelocities[i] = velocity;
    } else {
      newCurrentStyles[i] = oldCurrentStyles[foundOldIndex];
      newLastIdealStyles[i] = oldLastIdealStyles[foundOldIndex];
      newCurrentVelocities[i] = oldCurrentVelocities[foundOldIndex];
      newLastIdealVelocities[i] = oldLastIdealVelocities[foundOldIndex];
    }
  }

  return [newMergedPropsStyles, newCurrentStyles, newCurrentVelocities, newLastIdealStyles, newLastIdealVelocities];
}

var TransitionMotion = (function (_React$Component) {
  _inherits(TransitionMotion, _React$Component);

  _createClass(TransitionMotion, null, [{
    key: 'propTypes',
    value: {
      defaultStyles: _propTypes2['default'].arrayOf(_propTypes2['default'].shape({
        key: _propTypes2['default'].string.isRequired,
        data: _propTypes2['default'].any,
        style: _propTypes2['default'].objectOf(_propTypes2['default'].number).isRequired
      })),
      styles: _propTypes2['default'].oneOfType([_propTypes2['default'].func, _propTypes2['default'].arrayOf(_propTypes2['default'].shape({
        key: _propTypes2['default'].string.isRequired,
        data: _propTypes2['default'].any,
        style: _propTypes2['default'].objectOf(_propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].object])).isRequired
      }))]).isRequired,
      children: _propTypes2['default'].func.isRequired,
      willEnter: _propTypes2['default'].func,
      willLeave: _propTypes2['default'].func,
      didLeave: _propTypes2['default'].func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      willEnter: function willEnter(styleThatEntered) {
        return _stripStyle2['default'](styleThatEntered.style);
      },
      // recall: returning null makes the current unmounting TransitionStyle
      // disappear immediately
      willLeave: function willLeave() {
        return null;
      },
      didLeave: function didLeave() {}
    },
    enumerable: true
  }]);

  function TransitionMotion(props) {
    var _this = this;

    _classCallCheck(this, TransitionMotion);

    _React$Component.call(this, props);
    this.unmounting = false;
    this.animationID = null;
    this.prevTime = 0;
    this.accumulatedTime = 0;
    this.unreadPropStyles = null;

    this.clearUnreadPropStyle = function (unreadPropStyles) {
      var _mergeAndSync = mergeAndSync(_this.props.willEnter, _this.props.willLeave, _this.props.didLeave, _this.state.mergedPropsStyles, unreadPropStyles, _this.state.currentStyles, _this.state.currentVelocities, _this.state.lastIdealStyles, _this.state.lastIdealVelocities);

      var mergedPropsStyles = _mergeAndSync[0];
      var currentStyles = _mergeAndSync[1];
      var currentVelocities = _mergeAndSync[2];
      var lastIdealStyles = _mergeAndSync[3];
      var lastIdealVelocities = _mergeAndSync[4];

      for (var i = 0; i < unreadPropStyles.length; i++) {
        var unreadPropStyle = unreadPropStyles[i].style;
        var dirty = false;

        for (var key in unreadPropStyle) {
          if (!Object.prototype.hasOwnProperty.call(unreadPropStyle, key)) {
            continue;
          }

          var styleValue = unreadPropStyle[key];
          if (typeof styleValue === 'number') {
            if (!dirty) {
              dirty = true;
              currentStyles[i] = _extends({}, currentStyles[i]);
              currentVelocities[i] = _extends({}, currentVelocities[i]);
              lastIdealStyles[i] = _extends({}, lastIdealStyles[i]);
              lastIdealVelocities[i] = _extends({}, lastIdealVelocities[i]);
              mergedPropsStyles[i] = {
                key: mergedPropsStyles[i].key,
                data: mergedPropsStyles[i].data,
                style: _extends({}, mergedPropsStyles[i].style)
              };
            }
            currentStyles[i][key] = styleValue;
            currentVelocities[i][key] = 0;
            lastIdealStyles[i][key] = styleValue;
            lastIdealVelocities[i][key] = 0;
            mergedPropsStyles[i].style[key] = styleValue;
          }
        }
      }

      // unlike the other 2 components, we can't detect staleness and optionally
      // opt out of setState here. each style object's data might contain new
      // stuff we're not/cannot compare
      _this.setState({
        currentStyles: currentStyles,
        currentVelocities: currentVelocities,
        mergedPropsStyles: mergedPropsStyles,
        lastIdealStyles: lastIdealStyles,
        lastIdealVelocities: lastIdealVelocities
      });
    };

    this.startAnimationIfNecessary = function () {
      if (_this.unmounting) {
        return;
      }

      // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
      // call cb? No, otherwise accidental parent rerender causes cb trigger
      _this.animationID = _raf2['default'](function (timestamp) {
        // https://github.com/chenglou/react-motion/pull/420
        // > if execution passes the conditional if (this.unmounting), then
        // executes async defaultRaf and after that component unmounts and after
        // that the callback of defaultRaf is called, then setState will be called
        // on unmounted component.
        if (_this.unmounting) {
          return;
        }

        var propStyles = _this.props.styles;
        var destStyles = typeof propStyles === 'function' ? propStyles(rehydrateStyles(_this.state.mergedPropsStyles, _this.unreadPropStyles, _this.state.lastIdealStyles)) : propStyles;

        // check if we need to animate in the first place
        if (shouldStopAnimationAll(_this.state.currentStyles, destStyles, _this.state.currentVelocities, _this.state.mergedPropsStyles)) {
          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.accumulatedTime = 0;
          return;
        }

        var currentTime = timestamp || _performanceNow2['default']();
        var timeDelta = currentTime - _this.prevTime;
        _this.prevTime = currentTime;
        _this.accumulatedTime = _this.accumulatedTime + timeDelta;
        // more than 10 frames? prolly switched browser tab. Restart
        if (_this.accumulatedTime > msPerFrame * 10) {
          _this.accumulatedTime = 0;
        }

        if (_this.accumulatedTime === 0) {
          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.startAnimationIfNecessary();
          return;
        }

        var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
        var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

        var _mergeAndSync2 = mergeAndSync(_this.props.willEnter, _this.props.willLeave, _this.props.didLeave, _this.state.mergedPropsStyles, destStyles, _this.state.currentStyles, _this.state.currentVelocities, _this.state.lastIdealStyles, _this.state.lastIdealVelocities);

        var newMergedPropsStyles = _mergeAndSync2[0];
        var newCurrentStyles = _mergeAndSync2[1];
        var newCurrentVelocities = _mergeAndSync2[2];
        var newLastIdealStyles = _mergeAndSync2[3];
        var newLastIdealVelocities = _mergeAndSync2[4];

        for (var i = 0; i < newMergedPropsStyles.length; i++) {
          var newMergedPropsStyle = newMergedPropsStyles[i].style;
          var newCurrentStyle = {};
          var newCurrentVelocity = {};
          var newLastIdealStyle = {};
          var newLastIdealVelocity = {};

          for (var key in newMergedPropsStyle) {
            if (!Object.prototype.hasOwnProperty.call(newMergedPropsStyle, key)) {
              continue;
            }

            var styleValue = newMergedPropsStyle[key];
            if (typeof styleValue === 'number') {
              newCurrentStyle[key] = styleValue;
              newCurrentVelocity[key] = 0;
              newLastIdealStyle[key] = styleValue;
              newLastIdealVelocity[key] = 0;
            } else {
              var newLastIdealStyleValue = newLastIdealStyles[i][key];
              var newLastIdealVelocityValue = newLastIdealVelocities[i][key];
              for (var j = 0; j < framesToCatchUp; j++) {
                var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

                newLastIdealStyleValue = _stepper[0];
                newLastIdealVelocityValue = _stepper[1];
              }

              var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

              var nextIdealX = _stepper2[0];
              var nextIdealV = _stepper2[1];

              newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
              newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
              newLastIdealStyle[key] = newLastIdealStyleValue;
              newLastIdealVelocity[key] = newLastIdealVelocityValue;
            }
          }

          newLastIdealStyles[i] = newLastIdealStyle;
          newLastIdealVelocities[i] = newLastIdealVelocity;
          newCurrentStyles[i] = newCurrentStyle;
          newCurrentVelocities[i] = newCurrentVelocity;
        }

        _this.animationID = null;
        // the amount we're looped over above
        _this.accumulatedTime -= framesToCatchUp * msPerFrame;

        _this.setState({
          currentStyles: newCurrentStyles,
          currentVelocities: newCurrentVelocities,
          lastIdealStyles: newLastIdealStyles,
          lastIdealVelocities: newLastIdealVelocities,
          mergedPropsStyles: newMergedPropsStyles
        });

        _this.unreadPropStyles = null;

        _this.startAnimationIfNecessary();
      });
    };

    this.state = this.defaultState();
  }

  TransitionMotion.prototype.defaultState = function defaultState() {
    var _props = this.props;
    var defaultStyles = _props.defaultStyles;
    var styles = _props.styles;
    var willEnter = _props.willEnter;
    var willLeave = _props.willLeave;
    var didLeave = _props.didLeave;

    var destStyles = typeof styles === 'function' ? styles(defaultStyles) : styles;

    // this is special. for the first time around, we don't have a comparison
    // between last (no last) and current merged props. we'll compute last so:
    // say default is {a, b} and styles (dest style) is {b, c}, we'll
    // fabricate last as {a, b}
    var oldMergedPropsStyles = undefined;
    if (defaultStyles == null) {
      oldMergedPropsStyles = destStyles;
    } else {
      oldMergedPropsStyles = defaultStyles.map(function (defaultStyleCell) {
        // TODO: key search code
        for (var i = 0; i < destStyles.length; i++) {
          if (destStyles[i].key === defaultStyleCell.key) {
            return destStyles[i];
          }
        }
        return defaultStyleCell;
      });
    }
    var oldCurrentStyles = defaultStyles == null ? destStyles.map(function (s) {
      return _stripStyle2['default'](s.style);
    }) : defaultStyles.map(function (s) {
      return _stripStyle2['default'](s.style);
    });
    var oldCurrentVelocities = defaultStyles == null ? destStyles.map(function (s) {
      return _mapToZero2['default'](s.style);
    }) : defaultStyles.map(function (s) {
      return _mapToZero2['default'](s.style);
    });

    var _mergeAndSync3 = mergeAndSync(
    // Because this is an old-style createReactClass component, Flow doesn't
    // understand that the willEnter and willLeave props have default values
    // and will always be present.
    willEnter, willLeave, didLeave, oldMergedPropsStyles, destStyles, oldCurrentStyles, oldCurrentVelocities, oldCurrentStyles, // oldLastIdealStyles really
    oldCurrentVelocities);

    var mergedPropsStyles = _mergeAndSync3[0];
    var currentStyles = _mergeAndSync3[1];
    var currentVelocities = _mergeAndSync3[2];
    var lastIdealStyles = _mergeAndSync3[3];
    var lastIdealVelocities = _mergeAndSync3[4];
    // oldLastIdealVelocities really

    return {
      currentStyles: currentStyles,
      currentVelocities: currentVelocities,
      lastIdealStyles: lastIdealStyles,
      lastIdealVelocities: lastIdealVelocities,
      mergedPropsStyles: mergedPropsStyles
    };
  };

  // after checking for unreadPropStyles != null, we manually go set the
  // non-interpolating values (those that are a number, without a spring
  // config)

  TransitionMotion.prototype.componentDidMount = function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  };

  TransitionMotion.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (this.unreadPropStyles) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyles);
    }

    var styles = props.styles;
    if (typeof styles === 'function') {
      this.unreadPropStyles = styles(rehydrateStyles(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.lastIdealStyles));
    } else {
      this.unreadPropStyles = styles;
    }

    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  };

  TransitionMotion.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unmounting = true;
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  };

  TransitionMotion.prototype.render = function render() {
    var hydratedStyles = rehydrateStyles(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.currentStyles);
    var renderedChildren = this.props.children(hydratedStyles);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  };

  return TransitionMotion;
})(_react2['default'].Component);

exports['default'] = TransitionMotion;
module.exports = exports['default'];

// list of styles, each containing interpolating values. Part of what's passed
// to children function. Notice that this is
// Array<ActualInterpolatingStyleObject>, without the wrapper that is {key: ...,
// data: ... style: ActualInterpolatingStyleObject}. Only mergedPropsStyles
// contains the key & data info (so that we only have a single source of truth
// for these, and to save space). Check the comment for `rehydrateStyles` to
// see how we regenerate the entirety of what's passed to children function

// the array that keeps track of currently rendered stuff! Including stuff
// that you've unmounted but that's still animating. This is where it lives

// it's possible that currentStyle's value is stale: if props is immediately
// changed from 0 to 400 to spring(0) again, the async currentStyle is still
// at 0 (didn't have time to tick and interpolate even once). If we naively
// compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
// In reality currentStyle should be 400
});

unwrapExports(TransitionMotion_1);

var presets = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports["default"] = {
  noWobble: { stiffness: 170, damping: 26 }, // the default, if nothing provided
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 }
};
module.exports = exports["default"];
});

unwrapExports(presets);

var spring_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = spring;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }



var _presets2 = _interopRequireDefault(presets);

var defaultConfig = _extends({}, _presets2['default'].noWobble, {
  precision: 0.01
});

function spring(val, config) {
  return _extends({}, defaultConfig, config, { val: val });
}

module.exports = exports['default'];
});

unwrapExports(spring_1);

var reorderKeys_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports['default'] = reorderKeys;

var hasWarned = false;

function reorderKeys() {
  {
    if (!hasWarned) {
      hasWarned = true;
      console.error('`reorderKeys` has been removed, since it is no longer needed for TransitionMotion\'s new styles array API.');
    }
  }
}

module.exports = exports['default'];
});

unwrapExports(reorderKeys_1);

var reactMotion = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }



exports.Motion = _interopRequire(Motion_1);



exports.StaggeredMotion = _interopRequire(StaggeredMotion_1);



exports.TransitionMotion = _interopRequire(TransitionMotion_1);



exports.spring = _interopRequire(spring_1);



exports.presets = _interopRequire(presets);



exports.stripStyle = _interopRequire(stripStyle_1);

// deprecated, dummy warning function



exports.reorderKeys = _interopRequire(reorderKeys_1);
});

unwrapExports(reactMotion);
var reactMotion_1 = reactMotion.Motion;
var reactMotion_2 = reactMotion.StaggeredMotion;
var reactMotion_3 = reactMotion.TransitionMotion;
var reactMotion_4 = reactMotion.spring;
var reactMotion_5 = reactMotion.presets;
var reactMotion_6 = reactMotion.stripStyle;
var reactMotion_7 = reactMotion.reorderKeys;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var ANIMATION_PROPTYPES = propTypes.oneOfType([propTypes.string, propTypes.shape({
  stiffness: propTypes.number,
  nonAnimatedProps: propTypes.arrayOf(propTypes.string),
  damping: propTypes.number
}), propTypes.bool]);

var propTypes$1 = {
  animatedProps: propTypes.arrayOf(propTypes.string).isRequired,
  animation: ANIMATION_PROPTYPES,
  onStart: propTypes.func,
  onEnd: propTypes.func
};

/**
 * Format the animation style object
 * @param {Object|String} animationStyle - The animation style property, either the name of a
 * presets are one of noWobble, gentle, wobbly, stiff
 */
function getAnimationStyle() {
  var animationStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : reactMotion_5.noWobble;

  if (typeof animationStyle === 'string') {
    return reactMotion_5[animationStyle] || reactMotion_5.noWobble;
  }
  var damping = animationStyle.damping,
      stiffness = animationStyle.stiffness;

  return _extends$1({
    damping: damping || reactMotion_5.noWobble.damping,
    stiffness: stiffness || reactMotion_5.noWobble.stiffness
  }, animationStyle);
}

/**
 * Extract the animated props from the entire props object.
 * @param {Object} props Props.
 * @returns {Object} Object of animated props.
 */
function extractAnimatedPropValues(props) {
  var animatedProps = props.animatedProps,
      otherProps = _objectWithoutProperties(props, ['animatedProps']);

  return animatedProps.reduce(function (result, animatedPropName) {
    if (otherProps.hasOwnProperty(animatedPropName)) {
      result[animatedPropName] = otherProps[animatedPropName];
    }
    return result;
  }, {});
}

var Animation = function (_PureComponent) {
  _inherits(Animation, _PureComponent);

  function Animation(props) {
    _classCallCheck(this, Animation);

    var _this = _possibleConstructorReturn(this, (Animation.__proto__ || Object.getPrototypeOf(Animation)).call(this, props));

    _this._motionEndHandler = function () {
      if (_this.props.onEnd) {
        _this.props.onEnd();
      }
    };

    _this._renderChildren = function (_ref) {
      var i = _ref.i;
      var children = _this.props.children;

      var interpolator = _this._interpolator;
      var child = react.Children.only(children);
      var interpolatedProps = interpolator ? interpolator(i) : interpolator;

      // interpolator doesnt play nice with deeply nested objected
      // so we expose an additional prop for situations like these, soit _data,
      // which stores the full tree and can be recombined with the sanitized version
      // after interpolation
      var data = interpolatedProps && interpolatedProps.data || null;
      if (data && child.props._data) {
        data = data.map(function (row, index) {
          var correspondingCell = child.props._data[index];
          return _extends$1({}, row, {
            parent: correspondingCell.parent,
            children: correspondingCell.children
          });
        });
      }

      return react.cloneElement(child, _extends$1({}, child.props, interpolatedProps, {
        data: data || child.props.data || null,
        // enforce re-rendering
        _animation: Math.random()
      }));
    };

    _this._updateInterpolator(props);
    return _this;
  }

  _createClass(Animation, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(props) {
      this._updateInterpolator(this.props, props);
      if (props.onStart) {
        props.onStart();
      }
    }

    /**
     * Render the child into the parent.
     * @param {Number} i Number generated by the spring.
     * @returns {React.Component} Rendered react element.
     * @private
     */

  }, {
    key: '_updateInterpolator',


    /**
     * Update the interpolator function and assign it to this._interpolator.
     * @param {Object} oldProps Old props.
     * @param {Object} newProps New props.
     * @private
     */
    value: function _updateInterpolator(oldProps, newProps) {
      this._interpolator = interpolateValue(extractAnimatedPropValues(oldProps), newProps ? extractAnimatedPropValues(newProps) : null);
    }
  }, {
    key: 'render',
    value: function render() {
      var animationStyle = getAnimationStyle(this.props.animation);
      var defaultStyle = { i: 0 };
      var style = { i: reactMotion_4(1, animationStyle) };
      // In order to make Motion re-run animations each time, the random key is
      // always passed.
      // TODO: find a better solution for the spring.
      var key = Math.random();
      return react.createElement(
        reactMotion_1,
        _extends$1({ defaultStyle: defaultStyle, style: style, key: key }, { onRest: this._motionEndHandler }),
        this._renderChildren
      );
    }
  }]);

  return Animation;
}(react_1);

Animation.propTypes = propTypes$1;
Animation.displayName = 'Animation';

var AnimationPropType = ANIMATION_PROPTYPES;

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;

function extent(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
}

function range(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}

var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function ticks(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;

  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0) return [start];
  if (reverse = stop < start) n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));
    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
}

function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0
      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

function thresholdSturges(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}

function max(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
}

function min(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
}

function sum(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  }

  else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
}

var prefix = "$";

function Map() {}

Map.prototype = map$1.prototype = {
  constructor: Map,
  has: function(key) {
    return (prefix + key) in this;
  },
  get: function(key) {
    return this[prefix + key];
  },
  set: function(key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function(key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function() {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function() {
    var keys = [];
    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
    return keys;
  },
  values: function() {
    var values = [];
    for (var property in this) if (property[0] === prefix) values.push(this[property]);
    return values;
  },
  entries: function() {
    var entries = [];
    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
    return entries;
  },
  size: function() {
    var size = 0;
    for (var property in this) if (property[0] === prefix) ++size;
    return size;
  },
  empty: function() {
    for (var property in this) if (property[0] === prefix) return false;
    return true;
  },
  each: function(f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map$1(object, f) {
  var map = new Map;

  // Copy constructor.
  if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

  // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
    var i = -1,
        n = object.length,
        o;

    if (f == null) while (++i < n) map.set(i, object[i]);
    else while (++i < n) map.set(f(o = object[i], i, object), o);
  }

  // Convert object to map.
  else if (object) for (var key in object) map.set(key, object[key]);

  return map;
}

function nest() {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = map$1(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each(function(values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });

    return result;
  }

  function entries(map, depth) {
    if (++depth > keys.length) return map;
    var array, sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map.entries();
    else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
    return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
  }

  return nest = {
    object: function(array) { return apply(array, 0, createObject, setObject); },
    map: function(array) { return apply(array, 0, createMap, setMap); },
    entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
    key: function(d) { keys.push(d); return nest; },
    sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
    sortValues: function(order) { sortValues = order; return nest; },
    rollup: function(f) { rollup = f; return nest; }
  };
}

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return map$1();
}

function setMap(map, key, value) {
  map.set(key, value);
}

function Set$1() {}

var proto = map$1.prototype;

Set$1.prototype = set$1.prototype = {
  constructor: Set$1,
  has: proto.has,
  add: function(value) {
    value += "";
    this[prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set$1(object, f) {
  var set = new Set$1;

  // Copy constructor.
  if (object instanceof Set$1) object.each(function(value) { set.add(value); });

  // Otherwise, assume it’s an array.
  else if (object) {
    var i = -1, n = object.length;
    if (f == null) while (++i < n) set.add(object[i]);
    else while (++i < n) set.add(f(object[i], i, object));
  }

  return set;
}

var array$2 = Array.prototype;

var map$2 = array$2.map;
var slice$1 = array$2.slice;

var implicit = {name: "implicit"};

function ordinal(range) {
  var index = map$1(),
      domain = [],
      unknown = implicit;

  range = range == null ? [] : slice$1.call(range);

  function scale(d) {
    var key = d + "", i = index.get(key);
    if (!i) {
      if (unknown !== implicit) return unknown;
      index.set(key, i = domain.push(d));
    }
    return range[(i - 1) % range.length];
  }

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = map$1();
    var i = -1, n = _.length, d, key;
    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
    return scale;
  };

  scale.range = function(_) {
    return arguments.length ? (range = slice$1.call(_), scale) : range.slice();
  };

  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function() {
    return ordinal()
        .domain(domain)
        .range(range)
        .unknown(unknown);
  };

  return scale;
}

function band() {
  var scale = ordinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range$$1 = [0, 1],
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;

  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = range$$1[1] < range$$1[0],
        start = range$$1[reverse - 0],
        stop = range$$1[1 - reverse];
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = range(n).map(function(i) { return start + step * i; });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function(_) {
    return arguments.length ? (range$$1 = [+_[0], +_[1]], rescale()) : range$$1.slice();
  };

  scale.rangeRound = function(_) {
    return range$$1 = [+_[0], +_[1]], round = true, rescale();
  };

  scale.bandwidth = function() {
    return bandwidth;
  };

  scale.step = function() {
    return step;
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function(_) {
    return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
  };

  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
  };

  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
  };

  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function() {
    return band()
        .domain(domain())
        .range(range$$1)
        .round(round)
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)
        .align(align);
  };

  return rescale();
}

function pointish(scale) {
  var copy = scale.copy;

  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function() {
    return pointish(copy());
  };

  return scale;
}

function point() {
  return pointish(band().paddingInner(1));
}

function constant$3(x) {
  return function() {
    return x;
  };
}

function number$1(x) {
  return +x;
}

var unit = [0, 1];

function deinterpolateLinear(a, b) {
  return (b -= (a = +a))
      ? function(x) { return (x - a) / b; }
      : constant$3(b);
}

function deinterpolateClamp(deinterpolate) {
  return function(a, b) {
    var d = deinterpolate(a = +a, b = +b);
    return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
  };
}

function reinterpolateClamp(reinterpolate$$1) {
  return function(a, b) {
    var r = reinterpolate$$1(a = +a, b = +b);
    return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
  };
}

function bimap(domain, range$$1, deinterpolate, reinterpolate$$1) {
  var d0 = domain[0], d1 = domain[1], r0 = range$$1[0], r1 = range$$1[1];
  if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate$$1(r1, r0);
  else d0 = deinterpolate(d0, d1), r0 = reinterpolate$$1(r0, r1);
  return function(x) { return r0(d0(x)); };
}

function polymap(domain, range$$1, deinterpolate, reinterpolate$$1) {
  var j = Math.min(domain.length, range$$1.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1;

  // Reverse descending domains.
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range$$1 = range$$1.slice().reverse();
  }

  while (++i < j) {
    d[i] = deinterpolate(domain[i], domain[i + 1]);
    r[i] = reinterpolate$$1(range$$1[i], range$$1[i + 1]);
  }

  return function(x) {
    var i = bisectRight(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target
      .domain(source.domain())
      .range(source.range())
      .interpolate(source.interpolate())
      .clamp(source.clamp());
}

// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
function continuous(deinterpolate, reinterpolate$$1) {
  var domain = unit,
      range$$1 = unit,
      interpolate$$1 = interpolateValue,
      clamp = false,
      piecewise$$1,
      output,
      input;

  function rescale() {
    piecewise$$1 = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return (output || (output = piecewise$$1(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
  }

  scale.invert = function(y) {
    return (input || (input = piecewise$$1(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate$$1) : reinterpolate$$1)))(+y);
  };

  scale.domain = function(_) {
    return arguments.length ? (domain = map$2.call(_, number$1), rescale()) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range$$1 = slice$1.call(_), rescale()) : range$$1.slice();
  };

  scale.rangeRound = function(_) {
    return range$$1 = slice$1.call(_), interpolate$$1 = interpolateRound, rescale();
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, rescale()) : clamp;
  };

  scale.interpolate = function(_) {
    return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
  };

  return rescale();
}

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
function formatDecimal(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
}

function exponent(x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
}

function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
}

function formatNumerals(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}

// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  return new FormatSpecifier(specifier);
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  this.fill = match[1] || " ";
  this.align = match[2] || ">";
  this.sign = match[3] || "-";
  this.symbol = match[4] || "";
  this.zero = !!match[5];
  this.width = match[6] && +match[6];
  this.comma = !!match[7];
  this.precision = match[8] && +match[8].slice(1);
  this.trim = !!match[9];
  this.type = match[10] || "";
}

FormatSpecifier.prototype.toString = function() {
  return this.fill
      + this.align
      + this.sign
      + this.symbol
      + (this.zero ? "0" : "")
      + (this.width == null ? "" : Math.max(1, this.width | 0))
      + (this.comma ? "," : "")
      + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
      + (this.trim ? "~" : "")
      + this.type;
};

// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function formatTrim(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
    }
  }
  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

var prefixExponent;

function formatPrefixAuto(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient
      : i > n ? coefficient + new Array(i - n + 1).join("0")
      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
      : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}

function formatRounded(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

var formatTypes = {
  "%": function(x, p) { return (x * 100).toFixed(p); },
  "b": function(x) { return Math.round(x).toString(2); },
  "c": function(x) { return x + ""; },
  "d": function(x) { return Math.round(x).toString(10); },
  "e": function(x, p) { return x.toExponential(p); },
  "f": function(x, p) { return x.toFixed(p); },
  "g": function(x, p) { return x.toPrecision(p); },
  "o": function(x) { return Math.round(x).toString(8); },
  "p": function(x, p) { return formatRounded(x * 100, p); },
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
  "x": function(x) { return Math.round(x).toString(16); }
};

function identity$2(x) {
  return x;
}

var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

function formatLocale(locale) {
  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$2,
      currency = locale.currency,
      decimal = locale.decimal,
      numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$2,
      percent = locale.percent || "%";

  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);

    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type;

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!formatTypes[type]) precision == null && (precision = 12), trim = true, type = "g";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision == null ? 6
        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
        : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i, n, c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;

        // Perform the initial formatting.
        var valueNegative = value < 0;
        value = formatType(Math.abs(value), precision);

        // Trim insignificant zeros.
        if (trim) value = formatTrim(value);

        // If a negative value rounds to zero during formatting, treat as positive.
        if (valueNegative && +value === 0) valueNegative = false;

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

        // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }

      // If the fill character is not "0", grouping is applied before padding.
      if (comma && !zero) value = group(value, Infinity);

      // Compute the padding.
      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : "";

      // If the fill character is "0", grouping is applied after padding.
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

      // Reconstruct the final output based on the desired alignment.
      switch (align) {
        case "<": value = valuePrefix + value + valueSuffix + padding; break;
        case "=": value = valuePrefix + padding + value + valueSuffix; break;
        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
        default: value = padding + valuePrefix + value + valueSuffix; break;
      }

      return numerals(value);
    }

    format.toString = function() {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function(value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
}

var locale;
var format;
var formatPrefix;

defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  locale = formatLocale(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}

function precisionFixed(step) {
  return Math.max(0, -exponent(Math.abs(step)));
}

function precisionPrefix(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
}

function precisionRound(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
}

function tickFormat(domain, count, specifier) {
  var start = domain[0],
      stop = domain[domain.length - 1],
      step = tickStep(start, stop, count == null ? 10 : count),
      precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format(specifier);
}

function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function(count) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function(count, specifier) {
    return tickFormat(domain(), count, specifier);
  };

  scale.nice = function(count) {
    if (count == null) count = 10;

    var d = domain(),
        i0 = 0,
        i1 = d.length - 1,
        start = d[i0],
        stop = d[i1],
        step;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }

    step = tickIncrement(start, stop, count);

    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = tickIncrement(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = tickIncrement(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      domain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

function linear$1() {
  var scale = continuous(deinterpolateLinear, reinterpolate);

  scale.copy = function() {
    return copy(scale, linear$1());
  };

  return linearish(scale);
}

function nice(domain, interval) {
  domain = domain.slice();

  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}

function deinterpolate(a, b) {
  return (b = Math.log(b / a))
      ? function(x) { return Math.log(x / a) / b; }
      : constant$3(b);
}

function reinterpolate$1(a, b) {
  return a < 0
      ? function(t) { return -Math.pow(-b, t) * Math.pow(-a, 1 - t); }
      : function(t) { return Math.pow(b, t) * Math.pow(a, 1 - t); };
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10
      : base === Math.E ? Math.exp
      : function(x) { return Math.pow(base, x); };
}

function logp(base) {
  return base === Math.E ? Math.log
      : base === 10 && Math.log10
      || base === 2 && Math.log2
      || (base = Math.log(base), function(x) { return Math.log(x) / base; });
}

function reflect(f) {
  return function(x) {
    return -f(-x);
  };
}

function log() {
  var scale = continuous(deinterpolate, reinterpolate$1).domain([1, 10]),
      domain = scale.domain,
      base = 10,
      logs = logp(10),
      pows = powp(10);

  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
    return scale;
  }

  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = function(count) {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1],
        r;

    if (r = v < u) i = u, u = v, v = i;

    var i = logs(u),
        j = logs(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.round(i) - 1, j = Math.round(j) + 1;
      if (u > 0) for (; i < j; ++i) {
        for (k = 1, p = pows(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i < j; ++i) {
        for (k = base - 1, p = pows(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
    } else {
      z = ticks(i, j, Math.min(j - i, n)).map(pows);
    }

    return r ? z.reverse() : z;
  };

  scale.tickFormat = function(count, specifier) {
    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function") specifier = format(specifier);
    if (count === Infinity) return specifier;
    if (count == null) count = 10;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
    return function(d) {
      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = function() {
    return domain(nice(domain(), {
      floor: function(x) { return pows(Math.floor(logs(x))); },
      ceil: function(x) { return pows(Math.ceil(logs(x))); }
    }));
  };

  scale.copy = function() {
    return copy(scale, log().base(base));
  };

  return scale;
}

function raise(x, exponent) {
  return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
}

function pow() {
  var exponent = 1,
      scale = continuous(deinterpolate, reinterpolate),
      domain = scale.domain;

  function deinterpolate(a, b) {
    return (b = raise(b, exponent) - (a = raise(a, exponent)))
        ? function(x) { return (raise(x, exponent) - a) / b; }
        : constant$3(b);
  }

  function reinterpolate(a, b) {
    b = raise(b, exponent) - (a = raise(a, exponent));
    return function(t) { return raise(a + b * t, 1 / exponent); };
  }

  scale.exponent = function(_) {
    return arguments.length ? (exponent = +_, domain(domain())) : exponent;
  };

  scale.copy = function() {
    return copy(scale, pow().exponent(exponent));
  };

  return linearish(scale);
}

function sqrt() {
  return pow().exponent(0.5);
}

var t0$1 = new Date,
    t1$1 = new Date;

function newInterval(floori, offseti, count, field) {

  function interval(date) {
    return floori(date = new Date(+date)), date;
  }

  interval.floor = interval;

  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function(date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function(date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function(start, stop, step) {
    var range = [], previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range;
  };

  interval.filter = function(test) {
    return newInterval(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function(date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
        }
      }
    });
  };

  if (count) {
    interval.count = function(start, end) {
      t0$1.setTime(+start), t1$1.setTime(+end);
      floori(t0$1), floori(t1$1);
      return Math.floor(count(t0$1, t1$1));
    };

    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? interval
          : interval.filter(field
              ? function(d) { return field(d) % step === 0; }
              : function(d) { return interval.count(0, d) % step === 0; });
    };
  }

  return interval;
}

var millisecond = newInterval(function() {
  // noop
}, function(date, step) {
  date.setTime(+date + step);
}, function(start, end) {
  return end - start;
});

// An optimized implementation for this simple case.
millisecond.every = function(k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return newInterval(function(date) {
    date.setTime(Math.floor(date / k) * k);
  }, function(date, step) {
    date.setTime(+date + step * k);
  }, function(start, end) {
    return (end - start) / k;
  });
};

var durationSecond = 1e3;
var durationMinute = 6e4;
var durationHour = 36e5;
var durationDay = 864e5;
var durationWeek = 6048e5;

var second = newInterval(function(date) {
  date.setTime(Math.floor(date / durationSecond) * durationSecond);
}, function(date, step) {
  date.setTime(+date + step * durationSecond);
}, function(start, end) {
  return (end - start) / durationSecond;
}, function(date) {
  return date.getUTCSeconds();
});

var minute = newInterval(function(date) {
  date.setTime(Math.floor(date / durationMinute) * durationMinute);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getMinutes();
});

var hour = newInterval(function(date) {
  var offset = date.getTimezoneOffset() * durationMinute % durationHour;
  if (offset < 0) offset += durationHour;
  date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getHours();
});

var day = newInterval(function(date) {
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setDate(date.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
}, function(date) {
  return date.getDate() - 1;
});

function weekday(i) {
  return newInterval(function(date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
  });
}

var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);

var month = newInterval(function(date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setMonth(date.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
  return date.getMonth();
});

var year = newInterval(function(date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
}, function(date) {
  return date.getFullYear();
});

// An optimized implementation for this simple case.
year.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

var utcMinute = newInterval(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getUTCMinutes();
});

var utcHour = newInterval(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getUTCHours();
});

var utcDay = newInterval(function(date) {
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / durationDay;
}, function(date) {
  return date.getUTCDate() - 1;
});

function utcWeekday(i) {
  return newInterval(function(date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / durationWeek;
  });
}

var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);

var utcMonth = newInterval(function(date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
  return date.getUTCMonth();
});

var utcYear = newInterval(function(date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date) {
  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }
  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }
  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newYear(y) {
  return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
}

function formatLocale$1(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;

  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);

  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };

  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };

  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  };

  // These recursive directive definitions must be deferred.
  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function(date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;

      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
          else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, newDate) {
    return function(string) {
      var d = newYear(1900),
          i = parseSpecifier(d, specifier, string += "", 0),
          week, day$$1;
      if (i != string.length) return null;

      // If a UNIX timestamp is specified, return it.
      if ("Q" in d) return new Date(d.Q);

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ("p" in d) d.H = d.H % 12 + d.p * 12;

      // Convert day-of-week and week-of-year to day-of-year.
      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;
        if ("Z" in d) {
          week = utcDate(newYear(d.y)), day$$1 = week.getUTCDay();
          week = day$$1 > 4 || day$$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
          week = utcDay.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = newDate(newYear(d.y)), day$$1 = week.getDay();
          week = day$$1 > 4 || day$$1 === 0 ? monday.ceil(week) : monday(week);
          week = day.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$1 + 5) % 7 : d.w + d.U * 7 - (day$$1 + 6) % 7;
      }

      // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.
      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      }

      // Otherwise, all fields are in local time.
      return newDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  return {
    format: function(specifier) {
      var f = newFormat(specifier += "", formats);
      f.toString = function() { return specifier; };
      return f;
    },
    parse: function(specifier) {
      var p = newParse(specifier += "", localDate);
      p.toString = function() { return specifier; };
      return p;
    },
    utcFormat: function(specifier) {
      var f = newFormat(specifier += "", utcFormats);
      f.toString = function() { return specifier; };
      return f;
    },
    utcParse: function(specifier) {
      var p = newParse(specifier, utcDate);
      p.toString = function() { return specifier; };
      return p;
    }
  };
}

var pads = {"-": "", "_": " ", "0": "0"},
    numberRe = /^\s*\d+/, // note: ignores next directive
    percentRe = /^%/,
    requoteRe = /[\\^$*+?|[\]().{}]/g;

function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = {}, i = -1, n = names.length;
  while (++i < n) map[names[i].toLowerCase()] = i;
  return map;
}

function parseWeekdayNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekdayNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.u = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberISO(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.V = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseMicroseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 6));
  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function parseUnixTimestamp(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0], i + n[0].length) : -1;
}

function parseUnixTimestampSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + day.count(year(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMicroseconds(d, p) {
  return formatMilliseconds(d, p) + "000";
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekdayNumberMonday(d) {
  var day$$1 = d.getDay();
  return day$$1 === 0 ? 7 : day$$1;
}

function formatWeekNumberSunday(d, p) {
  return pad(sunday.count(year(d), d), p, 2);
}

function formatWeekNumberISO(d, p) {
  var day$$1 = d.getDay();
  d = (day$$1 >= 4 || day$$1 === 0) ? thursday(d) : thursday.ceil(d);
  return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
}

function formatWeekdayNumberSunday(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(monday.count(year(d), d), p, 2);
}

function formatYear(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+"))
      + pad(z / 60 | 0, "0", 2)
      + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMicroseconds(d, p) {
  return formatUTCMilliseconds(d, p) + "000";
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(utcSunday.count(utcYear(d), d), p, 2);
}

function formatUTCWeekNumberISO(d, p) {
  var day$$1 = d.getUTCDay();
  d = (day$$1 >= 4 || day$$1 === 0) ? utcThursday(d) : utcThursday.ceil(d);
  return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
}

function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(utcMonday.count(utcYear(d), d), p, 2);
}

function formatUTCYear(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

function formatUnixTimestamp(d) {
  return +d;
}

function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1000);
}

var locale$1;
var timeFormat;
var timeParse;
var utcFormat;
var utcParse;

defaultLocale$1({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale$1(definition) {
  locale$1 = formatLocale$1(definition);
  timeFormat = locale$1.format;
  timeParse = locale$1.parse;
  utcFormat = locale$1.utcFormat;
  utcParse = locale$1.utcParse;
  return locale$1;
}

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
  return date.toISOString();
}

var formatIso = Date.prototype.toISOString
    ? formatIsoNative
    : utcFormat(isoSpecifier);

function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z")
    ? parseIsoNative
    : utcParse(isoSpecifier);

var durationSecond$1 = 1000,
    durationMinute$1 = durationSecond$1 * 60,
    durationHour$1 = durationMinute$1 * 60,
    durationDay$1 = durationHour$1 * 24,
    durationWeek$1 = durationDay$1 * 7,
    durationMonth = durationDay$1 * 30,
    durationYear = durationDay$1 * 365;

function date$1(t) {
  return new Date(t);
}

function number$2(t) {
  return t instanceof Date ? +t : +new Date(+t);
}

function calendar(year$$1, month$$1, week, day$$1, hour$$1, minute$$1, second$$1, millisecond$$1, format) {
  var scale = continuous(deinterpolateLinear, reinterpolate),
      invert = scale.invert,
      domain = scale.domain;

  var formatMillisecond = format(".%L"),
      formatSecond = format(":%S"),
      formatMinute = format("%I:%M"),
      formatHour = format("%I %p"),
      formatDay = format("%a %d"),
      formatWeek = format("%b %d"),
      formatMonth = format("%B"),
      formatYear = format("%Y");

  var tickIntervals = [
    [second$$1,  1,      durationSecond$1],
    [second$$1,  5,  5 * durationSecond$1],
    [second$$1, 15, 15 * durationSecond$1],
    [second$$1, 30, 30 * durationSecond$1],
    [minute$$1,  1,      durationMinute$1],
    [minute$$1,  5,  5 * durationMinute$1],
    [minute$$1, 15, 15 * durationMinute$1],
    [minute$$1, 30, 30 * durationMinute$1],
    [  hour$$1,  1,      durationHour$1  ],
    [  hour$$1,  3,  3 * durationHour$1  ],
    [  hour$$1,  6,  6 * durationHour$1  ],
    [  hour$$1, 12, 12 * durationHour$1  ],
    [   day$$1,  1,      durationDay$1   ],
    [   day$$1,  2,  2 * durationDay$1   ],
    [  week,  1,      durationWeek$1  ],
    [ month$$1,  1,      durationMonth ],
    [ month$$1,  3,  3 * durationMonth ],
    [  year$$1,  1,      durationYear  ]
  ];

  function tickFormat(date$$1) {
    return (second$$1(date$$1) < date$$1 ? formatMillisecond
        : minute$$1(date$$1) < date$$1 ? formatSecond
        : hour$$1(date$$1) < date$$1 ? formatMinute
        : day$$1(date$$1) < date$$1 ? formatHour
        : month$$1(date$$1) < date$$1 ? (week(date$$1) < date$$1 ? formatDay : formatWeek)
        : year$$1(date$$1) < date$$1 ? formatMonth
        : formatYear)(date$$1);
  }

  function tickInterval(interval, start, stop, step) {
    if (interval == null) interval = 10;

    // If a desired tick count is specified, pick a reasonable tick interval
    // based on the extent of the domain and a rough estimate of tick size.
    // Otherwise, assume interval is already a time interval and use it.
    if (typeof interval === "number") {
      var target = Math.abs(stop - start) / interval,
          i = bisector(function(i) { return i[2]; }).right(tickIntervals, target);
      if (i === tickIntervals.length) {
        step = tickStep(start / durationYear, stop / durationYear, interval);
        interval = year$$1;
      } else if (i) {
        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        step = i[1];
        interval = i[0];
      } else {
        step = Math.max(tickStep(start, stop, interval), 1);
        interval = millisecond$$1;
      }
    }

    return step == null ? interval : interval.every(step);
  }

  scale.invert = function(y) {
    return new Date(invert(y));
  };

  scale.domain = function(_) {
    return arguments.length ? domain(map$2.call(_, number$2)) : domain().map(date$1);
  };

  scale.ticks = function(interval, step) {
    var d = domain(),
        t0 = d[0],
        t1 = d[d.length - 1],
        r = t1 < t0,
        t;
    if (r) t = t0, t0 = t1, t1 = t;
    t = tickInterval(interval, t0, t1, step);
    t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
    return r ? t.reverse() : t;
  };

  scale.tickFormat = function(count, specifier) {
    return specifier == null ? tickFormat : format(specifier);
  };

  scale.nice = function(interval, step) {
    var d = domain();
    return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
        ? domain(nice(d, interval))
        : scale;
  };

  scale.copy = function() {
    return copy(scale, calendar(year$$1, month$$1, week, day$$1, hour$$1, minute$$1, second$$1, millisecond$$1, format));
  };

  return scale;
}

function scaleTime() {
  return calendar(year, month, sunday, day, hour, minute, second, millisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
}

function scaleUtc() {
  return calendar(utcYear, utcMonth, utcSunday, utcDay, utcHour, utcMinute, second, millisecond, utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
}

function colors(s) {
  return s.match(/.{6}/g).map(function(x) {
    return "#" + x;
  });
}

colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var rainbow = cubehelix();

function ramp(range) {
  var n = range.length;
  return function(t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _React$version$split = react.version.split('.'),
    _React$version$split2 = _slicedToArray(_React$version$split, 2),
    major = _React$version$split2[0],
    minor = _React$version$split2[1];

var versionHigherThanThirteen = Number(minor) > 13 || Number(major) > 13;

var isReactDOMSupported = function isReactDOMSupported() {
  return versionHigherThanThirteen;
};

/**
 * Support React 0.13 and greater where refs are React components, not DOM
 * nodes.
 * @param {*} ref React's ref.
 * @returns {Element} DOM element.
 */
var getDOMNode = function getDOMNode(ref) {
  if (!isReactDOMSupported()) {
    return ref && ref.getDOMNode();
  }
  return ref;
};

var USED_MESSAGES = {};
var HIDDEN_PROCESSES = {
  test: true,
  production: true
};

/**
 * Warn the user about something
 * @param {String} message - the message to be shown
 * @param {Boolean} onlyShowMessageOnce - whether or not we allow the
 - message to be show multiple times
 */
function warning(message) {
  var onlyShowMessageOnce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  /* eslint-disable no-undef, no-process-env */
  if (global$1.process && HIDDEN_PROCESSES["development"]) {
    return;
  }
  /* eslint-enable no-undef, no-process-env */
  if (!onlyShowMessageOnce || !USED_MESSAGES[message]) {
    /* eslint-disable no-console */
    console.warn(message);
    /* eslint-enable no-console */
    USED_MESSAGES[message] = true;
  }
}

// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * Get unique property values from an array.
 * @param {Array} arr Array of data.
 * @param {string} propertyName Prop name.
 * @returns {Array} Array of unique values.
 */
function getUniquePropertyValues(arr, accessor) {
  var setOfValues = new Set(arr.map(accessor));
  return Array.from(setOfValues);
}

/**
 * Add zero to the domain.
 * @param {Array} arr Add zero to the domain.
 * @param {Number} value Add zero to domain.
 * @returns {Array} Adjusted domain.
 */
function addValueToArray(arr, value) {
  var result = [].concat(arr);
  if (result[0] > value) {
    result[0] = value;
  }
  if (result[result.length - 1] < value) {
    result[result.length - 1] = value;
  }
  return result;
}

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _SCALE_FUNCTIONS;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Linear scale name.
 * @type {string}
 * @const
 */
var LINEAR_SCALE_TYPE = 'linear';

/**
 * Ordinal scale name.
 * @type {string}
 * @const
 */
var ORDINAL_SCALE_TYPE = 'ordinal';

/**
 * Category scale.
 * @type {string}
 * @const
 */
var CATEGORY_SCALE_TYPE = 'category';

/**
 * Literal scale.
 * Differs slightly from d3's identity scale in that it does not coerce value
 * into numbers, it simply returns exactly what you give it
 * @type {string}
 * @const
 */
var LITERAL_SCALE_TYPE = 'literal';

/**
 * Log scale name.
 * @type {string}
 * @const
 */
var LOG_SCALE_TYPE = 'log';

/**
 * Time scale name.
 * @type {string}
 * @const
 */
var TIME_SCALE_TYPE = 'time';

/**
 * Time UTC scale name.
 * @type {string}
 * @const
 */
var TIME_UTC_SCALE_TYPE = 'time-utc';

/**
 * Scale functions that are supported in the library.
 * @type {Object}
 * @const
 */
var SCALE_FUNCTIONS = (_SCALE_FUNCTIONS = {}, _defineProperty(_SCALE_FUNCTIONS, LINEAR_SCALE_TYPE, linear$1), _defineProperty(_SCALE_FUNCTIONS, ORDINAL_SCALE_TYPE, point), _defineProperty(_SCALE_FUNCTIONS, CATEGORY_SCALE_TYPE, ordinal), _defineProperty(_SCALE_FUNCTIONS, LITERAL_SCALE_TYPE, literalScale), _defineProperty(_SCALE_FUNCTIONS, LOG_SCALE_TYPE, log), _defineProperty(_SCALE_FUNCTIONS, TIME_SCALE_TYPE, scaleTime), _defineProperty(_SCALE_FUNCTIONS, TIME_UTC_SCALE_TYPE, scaleUtc), _SCALE_FUNCTIONS);

/**
 * Attrs for which a scale can be set up at XYPlot level
 * @type {Array}
 * @const
 */

var XYPLOT_ATTR = ['color', 'fill', 'opacity', 'stroke'];

/**
 * Title case a given string
 * @param {String} str Array of values.
 * @returns {String} titlecased string
 */
function toTitleCase(str) {
  return '' + str[0].toUpperCase() + str.slice(1);
}

/**
 * Find the smallest distance between the values on a given scale and return
 * the index of the element, where the smallest distance was found.
 * It returns the first occurrence of i where
 * `scale(value[i]) - scale(value[i - 1])` is minimal
 * @param {Array} values Array of values.
 * @param {Object} scaleObject Scale object.
 * @returns {number} Index of an element where the smallest distance was found.
 * @private
 */
function _getSmallestDistanceIndex(values$$1, scaleObject) {
  var scaleFn = getScaleFnFromScaleObject(scaleObject);
  var result = 0;
  if (scaleFn) {
    var nextValue = void 0;
    var currentValue = scaleFn(values$$1[0]);
    var distance = Infinity;
    var nextDistance = void 0;

    for (var i = 1; i < values$$1.length; i++) {
      nextValue = scaleFn(values$$1[i]);
      nextDistance = Math.abs(nextValue - currentValue);
      if (nextDistance < distance) {
        distance = nextDistance;
        result = i;
      }
      currentValue = nextValue;
    }
  }
  return result;
}

/**
 * Crate a scale function from the scale object.
 * @param {Object} scaleObject Scale object.
 - scaleObject.domain {Array}
 - scaleObject.range {Array}
 - scaleObject.type {string}
 - scaleObject.attr {string}
 * @returns {*} Scale function.
 * @private
 */
function getScaleFnFromScaleObject(scaleObject) {
  if (!scaleObject) {
    return null;
  }
  var type = scaleObject.type,
      domain = scaleObject.domain,
      range$$1 = scaleObject.range;

  var modDomain = domain[0] === domain[1] ? domain[0] === 0 ? [-1, 0] : [-domain[0], domain[0]] : domain;
  if (type === LITERAL_SCALE_TYPE) {
    return literalScale(range$$1[0]);
  }
  var scale = SCALE_FUNCTIONS[type]().domain(modDomain).range(range$$1);
  if (type === ORDINAL_SCALE_TYPE) {
    scale.padding(0.5);
  }
  return scale;
}

/**
 * Get the domain from the array of data.
 * @param {Array} allData All data.
 * @param {function} accessor - accessor for main value.
 * @param {function} accessor0 - accessor for the naught value.
 * @param {string} type Scale type.
 * @returns {Array} Domain.
 * @private
 */
function getDomainByAccessor(allData, accessor, accessor0, type) {
  var domain = void 0;

  // Collect both attr and available attr0 values from the array of data.
  var values$$1 = allData.reduce(function (data, d) {
    var value = accessor(d);
    var value0 = accessor0(d);
    if (_isDefined(value)) {
      data.push(value);
    }
    if (_isDefined(value0)) {
      data.push(value0);
    }
    return data;
  }, []);

  if (!values$$1.length) {
    return [];
  }

  // Create proper domain depending on the type of the scale.
  if (type !== ORDINAL_SCALE_TYPE && type !== CATEGORY_SCALE_TYPE) {
    domain = extent(values$$1);
  } else {
    domain = set$1(values$$1).values();
  }
  return domain;
}

/**
 * Create custom scale object from the value. When the scale is created from
 * this object, it should return the same value all time.
 * @param {string} attr Attribute.
 * @param {*} value Value.
 * @param {string} type - the type of scale being used
 * @param {function} accessor - the accessor function
 * @param {function} accessor0 - the accessor function for the potential naught value
 * @returns {Object} Custom scale object.
 * @private
 */
function _createScaleObjectForValue(attr, value, type, accessor, accessor0) {
  if (type === LITERAL_SCALE_TYPE) {
    return {
      type: LITERAL_SCALE_TYPE,
      domain: [],
      range: [value],
      distance: 0,
      attr: attr,
      baseValue: undefined,
      isValue: true,
      accessor: accessor,
      accessor0: accessor0
    };
  }
  if (typeof value === 'undefined') {
    return null;
  }
  return {
    type: CATEGORY_SCALE_TYPE,
    range: [value],
    domain: [],
    distance: 0,
    attr: attr,
    baseValue: undefined,
    isValue: true,
    accessor: accessor,
    accessor0: accessor0
  };
}

/**
 * Create a regular scale object for a further use from the existing parameters.
 * @param {Array} domain - Domain.
 * @param {Array} range - Range.
 * @param {string} type - Type.
 * @param {number} distance - Distance.
 * @param {string} attr - Attribute.
 * @param {number} baseValue - Base value.
 * @param {function} accessor - Attribute accesor
 * @param {function} accessor0 - Attribute accesor for potential naught value
 * @returns {Object} Scale object.
 * @private
 */
function _createScaleObjectForFunction(_ref) {
  var domain = _ref.domain,
      range$$1 = _ref.range,
      type = _ref.type,
      distance = _ref.distance,
      attr = _ref.attr,
      baseValue = _ref.baseValue,
      accessor = _ref.accessor,
      accessor0 = _ref.accessor0;

  return {
    domain: domain,
    range: range$$1,
    type: type,
    distance: distance,
    attr: attr,
    baseValue: baseValue,
    isValue: false,
    accessor: accessor,
    accessor0: accessor0
  };
}

/**
 * Get scale object from props. E. g. object like {xRange, xDomain, xDistance,
 * xType} is transformed into {range, domain, distance, type}.
 * @param {Object} props Props.
 * @param {string} attr Attribute.
 * @returns {*} Null or an object with the scale.
 * @private
 */
function _collectScaleObjectFromProps(props, attr) {
  var value = props[attr],
      fallbackValue = props['_' + attr + 'Value'],
      range$$1 = props[attr + 'Range'],
      _props$ = props[attr + 'Distance'],
      distance = _props$ === undefined ? 0 : _props$,
      baseValue = props[attr + 'BaseValue'],
      _props$2 = props[attr + 'Type'],
      type = _props$2 === undefined ? LINEAR_SCALE_TYPE : _props$2,
      noFallBack = props[attr + 'NoFallBack'],
      _props$3 = props['get' + toTitleCase(attr)],
      accessor = _props$3 === undefined ? function (d) {
    return d[attr];
  } : _props$3,
      _props$4 = props['get' + toTitleCase(attr) + '0'],
      accessor0 = _props$4 === undefined ? function (d) {
    return d[attr + '0'];
  } : _props$4;
  var domain = props[attr + 'Domain'];
  // Return value-based scale if the value is assigned.

  if (!noFallBack && typeof value !== 'undefined') {
    return _createScaleObjectForValue(attr, value, props[attr + 'Type'], accessor, accessor0);
  }
  // Pick up the domain from the properties and create a new one if it's not
  // available.
  if (typeof baseValue !== 'undefined') {
    domain = addValueToArray(domain, baseValue);
  }

  // Make sure that the minimum necessary properties exist.
  if (!range$$1 || !domain || !domain.length) {
    // Try to use the fallback value if it is available.
    return _createScaleObjectForValue(attr, fallbackValue, props[attr + 'Type'], accessor, accessor0);
  }

  return _createScaleObjectForFunction({
    domain: domain,
    range: range$$1,
    type: type,
    distance: distance,
    attr: attr,
    baseValue: baseValue,
    accessor: accessor,
    accessor0: accessor0
  });
}

/**
 * Compute left domain adjustment for the given values.
 * @param {Array} values Array of values.
 * @returns {number} Domain adjustment.
 * @private
 */
function _computeLeftDomainAdjustment(values$$1) {
  if (values$$1.length > 1) {
    return (values$$1[1] - values$$1[0]) / 2;
  }
  if (values$$1.length === 1) {
    return values$$1[0] - 0.5;
  }
  return 0;
}

/**
 * Compute right domain adjustment for the given values.
 * @param {Array} values Array of values.
 * @returns {number} Domain adjustment.
 * @private
 */
function _computeRightDomainAdjustment(values$$1) {
  if (values$$1.length > 1) {
    return (values$$1[values$$1.length - 1] - values$$1[values$$1.length - 2]) / 2;
  }
  if (values$$1.length === 1) {
    return values$$1[0] - 0.5;
  }
  return 0;
}

/**
 * Compute distance for the given values.
 * @param {Array} values Array of values.
 * @param {Array} domain Domain.
 * @param {number} bestDistIndex Index of a best distance found.
 * @param {function} scaleFn Scale function.
 * @returns {number} Domain adjustment.
 * @private
 */
function _computeScaleDistance(values$$1, domain, bestDistIndex, scaleFn) {
  if (values$$1.length > 1) {
    // Avoid zero indexes.
    var i = Math.max(bestDistIndex, 1);
    return Math.abs(scaleFn(values$$1[i]) - scaleFn(values$$1[i - 1]));
  }
  if (values$$1.length === 1) {
    return Math.abs(scaleFn(domain[1]) - scaleFn(domain[0]));
  }
  return 0;
}

/**
 * Normilize array of values with a single value.
 * @param {Array} arr Array of data.
 * @param {Array} values Array of values.
 * @param {string} attr Attribute.
 * @param {string} type Type.
 * @private
 */
function _normalizeValues(data, values$$1, accessor0, type) {
  if (type === TIME_SCALE_TYPE && values$$1.length === 1) {
    var attr0 = accessor0(data[0]);

    return [attr0].concat(_toConsumableArray(values$$1));
  }

  return values$$1;
}

/**
 * Get the distance, the smallest and the largest value of the domain.
 * @param {Array} data Array of data for the single series.
 * @param {Object} scaleObject Scale object.
 * @returns {{domain0: number, domainN: number, distance: number}} Result.
 * @private
 */
function _getScaleDistanceAndAdjustedDomain(data, scaleObject) {
  var domain = scaleObject.domain,
      type = scaleObject.type,
      accessor = scaleObject.accessor,
      accessor0 = scaleObject.accessor0;


  var uniqueValues = getUniquePropertyValues(data, accessor);

  // Fix time scale if a data has only one value.
  var values$$1 = _normalizeValues(data, uniqueValues, accessor0, type);
  var index = _getSmallestDistanceIndex(values$$1, scaleObject);

  var adjustedDomain = [].concat(domain);

  adjustedDomain[0] -= _computeLeftDomainAdjustment(values$$1);
  adjustedDomain[domain.length - 1] += _computeRightDomainAdjustment(values$$1);
  // Fix log scale if it's too small.
  if (type === LOG_SCALE_TYPE && domain[0] <= 0) {
    adjustedDomain[0] = Math.min(domain[1] / 10, 1);
  }

  var adjustedScaleFn = getScaleFnFromScaleObject(_extends$2({}, scaleObject, {
    domain: adjustedDomain
  }));

  var distance = _computeScaleDistance(values$$1, adjustedDomain, index, adjustedScaleFn);

  return {
    domain0: adjustedDomain[0],
    domainN: adjustedDomain[adjustedDomain.length - 1],
    distance: distance
  };
}

/**
 * Returns true if scale adjustments are possible for a given scale.
 * @param {Object} props Props.
 * @param {Object} scaleObject Scale object.
 * @returns {boolean} True if scale adjustments possible.
 * @private
 */
function _isScaleAdjustmentPossible(props, scaleObject) {
  var attr = scaleObject.attr;
  var _props$_adjustBy = props._adjustBy,
      adjustBy = _props$_adjustBy === undefined ? [] : _props$_adjustBy,
      _props$_adjustWhat = props._adjustWhat,
      adjustWhat = _props$_adjustWhat === undefined ? [] : _props$_adjustWhat;

  // The scale cannot be adjusted if there's no attributes to adjust, no
  // suitable values

  return adjustWhat.length && adjustBy.length && adjustBy.indexOf(attr) !== -1;
}

/**
 * Adjust continuous scales (e.g. 'linear', 'log' and 'time') by adding the
 * space from the left and right of them and by computing the best distance.
 * @param {Object} props Props.
 * @param {Object} scaleObject Scale object.
 * @returns {*} Scale object with adjustments.
 * @private
 */
function _adjustContinuousScale(props, scaleObject) {
  var allSeriesData = props._allData,
      _props$_adjustWhat2 = props._adjustWhat,
      adjustWhat = _props$_adjustWhat2 === undefined ? [] : _props$_adjustWhat2;

  // Assign the initial values.

  var domainLength = scaleObject.domain.length;
  var domain = scaleObject.domain;

  var scaleDomain0 = domain[0];
  var scaleDomainN = domain[domainLength - 1];
  var scaleDistance = scaleObject.distance;

  // Find the smallest left position of the domain, the largest right position
  // of the domain and the best distance for them.
  allSeriesData.forEach(function (data, index) {
    if (adjustWhat.indexOf(index) === -1) {
      return;
    }
    if (data && data.length) {
      var _getScaleDistanceAndA = _getScaleDistanceAndAdjustedDomain(data, scaleObject),
          domain0 = _getScaleDistanceAndA.domain0,
          domainN = _getScaleDistanceAndA.domainN,
          distance = _getScaleDistanceAndA.distance;

      scaleDomain0 = Math.min(scaleDomain0, domain0);
      scaleDomainN = Math.max(scaleDomainN, domainN);
      scaleDistance = Math.max(scaleDistance, distance);
    }
  });

  scaleObject.domain = [scaleDomain0].concat(_toConsumableArray(domain.slice(1, -1)), [scaleDomainN]);

  scaleObject.distance = scaleDistance;

  return scaleObject;
}

/**
 * Get an adjusted scale. Suitable for 'category' and 'ordinal' scales.
 * @param {Object} scaleObject Scale object.
 * @returns {*} Scale object with adjustments.
 * @private
 */
function _adjustCategoricalScale(scaleObject) {
  var scaleFn = getScaleFnFromScaleObject(scaleObject);
  var domain = scaleObject.domain,
      range$$1 = scaleObject.range;

  if (domain.length > 1) {
    scaleObject.distance = Math.abs(scaleFn(domain[1]) - scaleFn(domain[0]));
  } else {
    scaleObject.distance = Math.abs(range$$1[1] - range$$1[0]);
  }

  return scaleObject;
}

/**
 * Retrieve a scale object or a value from the properties passed.
 * @param {Object} props Object of props.
 * @param {string} attr Attribute.
 * @returns {*} Scale object, value or null.
 */
function getScaleObjectFromProps(props, attr) {
  // Create the initial scale object.
  var scaleObject = _collectScaleObjectFromProps(props, attr);
  if (!scaleObject) {
    return null;
  }

  // Make sure if it's possible to add space to the scale object. If not,
  // return the object immediately.
  if (!_isScaleAdjustmentPossible(props, scaleObject)) {
    return scaleObject;
  }

  var type = scaleObject.type;
  // Depending on what type the scale is, apply different adjustments. Distances
  // for the ordinal and category scales are even, equal domains cannot be
  // adjusted.

  if (type === ORDINAL_SCALE_TYPE || type === CATEGORY_SCALE_TYPE) {
    return _adjustCategoricalScale(scaleObject);
  }
  return _adjustContinuousScale(props, scaleObject);
}

/**
 * Get d3 scale for a given prop.
 * @param {Object} props Props.
 * @param {string} attr Attribute.
 * @returns {function} d3 scale function.
 */
function getAttributeScale(props, attr) {
  var scaleObject = getScaleObjectFromProps(props, attr);
  return getScaleFnFromScaleObject(scaleObject);
}

/**
 * Get the value of `attr` from the object.
 * @param {Object} d - data Object.
 * @param {Function} accessor - accessor function.
 * @returns {*} Value of the point.
 * @private
 */
function _getAttrValue(d, accessor) {
  return accessor(d.data ? d.data : d);
}

function _isDefined(value) {
  return typeof value !== 'undefined';
}

/*
 * Adds a percentage of padding to a given domain
 * @param {Array} domain X or Y domain to pad.
 * @param {Number} padding Percentage of padding to add to domain
 * @returns {Array} Padded Domain
 */
function _padDomain(domain, padding) {
  if (!domain) {
    return domain;
  }
  if (isNaN(parseFloat(domain[0])) || isNaN(parseFloat(domain[1]))) {
    return domain;
  }

  var _domain = _slicedToArray$1(domain, 2),
      min$$1 = _domain[0],
      max$$1 = _domain[1];

  var domainPadding = (max$$1 - min$$1) * (padding * 0.01);
  return [min$$1 - domainPadding, max$$1 + domainPadding];
}

/**
 * Get prop functor (either a value or a function) for a given attribute.
 * @param {Object} props Series props.
 * @param {Function} accessor - Property accessor.
 * @returns {*} Function or value.
 */
function getAttributeFunctor(props, attr) {
  var scaleObject = getScaleObjectFromProps(props, attr);
  if (scaleObject) {
    var scaleFn = getScaleFnFromScaleObject(scaleObject);
    return function (d) {
      return scaleFn(_getAttrValue(d, scaleObject.accessor));
    };
  }
  return null;
}

/**
 * Get the functor which extracts value form [attr]0 property. Use baseValue if
 * no attr0 property for a given object is defined. Fall back to domain[0] if no
 * base value is available.
 * @param {Object} props Object of props.
 * @param {string} attr Attribute name.
 * @returns {*} Function which returns value or null if no values available.
 */
function getAttr0Functor(props, attr) {
  var scaleObject = getScaleObjectFromProps(props, attr);
  if (scaleObject) {
    var domain = scaleObject.domain;
    var _scaleObject$baseValu = scaleObject.baseValue,
        baseValue = _scaleObject$baseValu === undefined ? domain[0] : _scaleObject$baseValu;

    var scaleFn = getScaleFnFromScaleObject(scaleObject);
    return function (d) {
      var value = _getAttrValue(d, scaleObject.accessor0);
      return scaleFn(_isDefined(value) ? value : baseValue);
    };
  }
  return null;
}

/**
 * Tries to get the string|number value of the attr and falls back to
 * a fallback property in case if the value is a scale.
 * @param {Object} props Series props.
 * @param {string} attr Property name.
 * @returns {*} Function or value.
 */
function getAttributeValue(props, attr) {
  var scaleObject = getScaleObjectFromProps(props, attr);
  if (scaleObject) {
    if (!scaleObject.isValue && props['_' + attr + 'Value'] === undefined) {
      warning('[React-vis] Cannot use data defined ' + attr + ' for this ' + 'series type. Using fallback value instead.');
    }
    return props['_' + attr + 'Value'] || scaleObject.range[0];
  }
  return null;
}

/**
 * Get prop types by the attribute.
 * @param {string} attr Attribute.
 * @returns {Object} Object of xDomain, xRange, xType, xDistance and _xValue,
 * where x is an attribute passed to the function.
 */
function getScalePropTypesByAttribute(attr) {
  var _ref2;

  return _ref2 = {}, _defineProperty(_ref2, '_' + attr + 'Value', propTypes.any), _defineProperty(_ref2, attr + 'Domain', propTypes.array), _defineProperty(_ref2, 'get' + toTitleCase(attr), propTypes.func), _defineProperty(_ref2, 'get' + toTitleCase(attr) + '0', propTypes.func), _defineProperty(_ref2, attr + 'Range', propTypes.array), _defineProperty(_ref2, attr + 'Type', propTypes.oneOf(Object.keys(SCALE_FUNCTIONS))), _defineProperty(_ref2, attr + 'Distance', propTypes.number), _defineProperty(_ref2, attr + 'BaseValue', propTypes.any), _ref2;
}

/**
 * Extract the list of scale properties from the entire props object.
 * @param {Object} props Props.
 * @param {Array<String>} attributes Array of attributes for the given
 * components (for instance, `['x', 'y', 'color']`).
 * @returns {Object} Collected props.
 */
function extractScalePropsFromProps(props, attributes) {
  var result = {};
  Object.keys(props).forEach(function (key) {
    // this filtering is critical for extracting the correct accessors!
    var attr = attributes.find(function (a) {
      // width
      var isPlainSet = key.indexOf(a) === 0;
      // Ex: _data
      var isUnderscoreSet = key.indexOf('_' + a) === 0;
      // EX: getX
      var usesGet = key.indexOf('get' + toTitleCase(a)) === 0;
      return isPlainSet || isUnderscoreSet || usesGet;
    });
    if (!attr) {
      return;
    }
    result[key] = props[key];
  });
  return result;
}

/**
 * Extract the missing scale props from the given data and return them as
 * an object.
 * @param {Object} props Props.
 * @param {Array} data Array of all data.
 * @param {Array<String>} attributes Array of attributes for the given
 * components (for instance, `['x', 'y', 'color']`).
 * @returns {Object} Collected props.
 */
function getMissingScaleProps(props, data, attributes) {
  var result = {};
  // Make sure that the domain is set pad it if specified
  attributes.forEach(function (attr) {
    if (!props['get' + toTitleCase(attr)]) {
      result['get' + toTitleCase(attr)] = function (d) {
        return d[attr];
      };
    }
    if (!props['get' + toTitleCase(attr) + '0']) {
      result['get' + toTitleCase(attr) + '0'] = function (d) {
        return d[attr + '0'];
      };
    }
    if (!props[attr + 'Domain']) {
      result[attr + 'Domain'] = getDomainByAccessor(data, props['get' + toTitleCase(attr)] || result['get' + toTitleCase(attr)], props['get' + toTitleCase(attr) + '0'] || result['get' + toTitleCase(attr) + '0'], props[attr + 'Type']);
      if (props[attr + 'Padding']) {
        result[attr + 'Domain'] = _padDomain(result[attr + 'Domain'], props[attr + 'Padding']);
      }
    }
  });

  return result;
}

/**
 * Return a d3 scale that returns the literal value that was given to it
 * @returns {function} literal scale.
 */
function literalScale(defaultValue) {
  function scale(d) {
    if (d === undefined) {
      return defaultValue;
    }
    return d;
  }

  function response() {
    return scale;
  }

  scale.domain = response;
  scale.range = response;
  scale.unknown = response;
  scale.copy = response;

  return scale;
}

function getFontColorFromBackground(background) {
  if (background) {
    return hsl(background).l > 0.57 ? '#222' : '#fff';
  }
  return null;
}

/**
 * Creates fallback values for series from scales defined at XYPlot level.
 * @param {Object} props Props of the XYPlot object.
 * @param {Array<Object>} children Array of components, children of XYPlot
 * @returns {Array<Object>} Collected props.
 */

function getXYPlotValues(props, children) {
  var XYPlotScales = XYPLOT_ATTR.reduce(function (prev, attr) {
    var domain = props[attr + 'Domain'],
        range$$1 = props[attr + 'Range'],
        type = props[attr + 'Type'];


    if (domain && range$$1 && type) {
      return _extends$2({}, prev, _defineProperty({}, attr, SCALE_FUNCTIONS[type]().domain(domain).range(range$$1)));
    }
    return prev;
  }, {});

  return children.map(function (child) {
    return XYPLOT_ATTR.reduce(function (prev, attr) {
      if (child.props && child.props[attr] !== undefined) {
        var scaleInput = child.props[attr];
        var scale = XYPlotScales[attr];
        var fallbackValue = scale ? scale(scaleInput) : scaleInput;
        return _extends$2({}, prev, _defineProperty({}, '_' + attr + 'Value', fallbackValue));
      }
      return prev;
    }, {});
  });
}

var OPTIONAL_SCALE_PROPS = ['Padding'];
var OPTIONAL_SCALE_PROPS_REGS = OPTIONAL_SCALE_PROPS.map(function (str) {
  return new RegExp(str + '$', 'i');
});
/**
 * Get the list of optional scale-related settings for XYPlot
 * mostly just used to find padding properties
 * @param {Object} props Object of props.
 * @returns {Object} Optional Props.
 * @private
 */
function getOptionalScaleProps(props) {
  return Object.keys(props).reduce(function (acc, prop) {
    var propIsNotOptional = OPTIONAL_SCALE_PROPS_REGS.every(function (reg) {
      return !prop.match(reg);
    });
    if (propIsNotOptional) {
      return acc;
    }
    acc[prop] = props[prop];
    return acc;
  }, {});
}

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes$2 = _extends$3({}, getScalePropTypesByAttribute('x'), getScalePropTypesByAttribute('y'), getScalePropTypesByAttribute('size'), getScalePropTypesByAttribute('opacity'), getScalePropTypesByAttribute('color'), {
  width: propTypes.number,
  height: propTypes.number,
  data: propTypes.arrayOf(propTypes.oneOfType([propTypes.object, propTypes.array])),
  onValueMouseOver: propTypes.func,
  onValueMouseOut: propTypes.func,
  onValueClick: propTypes.func,
  onValueRightClick: propTypes.func,
  onSeriesMouseOver: propTypes.func,
  onSeriesMouseOut: propTypes.func,
  onSeriesClick: propTypes.func,
  onSeriesRightClick: propTypes.func,
  onNearestX: propTypes.func,
  onNearestXY: propTypes.func,
  style: propTypes.object,
  animation: AnimationPropType,
  stack: propTypes.bool
});

var defaultProps = {
  className: '',
  stack: false,
  style: {}
};

var AbstractSeries = function (_PureComponent) {
  _inherits$1(AbstractSeries, _PureComponent);

  function AbstractSeries() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck$1(this, AbstractSeries);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn$1(this, (_ref = AbstractSeries.__proto__ || Object.getPrototypeOf(AbstractSeries)).call.apply(_ref, [this].concat(args))), _this), _this._seriesClickHandler = function (event) {
      var onSeriesClick = _this.props.onSeriesClick;

      if (onSeriesClick) {
        onSeriesClick({ event: event });
      }
    }, _this._seriesMouseOutHandler = function (event) {
      var onSeriesMouseOut = _this.props.onSeriesMouseOut;

      if (onSeriesMouseOut) {
        onSeriesMouseOut({ event: event });
      }
    }, _this._seriesMouseOverHandler = function (event) {
      var onSeriesMouseOver = _this.props.onSeriesMouseOver;

      if (onSeriesMouseOver) {
        onSeriesMouseOver({ event: event });
      }
    }, _this._seriesRightClickHandler = function (event) {
      var onSeriesRightClick = _this.props.onSeriesRightClick;

      if (onSeriesRightClick) {
        onSeriesRightClick({ event: event });
      }
    }, _this._valueClickHandler = function (d, event) {
      var _this$props = _this.props,
          onValueClick = _this$props.onValueClick,
          onSeriesClick = _this$props.onSeriesClick;

      if (onValueClick) {
        onValueClick(d, { event: event });
      }
      if (onSeriesClick) {
        onSeriesClick({ event: event });
      }
    }, _this._valueMouseOutHandler = function (d, event) {
      var _this$props2 = _this.props,
          onValueMouseOut = _this$props2.onValueMouseOut,
          onSeriesMouseOut = _this$props2.onSeriesMouseOut;

      if (onValueMouseOut) {
        onValueMouseOut(d, { event: event });
      }
      if (onSeriesMouseOut) {
        onSeriesMouseOut({ event: event });
      }
    }, _this._valueMouseOverHandler = function (d, event) {
      var _this$props3 = _this.props,
          onValueMouseOver = _this$props3.onValueMouseOver,
          onSeriesMouseOver = _this$props3.onSeriesMouseOver;

      if (onValueMouseOver) {
        onValueMouseOver(d, { event: event });
      }
      if (onSeriesMouseOver) {
        onSeriesMouseOver({ event: event });
      }
    }, _this._valueRightClickHandler = function (d, event) {
      var _this$props4 = _this.props,
          onValueRightClick = _this$props4.onValueRightClick,
          onSeriesRightClick = _this$props4.onSeriesRightClick;

      if (onValueRightClick) {
        onValueRightClick(d, { event: event });
      }
      if (onSeriesRightClick) {
        onSeriesRightClick({ event: event });
      }
    }, _temp), _possibleConstructorReturn$1(_this, _ret);
  }

  _createClass$1(AbstractSeries, [{
    key: 'onParentMouseMove',
    value: function onParentMouseMove(event) {
      var _props = this.props,
          onNearestX = _props.onNearestX,
          onNearestXY = _props.onNearestXY,
          data = _props.data;

      if (!onNearestX && !onNearestXY || !data) {
        return;
      }
      if (onNearestXY) {
        this._handleNearestXY(event);
      } else {
        this._handleNearestX(event);
      }
    }
  }, {
    key: 'onParentTouchMove',
    value: function onParentTouchMove(e) {
      e.preventDefault();
      this.onParentMouseMove(e);
    }
  }, {
    key: 'onParentTouchStart',
    value: function onParentTouchStart(e) {
      // prevent mouse event emulation
      e.preventDefault();
    }

    /**
     * Get the attr0 functor.
     * @param {string} attr Attribute name.
     * @returns {*} Functor.
     * @private
     */

  }, {
    key: '_getAttr0Functor',
    value: function _getAttr0Functor(attr) {
      return getAttr0Functor(this.props, attr);
    }

    /**
     * Get attribute functor.
     * @param {string} attr Attribute name
     * @returns {*} Functor.
     * @protected
     */

  }, {
    key: '_getAttributeFunctor',
    value: function _getAttributeFunctor(attr) {
      return getAttributeFunctor(this.props, attr);
    }

    /**
     * Get the attribute value if it is available.
     * @param {string} attr Attribute name.
     * @returns {*} Attribute value if available, fallback value or undefined
     * otherwise.
     * @protected
     */

  }, {
    key: '_getAttributeValue',
    value: function _getAttributeValue(attr) {
      return getAttributeValue(this.props, attr);
    }

    /**
     * Get the scale object distance by the attribute from the list of properties.
     * @param {string} attr Attribute name.
     * @returns {number} Scale distance.
     * @protected
     */

  }, {
    key: '_getScaleDistance',
    value: function _getScaleDistance(attr) {
      var scaleObject = getScaleObjectFromProps(this.props, attr);
      return scaleObject ? scaleObject.distance : 0;
    }
  }, {
    key: '_getXYCoordinateInContainer',
    value: function _getXYCoordinateInContainer(event) {
      var _props2 = this.props,
          _props2$marginTop = _props2.marginTop,
          marginTop = _props2$marginTop === undefined ? 0 : _props2$marginTop,
          _props2$marginLeft = _props2.marginLeft,
          marginLeft = _props2$marginLeft === undefined ? 0 : _props2$marginLeft;
      var evt = event.nativeEvent,
          currentTarget = event.currentTarget;

      var rect = currentTarget.getBoundingClientRect();
      var x = evt.clientX;
      var y = evt.clientY;
      if (evt.type === 'touchmove') {
        x = evt.touches[0].pageX;
        y = evt.touches[0].pageY;
      }
      return {
        x: x - rect.left - currentTarget.clientLeft - marginLeft,
        y: y - rect.top - currentTarget.clientTop - marginTop
      };
    }
  }, {
    key: '_handleNearestX',
    value: function _handleNearestX(event) {
      var _props3 = this.props,
          onNearestX = _props3.onNearestX,
          data = _props3.data;

      var minDistance = Number.POSITIVE_INFINITY;
      var value = null;
      var valueIndex = null;

      var coordinate = this._getXYCoordinateInContainer(event);
      var xScaleFn = this._getAttributeFunctor('x');

      data.forEach(function (item, i) {
        var currentCoordinate = xScaleFn(item);
        var newDistance = Math.abs(coordinate.x - currentCoordinate);
        if (newDistance < minDistance) {
          minDistance = newDistance;
          value = item;
          valueIndex = i;
        }
      });
      if (!value) {
        return;
      }
      onNearestX(value, {
        innerX: xScaleFn(value),
        index: valueIndex,
        event: event.nativeEvent
      });
    }
  }, {
    key: '_handleNearestXY',
    value: function _handleNearestXY(event) {
      var _props4 = this.props,
          onNearestXY = _props4.onNearestXY,
          data = _props4.data;


      var coordinate = this._getXYCoordinateInContainer(event);
      var xScaleFn = this._getAttributeFunctor('x');
      var yScaleFn = this._getAttributeFunctor('y');

      // Create a voronoi with each node center points
      var voronoiInstance = voronoi().x(xScaleFn).y(yScaleFn);

      var foundPoint = voronoiInstance(data).find(coordinate.x, coordinate.y);
      var value = foundPoint.data;

      if (!value) {
        return;
      }
      onNearestXY(value, {
        innerX: foundPoint.x,
        innerY: foundPoint.y,
        index: foundPoint.index,
        event: event.nativeEvent
      });
    }

    /**
     * Click handler for the entire series.
     * @param {Object} event Event.
     * @protected
     */


    /**
     * Mouse out handler for the entire series.
     * @param {Object} event Event.
     * @protected
     */


    /**
     * Mouse over handler for the entire series.
     * @param {Object} event Event.
     * @protected
     */


    /**
     * Right Click handler for the entire series.
     * @param {Object} event Event.
     * @protected
     */


    /**
     * Click handler for the specific series' value.
     * @param {Object} d Value object
     * @param {Object} event Event.
     * @protected
     */


    /**
     * Mouse out handler for the specific series' value.
     * @param {Object} d Value object
     * @param {Object} event Event.
     * @protected
     */


    /**
     * Mouse over handler for the specific series' value.
     * @param {Object} d Value object
     * @param {Object} event Event.
     * @protected
     */


    /**
     * Right Click handler for the specific series' value.
     * @param {Object} d Value object
     * @param {Object} event Event.
     * @protected
     */

  }], [{
    key: 'getParentConfig',

    /**
     * Get a default config for the parent.
     * @returns {Object} Empty config.
     */
    value: function getParentConfig() {
      return {};
    }

    /**
     * Tells the rest of the world that it requires SVG to work.
     * @returns {boolean} Result.
     */

  }, {
    key: 'requiresSVG',
    get: function get() {
      return true;
    }
  }]);

  return AbstractSeries;
}(react_1);

AbstractSeries.displayName = 'AbstractSeries';
AbstractSeries.propTypes = propTypes$2;
AbstractSeries.defaultProps = defaultProps;

var pi = Math.PI,
    tau = 2 * pi,
    epsilon$1 = 1e-6,
    tauEpsilon = tau - epsilon$1;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath
  this._ = "";
}

function path() {
  return new Path;
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function(x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function(x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function(x1, y1, x, y) {
    this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
    this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon$1));

    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
    // Equivalently, is (x1,y1) coincident with (x2,y2)?
    // Or, is the radius zero? Line to (x1,y1).
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Otherwise, draw an arc!
    else {
      var x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon$1) {
        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
      }

      this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
    }
  },
  arc: function(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
      this._ += "L" + x0 + "," + y0;
    }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon$1) {
      this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
    }
  },
  rect: function(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
  },
  toString: function() {
    return this._;
  }
};

function constant$4(x) {
  return function constant() {
    return x;
  };
}

var abs = Math.abs;
var atan2 = Math.atan2;
var cos = Math.cos;
var max$1 = Math.max;
var min$1 = Math.min;
var sin = Math.sin;
var sqrt$1 = Math.sqrt;

var epsilon$2 = 1e-12;
var pi$1 = Math.PI;
var halfPi = pi$1 / 2;
var tau$1 = 2 * pi$1;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi$1 : Math.acos(x);
}

function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0, y10 = y1 - y0,
      x32 = x3 - x2, y32 = y3 - y2,
      t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
  return [x0 + t * x10, y0 + t * y10];
}

// Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / sqrt$1(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * sqrt$1(max$1(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00;

  // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

function arcBuilder() {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = constant$4(0),
      padRadius = null,
      startAngle = arcStartAngle,
      endAngle = arcEndAngle,
      padAngle = arcPadAngle,
      context = null;

  function arc() {
    var buffer,
        r,
        r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - halfPi,
        a1 = endAngle.apply(this, arguments) - halfPi,
        da = abs(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = path();

    // Ensure that the outer radius is always larger than the inner radius.
    if (r1 < r0) r = r1, r1 = r0, r0 = r;

    // Is it a point?
    if (!(r1 > epsilon$2)) context.moveTo(0, 0);

    // Or is it a circle or annulus?
    else if (da > tau$1 - epsilon$2) {
      context.moveTo(r1 * cos(a0), r1 * sin(a0));
      context.arc(0, 0, r1, a0, a1, !cw);
      if (r0 > epsilon$2) {
        context.moveTo(r0 * cos(a1), r0 * sin(a1));
        context.arc(0, 0, r0, a1, a0, cw);
      }
    }

    // Or is it a circular or annular sector?
    else {
      var a01 = a0,
          a11 = a1,
          a00 = a0,
          a10 = a1,
          da0 = da,
          da1 = da,
          ap = padAngle.apply(this, arguments) / 2,
          rp = (ap > epsilon$2) && (padRadius ? +padRadius.apply(this, arguments) : sqrt$1(r0 * r0 + r1 * r1)),
          rc = min$1(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
          rc0 = rc,
          rc1 = rc,
          t0,
          t1;

      // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
      if (rp > epsilon$2) {
        var p0 = asin(rp / r0 * sin(ap)),
            p1 = asin(rp / r1 * sin(ap));
        if ((da0 -= p0 * 2) > epsilon$2) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
        else da0 = 0, a00 = a10 = (a0 + a1) / 2;
        if ((da1 -= p1 * 2) > epsilon$2) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
        else da1 = 0, a01 = a11 = (a0 + a1) / 2;
      }

      var x01 = r1 * cos(a01),
          y01 = r1 * sin(a01),
          x10 = r0 * cos(a10),
          y10 = r0 * sin(a10);

      // Apply rounded corners?
      if (rc > epsilon$2) {
        var x11 = r1 * cos(a11),
            y11 = r1 * sin(a11),
            x00 = r0 * cos(a00),
            y00 = r0 * sin(a00);

        // Restrict the corner radius according to the sector angle.
        if (da < pi$1) {
          var oc = da0 > epsilon$2 ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
              ax = x01 - oc[0],
              ay = y01 - oc[1],
              bx = x11 - oc[0],
              by = y11 - oc[1],
              kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt$1(ax * ax + ay * ay) * sqrt$1(bx * bx + by * by))) / 2),
              lc = sqrt$1(oc[0] * oc[0] + oc[1] * oc[1]);
          rc0 = min$1(rc, (r0 - lc) / (kc - 1));
          rc1 = min$1(rc, (r1 - lc) / (kc + 1));
        }
      }

      // Is the sector collapsed to a line?
      if (!(da1 > epsilon$2)) context.moveTo(x01, y01);

      // Does the sector’s outer ring have rounded corners?
      else if (rc1 > epsilon$2) {
        t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
        t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

        context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
          context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the outer ring just a circular arc?
      else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

      // Is there no inner ring, and it’s a circular sector?
      // Or perhaps it’s an annular sector collapsed due to padding?
      if (!(r0 > epsilon$2) || !(da0 > epsilon$2)) context.lineTo(x10, y10);

      // Does the sector’s inner ring (or point) have rounded corners?
      else if (rc0 > epsilon$2) {
        t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
        t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

        context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
          context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the inner ring just a circular arc?
      else context.arc(0, 0, r0, a10, a00, cw);
    }

    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  arc.centroid = function() {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$1 / 2;
    return [cos(a) * r, sin(a) * r];
  };

  arc.innerRadius = function(_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : innerRadius;
  };

  arc.outerRadius = function(_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function(_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$4(+_), arc) : cornerRadius;
  };

  arc.padRadius = function(_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), arc) : padRadius;
  };

  arc.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : startAngle;
  };

  arc.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : endAngle;
  };

  arc.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$4(+_), arc) : padAngle;
  };

  arc.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), arc) : context;
  };

  return arc;
}

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // proceed
      default: this._context.lineTo(x, y); break;
    }
  }
};

function curveLinear(context) {
  return new Linear(context);
}

function x$2(p) {
  return p[0];
}

function y$2(p) {
  return p[1];
}

function line() {
  var x$$1 = x$2,
      y$$1 = y$2,
      defined = constant$4(true),
      context = null,
      curve = curveLinear,
      output = null;

  function line(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();
        else output.lineEnd();
      }
      if (defined0) output.point(+x$$1(d, i, data), +y$$1(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function(_) {
    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$4(+_), line) : x$$1;
  };

  line.y = function(_) {
    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$4(+_), line) : y$$1;
  };

  line.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$4(!!_), line) : defined;
  };

  line.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
}

function area() {
  var x0 = x$2,
      x1 = null,
      y0 = constant$4(0),
      y1 = y$2,
      defined = constant$4(true),
      context = null,
      curve = curveLinear,
      output = null;

  function area(data) {
    var i,
        j,
        k,
        n = data.length,
        d,
        defined0 = false,
        buffer,
        x0z = new Array(n),
        y0z = new Array(n);

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) {
          j = i;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();
          for (k = i - 1; k >= j; --k) {
            output.point(x0z[k], y0z[k]);
          }
          output.lineEnd();
          output.areaEnd();
        }
      }
      if (defined0) {
        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
      }
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  function arealine() {
    return line().defined(defined).curve(curve).context(context);
  }

  area.x = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$4(+_), x1 = null, area) : x0;
  };

  area.x0 = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$4(+_), area) : x0;
  };

  area.x1 = function(_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), area) : x1;
  };

  area.y = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$4(+_), y1 = null, area) : y0;
  };

  area.y0 = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$4(+_), area) : y0;
  };

  area.y1 = function(_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), area) : y1;
  };

  area.lineX0 =
  area.lineY0 = function() {
    return arealine().x(x0).y(y0);
  };

  area.lineY1 = function() {
    return arealine().x(x0).y(y1);
  };

  area.lineX1 = function() {
    return arealine().x(x1).y(y0);
  };

  area.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$4(!!_), area) : defined;
  };

  area.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };

  area.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };

  return area;
}

function descending$1(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

function identity$4(d) {
  return d;
}

function pieBuilder() {
  var value = identity$4,
      sortValues = descending$1,
      sort = null,
      startAngle = constant$4(0),
      endAngle = constant$4(tau$1),
      padAngle = constant$4(0);

  function pie(data) {
    var i,
        n = data.length,
        j,
        k,
        sum = 0,
        index = new Array(n),
        arcs = new Array(n),
        a0 = +startAngle.apply(this, arguments),
        da = Math.min(tau$1, Math.max(-tau$1, endAngle.apply(this, arguments) - a0)),
        a1,
        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
        pa = p * (da < 0 ? -1 : 1),
        v;

    for (i = 0; i < n; ++i) {
      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    }

    // Optionally sort the arcs by previously-computed values or by data.
    if (sortValues != null) index.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
    else if (sort != null) index.sort(function(i, j) { return sort(data[i], data[j]); });

    // Compute the arcs! They are stored in the original data's order.
    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }

    return arcs;
  }

  pie.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant$4(+_), pie) : value;
  };

  pie.sortValues = function(_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };

  pie.sort = function(_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };

  pie.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : startAngle;
  };

  pie.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : endAngle;
  };

  pie.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$4(+_), pie) : padAngle;
  };

  return pie;
}

var curveRadialLinear = curveRadial(curveLinear);

function Radial(curve) {
  this._curve = curve;
}

Radial.prototype = {
  areaStart: function() {
    this._curve.areaStart();
  },
  areaEnd: function() {
    this._curve.areaEnd();
  },
  lineStart: function() {
    this._curve.lineStart();
  },
  lineEnd: function() {
    this._curve.lineEnd();
  },
  point: function(a, r) {
    this._curve.point(r * Math.sin(a), r * -Math.cos(a));
  }
};

function curveRadial(curve) {

  function radial(context) {
    return new Radial(curve(context));
  }

  radial._curve = curve;

  return radial;
}

function lineRadial(l) {
  var c = l.curve;

  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;

  l.curve = function(_) {
    return arguments.length ? c(curveRadial(_)) : c()._curve;
  };

  return l;
}

function lineRadial$1() {
  return lineRadial(line().curve(curveRadialLinear));
}

function areaRadial() {
  var a = area().curve(curveRadialLinear),
      c = a.curve,
      x0 = a.lineX0,
      x1 = a.lineX1,
      y0 = a.lineY0,
      y1 = a.lineY1;

  a.angle = a.x, delete a.x;
  a.startAngle = a.x0, delete a.x0;
  a.endAngle = a.x1, delete a.x1;
  a.radius = a.y, delete a.y;
  a.innerRadius = a.y0, delete a.y0;
  a.outerRadius = a.y1, delete a.y1;
  a.lineStartAngle = function() { return lineRadial(x0()); }, delete a.lineX0;
  a.lineEndAngle = function() { return lineRadial(x1()); }, delete a.lineX1;
  a.lineInnerRadius = function() { return lineRadial(y0()); }, delete a.lineY0;
  a.lineOuterRadius = function() { return lineRadial(y1()); }, delete a.lineY1;

  a.curve = function(_) {
    return arguments.length ? c(curveRadial(_)) : c()._curve;
  };

  return a;
}

function pointRadial(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

var slice$2 = Array.prototype.slice;

function linkSource(d) {
  return d.source;
}

function linkTarget(d) {
  return d.target;
}

function link(curve) {
  var source = linkSource,
      target = linkTarget,
      x$$1 = x$2,
      y$$1 = y$2,
      context = null;

  function link() {
    var buffer, argv = slice$2.call(arguments), s = source.apply(this, argv), t = target.apply(this, argv);
    if (!context) context = buffer = path();
    curve(context, +x$$1.apply(this, (argv[0] = s, argv)), +y$$1.apply(this, argv), +x$$1.apply(this, (argv[0] = t, argv)), +y$$1.apply(this, argv));
    if (buffer) return context = null, buffer + "" || null;
  }

  link.source = function(_) {
    return arguments.length ? (source = _, link) : source;
  };

  link.target = function(_) {
    return arguments.length ? (target = _, link) : target;
  };

  link.x = function(_) {
    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$4(+_), link) : x$$1;
  };

  link.y = function(_) {
    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$4(+_), link) : y$$1;
  };

  link.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), link) : context;
  };

  return link;
}

function curveHorizontal(context, x0, y0, x1, y1) {
  context.moveTo(x0, y0);
  context.bezierCurveTo(x0 = (x0 + x1) / 2, y0, x0, y1, x1, y1);
}

function curveVertical(context, x0, y0, x1, y1) {
  context.moveTo(x0, y0);
  context.bezierCurveTo(x0, y0 = (y0 + y1) / 2, x1, y0, x1, y1);
}

function curveRadial$1(context, x0, y0, x1, y1) {
  var p0 = pointRadial(x0, y0),
      p1 = pointRadial(x0, y0 = (y0 + y1) / 2),
      p2 = pointRadial(x1, y0),
      p3 = pointRadial(x1, y1);
  context.moveTo(p0[0], p0[1]);
  context.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
}

function linkHorizontal() {
  return link(curveHorizontal);
}

function linkVertical() {
  return link(curveVertical);
}

function linkRadial() {
  var l = link(curveRadial$1);
  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;
  return l;
}

var circle = {
  draw: function(context, size) {
    var r = Math.sqrt(size / pi$1);
    context.moveTo(r, 0);
    context.arc(0, 0, r, 0, tau$1);
  }
};

var cross$1 = {
  draw: function(context, size) {
    var r = Math.sqrt(size / 5) / 2;
    context.moveTo(-3 * r, -r);
    context.lineTo(-r, -r);
    context.lineTo(-r, -3 * r);
    context.lineTo(r, -3 * r);
    context.lineTo(r, -r);
    context.lineTo(3 * r, -r);
    context.lineTo(3 * r, r);
    context.lineTo(r, r);
    context.lineTo(r, 3 * r);
    context.lineTo(-r, 3 * r);
    context.lineTo(-r, r);
    context.lineTo(-3 * r, r);
    context.closePath();
  }
};

var tan30 = Math.sqrt(1 / 3),
    tan30_2 = tan30 * 2;

var diamond = {
  draw: function(context, size) {
    var y = Math.sqrt(size / tan30_2),
        x = y * tan30;
    context.moveTo(0, -y);
    context.lineTo(x, 0);
    context.lineTo(0, y);
    context.lineTo(-x, 0);
    context.closePath();
  }
};

var ka = 0.89081309152928522810,
    kr = Math.sin(pi$1 / 10) / Math.sin(7 * pi$1 / 10),
    kx = Math.sin(tau$1 / 10) * kr,
    ky = -Math.cos(tau$1 / 10) * kr;

var star = {
  draw: function(context, size) {
    var r = Math.sqrt(size * ka),
        x = kx * r,
        y = ky * r;
    context.moveTo(0, -r);
    context.lineTo(x, y);
    for (var i = 1; i < 5; ++i) {
      var a = tau$1 * i / 5,
          c = Math.cos(a),
          s = Math.sin(a);
      context.lineTo(s * r, -c * r);
      context.lineTo(c * x - s * y, s * x + c * y);
    }
    context.closePath();
  }
};

var square = {
  draw: function(context, size) {
    var w = Math.sqrt(size),
        x = -w / 2;
    context.rect(x, x, w, w);
  }
};

var sqrt3 = Math.sqrt(3);

var triangle = {
  draw: function(context, size) {
    var y = -Math.sqrt(size / (sqrt3 * 3));
    context.moveTo(0, y * 2);
    context.lineTo(-sqrt3 * y, -y);
    context.lineTo(sqrt3 * y, -y);
    context.closePath();
  }
};

var c = -0.5,
    s = Math.sqrt(3) / 2,
    k = 1 / Math.sqrt(12),
    a = (k / 2 + 1) * 3;

var wye = {
  draw: function(context, size) {
    var r = Math.sqrt(size / a),
        x0 = r / 2,
        y0 = r * k,
        x1 = x0,
        y1 = r * k + r,
        x2 = -x1,
        y2 = y1;
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
    context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
    context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
    context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
    context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
    context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
    context.closePath();
  }
};

var symbols = [
  circle,
  cross$1,
  diamond,
  square,
  star,
  triangle,
  wye
];

function symbol() {
  var type = constant$4(circle),
      size = constant$4(64),
      context = null;

  function symbol() {
    var buffer;
    if (!context) context = buffer = path();
    type.apply(this, arguments).draw(context, +size.apply(this, arguments));
    if (buffer) return context = null, buffer + "" || null;
  }

  symbol.type = function(_) {
    return arguments.length ? (type = typeof _ === "function" ? _ : constant$4(_), symbol) : type;
  };

  symbol.size = function(_) {
    return arguments.length ? (size = typeof _ === "function" ? _ : constant$4(+_), symbol) : size;
  };

  symbol.context = function(_) {
    return arguments.length ? (context = _ == null ? null : _, symbol) : context;
  };

  return symbol;
}

function noop$1() {}

function point$1(that, x, y) {
  that._context.bezierCurveTo(
    (2 * that._x0 + that._x1) / 3,
    (2 * that._y0 + that._y1) / 3,
    (that._x0 + 2 * that._x1) / 3,
    (that._y0 + 2 * that._y1) / 3,
    (that._x0 + 4 * that._x1 + x) / 6,
    (that._y0 + 4 * that._y1 + y) / 6
  );
}

function Basis(context) {
  this._context = context;
}

Basis.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 =
    this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3: point$1(this, this._x1, this._y1); // proceed
      case 2: this._context.lineTo(this._x1, this._y1); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
      default: point$1(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function basis$2(context) {
  return new Basis(context);
}

function BasisClosed(context) {
  this._context = context;
}

BasisClosed.prototype = {
  areaStart: noop$1,
  areaEnd: noop$1,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 =
    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);
        this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2);
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._x2 = x, this._y2 = y; break;
      case 1: this._point = 2; this._x3 = x, this._y3 = y; break;
      case 2: this._point = 3; this._x4 = x, this._y4 = y; this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6); break;
      default: point$1(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function basisClosed$1(context) {
  return new BasisClosed(context);
}

function BasisOpen(context) {
  this._context = context;
}

BasisOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 =
    this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; var x0 = (this._x0 + 4 * this._x1 + x) / 6, y0 = (this._y0 + 4 * this._y1 + y) / 6; this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0); break;
      case 3: this._point = 4; // proceed
      default: point$1(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function basisOpen(context) {
  return new BasisOpen(context);
}

function Bundle(context, beta) {
  this._basis = new Basis(context);
  this._beta = beta;
}

Bundle.prototype = {
  lineStart: function() {
    this._x = [];
    this._y = [];
    this._basis.lineStart();
  },
  lineEnd: function() {
    var x = this._x,
        y = this._y,
        j = x.length - 1;

    if (j > 0) {
      var x0 = x[0],
          y0 = y[0],
          dx = x[j] - x0,
          dy = y[j] - y0,
          i = -1,
          t;

      while (++i <= j) {
        t = i / j;
        this._basis.point(
          this._beta * x[i] + (1 - this._beta) * (x0 + t * dx),
          this._beta * y[i] + (1 - this._beta) * (y0 + t * dy)
        );
      }
    }

    this._x = this._y = null;
    this._basis.lineEnd();
  },
  point: function(x, y) {
    this._x.push(+x);
    this._y.push(+y);
  }
};

var bundle = (function custom(beta) {

  function bundle(context) {
    return beta === 1 ? new Basis(context) : new Bundle(context, beta);
  }

  bundle.beta = function(beta) {
    return custom(+beta);
  };

  return bundle;
})(0.85);

function point$2(that, x, y) {
  that._context.bezierCurveTo(
    that._x1 + that._k * (that._x2 - that._x0),
    that._y1 + that._k * (that._y2 - that._y0),
    that._x2 + that._k * (that._x1 - x),
    that._y2 + that._k * (that._y1 - y),
    that._x2,
    that._y2
  );
}

function Cardinal(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

Cardinal.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x2, this._y2); break;
      case 3: point$2(this, this._x1, this._y1); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
      case 2: this._point = 3; // proceed
      default: point$2(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var cardinal = (function custom(tension) {

  function cardinal(context) {
    return new Cardinal(context, tension);
  }

  cardinal.tension = function(tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);

function CardinalClosed(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalClosed.prototype = {
  areaStart: noop$1,
  areaEnd: noop$1,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
      case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
      case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
      default: point$2(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var cardinalClosed = (function custom(tension) {

  function cardinal$$1(context) {
    return new CardinalClosed(context, tension);
  }

  cardinal$$1.tension = function(tension) {
    return custom(+tension);
  };

  return cardinal$$1;
})(0);

function CardinalOpen(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
      case 3: this._point = 4; // proceed
      default: point$2(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var cardinalOpen = (function custom(tension) {

  function cardinal$$1(context) {
    return new CardinalOpen(context, tension);
  }

  cardinal$$1.tension = function(tension) {
    return custom(+tension);
  };

  return cardinal$$1;
})(0);

function point$3(that, x, y) {
  var x1 = that._x1,
      y1 = that._y1,
      x2 = that._x2,
      y2 = that._y2;

  if (that._l01_a > epsilon$2) {
    var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
        n = 3 * that._l01_a * (that._l01_a + that._l12_a);
    x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
    y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
  }

  if (that._l23_a > epsilon$2) {
    var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
        m = 3 * that._l23_a * (that._l23_a + that._l12_a);
    x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
    y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
  }

  that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
}

function CatmullRom(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRom.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a =
    this._l01_2a = this._l12_2a = this._l23_2a =
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x2, this._y2); break;
      case 3: this.point(this._x2, this._y2); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; // proceed
      default: point$3(this, x, y); break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var catmullRom = (function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
  }

  catmullRom.alpha = function(alpha) {
    return custom(+alpha);
  };

  return catmullRom;
})(0.5);

function CatmullRomClosed(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomClosed.prototype = {
  areaStart: noop$1,
  areaEnd: noop$1,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._l01_a = this._l12_a = this._l23_a =
    this._l01_2a = this._l12_2a = this._l23_2a =
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
      case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
      case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
      default: point$3(this, x, y); break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var catmullRomClosed = (function custom(alpha) {

  function catmullRom$$1(context) {
    return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
  }

  catmullRom$$1.alpha = function(alpha) {
    return custom(+alpha);
  };

  return catmullRom$$1;
})(0.5);

function CatmullRomOpen(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a =
    this._l01_2a = this._l12_2a = this._l23_2a =
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0: this._point = 1; break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
      case 3: this._point = 4; // proceed
      default: point$3(this, x, y); break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var catmullRomOpen = (function custom(alpha) {

  function catmullRom$$1(context) {
    return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
  }

  catmullRom$$1.alpha = function(alpha) {
    return custom(+alpha);
  };

  return catmullRom$$1;
})(0.5);

function LinearClosed(context) {
  this._context = context;
}

LinearClosed.prototype = {
  areaStart: noop$1,
  areaEnd: noop$1,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._point) this._context.closePath();
  },
  point: function(x, y) {
    x = +x, y = +y;
    if (this._point) this._context.lineTo(x, y);
    else this._point = 1, this._context.moveTo(x, y);
  }
};

function linearClosed(context) {
  return new LinearClosed(context);
}

function sign(x) {
  return x < 0 ? -1 : 1;
}

// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0,
      h1 = x2 - that._x1,
      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
      p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}

// Calculate a one-sided slope.
function slope2(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}

// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
function point$4(that, t0, t1) {
  var x0 = that._x0,
      y0 = that._y0,
      x1 = that._x1,
      y1 = that._y1,
      dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 =
    this._y0 = this._y1 =
    this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x1, this._y1); break;
      case 3: point$4(this, this._t0, slope2(this, this._t0)); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    var t1 = NaN;

    x = +x, y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; point$4(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
      default: point$4(this, this._t0, t1 = slope3(this, x, y)); break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
    this._t0 = t1;
  }
};

function MonotoneY(context) {
  this._context = new ReflectContext(context);
}

(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
  MonotoneX.prototype.point.call(this, y, x);
};

function ReflectContext(context) {
  this._context = context;
}

ReflectContext.prototype = {
  moveTo: function(x, y) { this._context.moveTo(y, x); },
  closePath: function() { this._context.closePath(); },
  lineTo: function(x, y) { this._context.lineTo(y, x); },
  bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
};

function monotoneX(context) {
  return new MonotoneX(context);
}

function monotoneY(context) {
  return new MonotoneY(context);
}

function Natural(context) {
  this._context = context;
}

Natural.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [];
    this._y = [];
  },
  lineEnd: function() {
    var x = this._x,
        y = this._y,
        n = x.length;

    if (n) {
      this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
      if (n === 2) {
        this._context.lineTo(x[1], y[1]);
      } else {
        var px = controlPoints(x),
            py = controlPoints(y);
        for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
          this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
        }
      }
    }

    if (this._line || (this._line !== 0 && n === 1)) this._context.closePath();
    this._line = 1 - this._line;
    this._x = this._y = null;
  },
  point: function(x, y) {
    this._x.push(+x);
    this._y.push(+y);
  }
};

// See https://www.particleincell.com/2012/bezier-splines/ for derivation.
function controlPoints(x) {
  var i,
      n = x.length - 1,
      m,
      a = new Array(n),
      b = new Array(n),
      r = new Array(n);
  a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
  for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
  a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
  for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
  a[n - 1] = r[n - 1] / b[n - 1];
  for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
  b[n - 1] = (x[n] + a[n - 1]) / 2;
  for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
  return [a, b];
}

function natural(context) {
  return new Natural(context);
}

function Step(context, t) {
  this._context = context;
  this._t = t;
}

Step.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; // proceed
      default: {
        if (this._t <= 0) {
          this._context.lineTo(this._x, y);
          this._context.lineTo(x, y);
        } else {
          var x1 = this._x * (1 - this._t) + x * this._t;
          this._context.lineTo(x1, this._y);
          this._context.lineTo(x1, y);
        }
        break;
      }
    }
    this._x = x, this._y = y;
  }
};

function step(context) {
  return new Step(context, 0.5);
}

function stepBefore(context) {
  return new Step(context, 0);
}

function stepAfter(context) {
  return new Step(context, 1);
}

function none(series, order) {
  if (!((n = series.length) > 1)) return;
  for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
    s0 = s1, s1 = series[order[i]];
    for (j = 0; j < m; ++j) {
      s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
    }
  }
}

function none$1(series) {
  var n = series.length, o = new Array(n);
  while (--n >= 0) o[n] = n;
  return o;
}

function stackValue(d, key) {
  return d[key];
}

function stack() {
  var keys = constant$4([]),
      order = none$1,
      offset = none,
      value = stackValue;

  function stack(data) {
    var kz = keys.apply(this, arguments),
        i,
        m = data.length,
        n = kz.length,
        sz = new Array(n),
        oz;

    for (i = 0; i < n; ++i) {
      for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) {
        si[j] = sij = [0, +value(data[j], ki, j, data)];
        sij.data = data[j];
      }
      si.key = ki;
    }

    for (i = 0, oz = order(sz); i < n; ++i) {
      sz[oz[i]].index = i;
    }

    offset(sz, oz);
    return sz;
  }

  stack.keys = function(_) {
    return arguments.length ? (keys = typeof _ === "function" ? _ : constant$4(slice$2.call(_)), stack) : keys;
  };

  stack.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant$4(+_), stack) : value;
  };

  stack.order = function(_) {
    return arguments.length ? (order = _ == null ? none$1 : typeof _ === "function" ? _ : constant$4(slice$2.call(_)), stack) : order;
  };

  stack.offset = function(_) {
    return arguments.length ? (offset = _ == null ? none : _, stack) : offset;
  };

  return stack;
}

function expand(series, order) {
  if (!((n = series.length) > 0)) return;
  for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
    for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;
    if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
  }
  none(series, order);
}

function diverging(series, order) {
  if (!((n = series.length) > 1)) return;
  for (var i, j = 0, d, dy, yp, yn, n, m = series[order[0]].length; j < m; ++j) {
    for (yp = yn = 0, i = 0; i < n; ++i) {
      if ((dy = (d = series[order[i]][j])[1] - d[0]) >= 0) {
        d[0] = yp, d[1] = yp += dy;
      } else if (dy < 0) {
        d[1] = yn, d[0] = yn += dy;
      } else {
        d[0] = yp;
      }
    }
  }
}

function silhouette(series, order) {
  if (!((n = series.length) > 0)) return;
  for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
    for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;
    s0[j][1] += s0[j][0] = -y / 2;
  }
  none(series, order);
}

function wiggle(series, order) {
  if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;
  for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
    for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
      var si = series[order[i]],
          sij0 = si[j][1] || 0,
          sij1 = si[j - 1][1] || 0,
          s3 = (sij0 - sij1) / 2;
      for (var k = 0; k < i; ++k) {
        var sk = series[order[k]],
            skj0 = sk[j][1] || 0,
            skj1 = sk[j - 1][1] || 0;
        s3 += skj0 - skj1;
      }
      s1 += sij0, s2 += s3 * sij0;
    }
    s0[j - 1][1] += s0[j - 1][0] = y;
    if (s1) y -= s2 / s1;
  }
  s0[j - 1][1] += s0[j - 1][0] = y;
  none(series, order);
}

function ascending$1(series) {
  var sums = series.map(sum$1);
  return none$1(series).sort(function(a, b) { return sums[a] - sums[b]; });
}

function sum$1(series) {
  var s = 0, i = -1, n = series.length, v;
  while (++i < n) if (v = +series[i][1]) s += v;
  return s;
}

function descending$2(series) {
  return ascending$1(series).reverse();
}

function insideOut(series) {
  var n = series.length,
      i,
      j,
      sums = series.map(sum$1),
      order = none$1(series).sort(function(a, b) { return sums[b] - sums[a]; }),
      top = 0,
      bottom = 0,
      tops = [],
      bottoms = [];

  for (i = 0; i < n; ++i) {
    j = order[i];
    if (top < bottom) {
      top += sums[j];
      tops.push(j);
    } else {
      bottom += sums[j];
      bottoms.push(j);
    }
  }

  return bottoms.reverse().concat(tops);
}

function reverse(series) {
  return none$1(series).reverse();
}



var d3Shape = /*#__PURE__*/Object.freeze({
            arc: arcBuilder,
            area: area,
            line: line,
            pie: pieBuilder,
            areaRadial: areaRadial,
            radialArea: areaRadial,
            lineRadial: lineRadial$1,
            radialLine: lineRadial$1,
            pointRadial: pointRadial,
            linkHorizontal: linkHorizontal,
            linkVertical: linkVertical,
            linkRadial: linkRadial,
            symbol: symbol,
            symbols: symbols,
            symbolCircle: circle,
            symbolCross: cross$1,
            symbolDiamond: diamond,
            symbolSquare: square,
            symbolStar: star,
            symbolTriangle: triangle,
            symbolWye: wye,
            curveBasisClosed: basisClosed$1,
            curveBasisOpen: basisOpen,
            curveBasis: basis$2,
            curveBundle: bundle,
            curveCardinalClosed: cardinalClosed,
            curveCardinalOpen: cardinalOpen,
            curveCardinal: cardinal,
            curveCatmullRomClosed: catmullRomClosed,
            curveCatmullRomOpen: catmullRomOpen,
            curveCatmullRom: catmullRom,
            curveLinearClosed: linearClosed,
            curveLinear: curveLinear,
            curveMonotoneX: monotoneX,
            curveMonotoneY: monotoneY,
            curveNatural: natural,
            curveStep: step,
            curveStepAfter: stepAfter,
            curveStepBefore: stepBefore,
            stack: stack,
            stackOffsetExpand: expand,
            stackOffsetDiverging: diverging,
            stackOffsetNone: none,
            stackOffsetSilhouette: silhouette,
            stackOffsetWiggle: wiggle,
            stackOrderAscending: ascending$1,
            stackOrderDescending: descending$2,
            stackOrderInsideOut: insideOut,
            stackOrderNone: none$1,
            stackOrderReverse: reverse
});

// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var DISCRETE_COLOR_RANGE = ['#12939A', '#79C7E3', '#1A3177', '#FF9833', '#EF5D28'];

var EXTENDED_DISCRETE_COLOR_RANGE = ['#19CDD7', '#DDB27C', '#88572C', '#FF991F', '#F15C17', '#223F9A', '#DA70BF', '#125C77', '#4DC19C', '#776E57', '#12939A', '#17B8BE', '#F6D18A', '#B7885E', '#FFCB99', '#F89570', '#829AE3', '#E79FD5', '#1E96BE', '#89DAC1', '#B3AD9E'];

var CONTINUOUS_COLOR_RANGE = ['#EF5D28', '#FF9833'];

var SIZE_RANGE = [1, 10];
var OPACITY_TYPE = 'literal';
var DEFAULT_OPACITY = 1;

var DEFAULT_SIZE = 5;

var DEFAULT_COLOR = DISCRETE_COLOR_RANGE[0];

var _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Check if the component is series or not.
 * @param {React.Component} child Component.
 * @returns {boolean} True if the child is series, false otherwise.
 */
function isSeriesChild(child) {
  var prototype = child.type.prototype;

  return prototype instanceof AbstractSeries;
}

/**
 * Get all series from the 'children' object of the component.
 * @param {Object} children Children.
 * @returns {Array} Array of children.
 */
function getSeriesChildren(children) {
  return react.Children.toArray(children).filter(function (child) {
    return child && isSeriesChild(child);
  });
}

/**
 * Collect the map of repetitions of the series type for all children.
 * @param {Array} children Array of children.
 * @returns {{}} Map of repetitions where sameTypeTotal is the total amount and
 * sameTypeIndex is always 0.
 */
function collectSeriesTypesInfo(children) {
  var result = {};
  children.filter(isSeriesChild).forEach(function (child) {
    var displayName = child.type.displayName;
    var cluster = child.props.cluster;

    if (!result[displayName]) {
      result[displayName] = {
        sameTypeTotal: 0,
        sameTypeIndex: 0,
        clusters: new Set()
      };
    }
    result[displayName].clusters.add(cluster);
    result[displayName].sameTypeTotal++;
  });
  return result;
}

/**
 * Check series to see if it has angular data that needs to be converted
 * @param {Array} data - an array of objects to check
 * @returns {Boolean} whether or not this series contains polar configuration
 */
function seriesHasAngleRadius() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (!data) {
    return false;
  }
  return data.some(function (row) {
    return row.radius && row.angle;
  });
}

/**
 * Possibly convert polar coordinates to x/y for computing domain
 * @param {Array} data - an array of objects to check
 * @param {String} attr - the property being checked
 * @returns {Boolean} whether or not this series contains polar configuration
 */
function prepareData(data) {
  if (!seriesHasAngleRadius(data)) {
    return data;
  }

  return data.map(function (row) {
    return _extends$4({}, row, {
      x: row.radius * Math.cos(row.angle),
      y: row.radius * Math.sin(row.angle)
    });
  });
}

/**
 * Collect the stacked data for all children in use. If the children don't have
 * the data (e.g. the child is invalid series or something else), then the child
 * is skipped.
 * Each next value of attr is equal to the previous value plus the difference
 * between attr0 and attr.
 * @param {Array} children Array of children.
 * @param {string} attr Attribute to stack by.
 * @returns {Array} New array of children for the series.
 */
function getStackedData(children, attr) {
  var areSomeSeriesStacked = children.some(function (series) {
    return series && series.props.stack;
  });
  // It stores the last segment position added to each bar, separated by cluster.
  var latestAttrPositions = {};

  return children.reduce(function (accumulator, series, seriesIndex) {
    // Skip the children that are not series (e.g. don't have any data).
    if (!series) {
      accumulator.push(null);
      return accumulator;
    }

    var _series$props = series.props,
        data = _series$props.data,
        _series$props$cluster = _series$props.cluster,
        cluster = _series$props$cluster === undefined ? 'default' : _series$props$cluster,
        stack = _series$props.stack;

    var preppedData = prepareData(data, attr);

    if (!attr || !preppedData || !preppedData.length || areSomeSeriesStacked && !stack) {
      accumulator.push(preppedData);
      return accumulator;
    }

    var attr0 = attr + '0';
    var baseAttr = attr === 'y' ? 'x' : 'y';

    accumulator.push(preppedData.map(function (d, dIndex) {
      var _extends2, _latestAttrPositions$2;

      if (!latestAttrPositions[cluster]) {
        latestAttrPositions[cluster] = {};
      }

      var prevD = latestAttrPositions[cluster][d[baseAttr]];
      // It is the first segment of a bar.
      if (!prevD) {
        var _latestAttrPositions$;

        latestAttrPositions[cluster][d[baseAttr]] = (_latestAttrPositions$ = {}, _defineProperty$1(_latestAttrPositions$, attr0, d[attr0]), _defineProperty$1(_latestAttrPositions$, attr, d[attr]), _latestAttrPositions$);

        return _extends$4({}, d);
      }

      // Calculate the position of the next segment in a bar.
      var nextD = _extends$4({}, d, (_extends2 = {}, _defineProperty$1(_extends2, attr0, prevD[attr]), _defineProperty$1(_extends2, attr, prevD[attr] + d[attr] - (d[attr0] || 0)), _extends2));

      latestAttrPositions[cluster][d[baseAttr]] = (_latestAttrPositions$2 = {}, _defineProperty$1(_latestAttrPositions$2, attr0, nextD[attr0]), _defineProperty$1(_latestAttrPositions$2, attr, nextD[attr]), _latestAttrPositions$2);

      return nextD;
    }));

    return accumulator;
  }, []);
}

/**
 * Get the list of series props for a child.
 * @param {Array} children Array of all children.
 * @returns {Array} Array of series props for each child. If a child is not a
 * series, than it's undefined.
 */
function getSeriesPropsFromChildren(children) {
  var result = [];
  var seriesTypesInfo = collectSeriesTypesInfo(children);
  var seriesIndex = 0;
  var _opacityValue = DEFAULT_OPACITY;
  children.forEach(function (child) {
    var props = void 0;
    if (isSeriesChild(child)) {
      var seriesTypeInfo = seriesTypesInfo[child.type.displayName];
      var _colorValue = DISCRETE_COLOR_RANGE[seriesIndex % DISCRETE_COLOR_RANGE.length];
      props = _extends$4({}, seriesTypeInfo, {
        seriesIndex: seriesIndex,
        _colorValue: _colorValue,
        _opacityValue: _opacityValue
      });
      seriesTypeInfo.sameTypeIndex++;
      seriesIndex++;
      if (child.props.cluster) {
        props.cluster = child.props.cluster;
        // Using Array.from() so we can use .indexOf
        props.clusters = Array.from(seriesTypeInfo.clusters);
        props.sameTypeTotal = props.clusters.length;
        props.sameTypeIndex = props.clusters.indexOf(child.props.cluster);
      }
    }
    result.push(props);
  });
  return result;
}

/**
 * Find the max radius value from the nodes to be rendered after they have been
 * transformed into an array
 * @param {Array} data - the tree data after it has been broken into a iterable
 * it is an array of objects!
 * @returns {number} the maximum value in coordinates for the radial variable
 */
function getRadialDomain(data) {
  return data.reduce(function (res, row) {
    return Math.max(row.radius, res);
  }, 0);
}

var ANIMATED_SERIES_PROPS = ['xRange', 'xDomain', 'x', 'yRange', 'yDomain', 'y', 'colorRange', 'colorDomain', 'color', 'opacityRange', 'opacityDomain', 'opacity', 'strokeRange', 'strokeDomain', 'stroke', 'fillRange', 'fillDomain', 'fill', 'width', 'height', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'data', 'angleDomain', 'angleRange', 'angle', 'radiusDomain', 'radiusRange', 'radius', 'innerRadiusDomain', 'innerRadiusRange', 'innerRadius'];

function getStackParams(props) {
  var _stackBy = props._stackBy,
      valuePosAttr = props.valuePosAttr,
      cluster = props.cluster;
  var _props$sameTypeTotal = props.sameTypeTotal,
      sameTypeTotal = _props$sameTypeTotal === undefined ? 1 : _props$sameTypeTotal,
      _props$sameTypeIndex = props.sameTypeIndex,
      sameTypeIndex = _props$sameTypeIndex === undefined ? 0 : _props$sameTypeIndex;

  // If bars are stacked, but not clustering, override `sameTypeTotal` and
  // `sameTypeIndex` such that bars are stacked and not staggered.

  if (_stackBy === valuePosAttr && !cluster) {
    sameTypeTotal = 1;
    sameTypeIndex = 0;
  }
  return { sameTypeTotal: sameTypeTotal, sameTypeIndex: sameTypeIndex };
}

var _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName = 'rv-xy-plot__series rv-xy-plot__series--line';

var STROKE_STYLES = {
  dashed: '6, 2',
  solid: null
};

var LineSeries = function (_AbstractSeries) {
  _inherits$2(LineSeries, _AbstractSeries);

  function LineSeries() {
    _classCallCheck$2(this, LineSeries);

    return _possibleConstructorReturn$2(this, (LineSeries.__proto__ || Object.getPrototypeOf(LineSeries)).apply(this, arguments));
  }

  _createClass$2(LineSeries, [{
    key: '_renderLine',
    value: function _renderLine(data, x, y, curve, getNull) {
      var line$$1 = line();
      if (curve !== null) {
        if (typeof curve === 'string' && d3Shape[curve]) {
          line$$1 = line$$1.curve(d3Shape[curve]);
        } else if (typeof curve === 'function') {
          line$$1 = line$$1.curve(curve);
        }
      }
      line$$1 = line$$1.defined(getNull);
      line$$1 = line$$1.x(x).y(y);
      return line$$1(data);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          data = _props.data;


      if (this.props.nullAccessor) {
        warning('nullAccessor has been renamed to getNull', true);
      }

      if (!data) {
        return null;
      }

      if (animation) {
        return react.createElement(
          Animation,
          _extends$5({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(LineSeries, _extends$5({}, this.props, { animation: null }))
        );
      }

      var _props2 = this.props,
          curve = _props2.curve,
          marginLeft = _props2.marginLeft,
          marginTop = _props2.marginTop,
          strokeDasharray = _props2.strokeDasharray,
          strokeStyle = _props2.strokeStyle,
          strokeWidth = _props2.strokeWidth,
          style = _props2.style;


      var x = this._getAttributeFunctor('x');
      var y = this._getAttributeFunctor('y');
      var stroke = this._getAttributeValue('stroke') || this._getAttributeValue('color');
      var newOpacity = this._getAttributeValue('opacity');
      var opacity = Number.isFinite(newOpacity) ? newOpacity : DEFAULT_OPACITY;
      var getNull = this.props.nullAccessor || this.props.getNull;
      var d = this._renderLine(data, x, y, curve, getNull);

      return react.createElement('path', {
        d: d,
        className: predefinedClassName + ' ' + className,
        transform: 'translate(' + marginLeft + ',' + marginTop + ')',
        onMouseOver: this._seriesMouseOverHandler,
        onMouseOut: this._seriesMouseOutHandler,
        onClick: this._seriesClickHandler,
        onContextMenu: this._seriesRightClickHandler,
        style: _extends$5({
          opacity: opacity,
          strokeDasharray: STROKE_STYLES[strokeStyle] || strokeDasharray,
          strokeWidth: strokeWidth,
          stroke: stroke
        }, style)
      });
    }
  }]);

  return LineSeries;
}(AbstractSeries);

LineSeries.displayName = 'LineSeries';
LineSeries.propTypes = _extends$5({}, AbstractSeries.propTypes, {
  strokeStyle: propTypes.oneOf(Object.keys(STROKE_STYLES)),
  curve: propTypes.oneOfType([propTypes.string, propTypes.func]),
  getNull: propTypes.func
});
LineSeries.defaultProps = _extends$5({}, AbstractSeries.defaultProps, {
  strokeStyle: 'solid',
  style: {},
  opacity: 1,
  curve: null,
  className: '',
  getNull: function getNull() {
    return true;
  }
});

var _extends$6 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$3(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LineSeriesCanvas = function (_AbstractSeries) {
  _inherits$3(LineSeriesCanvas, _AbstractSeries);

  function LineSeriesCanvas() {
    _classCallCheck$3(this, LineSeriesCanvas);

    return _possibleConstructorReturn$3(this, (LineSeriesCanvas.__proto__ || Object.getPrototypeOf(LineSeriesCanvas)).apply(this, arguments));
  }

  _createClass$3(LineSeriesCanvas, [{
    key: 'render',
    value: function render() {
      return react.createElement('div', null);
    }
  }], [{
    key: 'renderLayer',
    value: function renderLayer(props, ctx) {
      var curve = props.curve,
          data = props.data,
          marginLeft = props.marginLeft,
          marginTop = props.marginTop,
          strokeWidth = props.strokeWidth,
          strokeDasharray = props.strokeDasharray;

      if (!data || data.length === 0) {
        return;
      }

      var x = getAttributeFunctor(props, 'x');
      var y = getAttributeFunctor(props, 'y');
      var stroke = getAttributeValue(props, 'stroke') || getAttributeValue(props, 'color');
      var strokeColor = rgb(stroke);
      var newOpacity = getAttributeValue(props, 'opacity');
      var opacity = Number.isFinite(newOpacity) ? newOpacity : DEFAULT_OPACITY;
      var line$$1 = line().x(function (row) {
        return x(row) + marginLeft;
      }).y(function (row) {
        return y(row) + marginTop;
      });
      if (typeof curve === 'string' && d3Shape[curve]) {
        line$$1 = line$$1.curve(d3Shape[curve]);
      } else if (typeof curve === 'function') {
        line$$1 = line$$1.curve(curve);
      }

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(' + strokeColor.r + ', ' + strokeColor.g + ', ' + strokeColor.b + ', ' + opacity + ')';
      ctx.lineWidth = strokeWidth;

      if (strokeDasharray) {
        ctx.setLineDash(strokeDasharray);
      }

      line$$1.context(ctx)(data);
      ctx.stroke();
      ctx.closePath();
      // set back to default
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
    }
  }, {
    key: 'requiresSVG',
    get: function get() {
      return false;
    }
  }, {
    key: 'isCanvas',
    get: function get() {
      return true;
    }
  }]);

  return LineSeriesCanvas;
}(AbstractSeries);

LineSeriesCanvas.displayName = 'LineSeriesCanvas';
LineSeriesCanvas.defaultProps = _extends$6({}, AbstractSeries.defaultProps, {
  strokeWidth: 2
});

LineSeriesCanvas.propTypes = _extends$6({}, AbstractSeries.propTypes, {
  strokeWidth: propTypes.number
});

var _extends$7 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$4(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$4(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$1 = 'rv-xy-plot__series rv-xy-plot__series--bar';

var BarSeries = function (_AbstractSeries) {
  _inherits$4(BarSeries, _AbstractSeries);

  function BarSeries() {
    _classCallCheck$4(this, BarSeries);

    return _possibleConstructorReturn$4(this, (BarSeries.__proto__ || Object.getPrototypeOf(BarSeries)).apply(this, arguments));
  }

  _createClass$4(BarSeries, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          data = _props.data,
          linePosAttr = _props.linePosAttr,
          lineSizeAttr = _props.lineSizeAttr,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          style = _props.style,
          valuePosAttr = _props.valuePosAttr,
          valueSizeAttr = _props.valueSizeAttr,
          barWidth = _props.barWidth;


      if (!data) {
        return null;
      }

      if (animation) {
        return react.createElement(
          Animation,
          _extends$7({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(BarSeries, _extends$7({}, this.props, { animation: null }))
        );
      }

      var _getStackParams = getStackParams(this.props),
          sameTypeTotal = _getStackParams.sameTypeTotal,
          sameTypeIndex = _getStackParams.sameTypeIndex;

      var distance = this._getScaleDistance(linePosAttr);
      var lineFunctor = this._getAttributeFunctor(linePosAttr);
      var valueFunctor = this._getAttributeFunctor(valuePosAttr);
      var value0Functor = this._getAttr0Functor(valuePosAttr);
      var fillFunctor = this._getAttributeFunctor('fill') || this._getAttributeFunctor('color');
      var strokeFunctor = this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color');
      var opacityFunctor = this._getAttributeFunctor('opacity');

      var halfSpace = distance / 2 * barWidth;

      return react.createElement(
        'g',
        {
          className: predefinedClassName$1 + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        data.map(function (d, i) {
          var _attrs;

          // totalSpaceAvailable is the space we have available to draw all the
          // bars of a same 'linePosAttr' value (a.k.a. sameTypeTotal)
          var totalSpaceAvailable = halfSpace * 2;
          var totalSpaceCenter = lineFunctor(d);
          // totalSpaceStartingPoint is the first pixel were we can start drawing
          var totalSpaceStartingPoint = totalSpaceCenter - halfSpace;
          // spaceTakenByInterBarsPixels has the overhead space consumed by each bar of sameTypeTotal
          var spaceTakenByInterBarsPixels = (sameTypeTotal - 1) / sameTypeTotal;
          // spacePerBar is the space we have available to draw sameTypeIndex bar
          var spacePerBar = totalSpaceAvailable / sameTypeTotal - spaceTakenByInterBarsPixels;
          // barStartingPoint is the first pixel were we can start drawing sameTypeIndex bar
          var barStartingPoint = totalSpaceStartingPoint + spacePerBar * sameTypeIndex + sameTypeIndex;

          var attrs = (_attrs = {
            style: _extends$7({
              opacity: opacityFunctor && opacityFunctor(d),
              stroke: strokeFunctor && strokeFunctor(d),
              fill: fillFunctor && fillFunctor(d)
            }, style)
          }, _defineProperty$2(_attrs, linePosAttr, barStartingPoint), _defineProperty$2(_attrs, lineSizeAttr, spacePerBar), _defineProperty$2(_attrs, valuePosAttr, Math.min(value0Functor(d), valueFunctor(d))), _defineProperty$2(_attrs, valueSizeAttr, Math.abs(-value0Functor(d) + valueFunctor(d))), _defineProperty$2(_attrs, 'onClick', function onClick(e) {
            return _this2._valueClickHandler(d, e);
          }), _defineProperty$2(_attrs, 'onContextMenu', function onContextMenu(e) {
            return _this2._valueRightClickHandler(d, e);
          }), _defineProperty$2(_attrs, 'onMouseOver', function onMouseOver(e) {
            return _this2._valueMouseOverHandler(d, e);
          }), _defineProperty$2(_attrs, 'onMouseOut', function onMouseOut(e) {
            return _this2._valueMouseOutHandler(d, e);
          }), _defineProperty$2(_attrs, 'key', i), _attrs);
          return react.createElement('rect', attrs);
        })
      );
    }
  }], [{
    key: 'propTypes',
    get: function get() {
      return _extends$7({}, AbstractSeries.propTypes, {
        linePosAttr: propTypes.string,
        valuePosAttr: propTypes.string,
        lineSizeAttr: propTypes.string,
        valueSizeAttr: propTypes.string,
        cluster: propTypes.string,
        barWidth: propTypes.number
      });
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        barWidth: 0.85
      };
    }
  }]);

  return BarSeries;
}(AbstractSeries);

BarSeries.displayName = 'BarSeries';

var _extends$8 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$5 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$5(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$5(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HorizontalBarSeries = function (_AbstractSeries) {
  _inherits$5(HorizontalBarSeries, _AbstractSeries);

  function HorizontalBarSeries() {
    _classCallCheck$5(this, HorizontalBarSeries);

    return _possibleConstructorReturn$5(this, (HorizontalBarSeries.__proto__ || Object.getPrototypeOf(HorizontalBarSeries)).apply(this, arguments));
  }

  _createClass$5(HorizontalBarSeries, [{
    key: 'render',
    value: function render() {
      return react.createElement(BarSeries, _extends$8({}, this.props, {
        linePosAttr: 'y',
        valuePosAttr: 'x',
        lineSizeAttr: 'height',
        valueSizeAttr: 'width'
      }));
    }
  }], [{
    key: 'getParentConfig',
    value: function getParentConfig(attr) {
      var isDomainAdjustmentNeeded = attr === 'y';
      var zeroBaseValue = attr === 'x';
      return {
        isDomainAdjustmentNeeded: isDomainAdjustmentNeeded,
        zeroBaseValue: zeroBaseValue
      };
    }
  }]);

  return HorizontalBarSeries;
}(AbstractSeries);

HorizontalBarSeries.displayName = 'HorizontalBarSeries';

var _extends$9 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$6 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$6(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$6(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getScaleDistance(props, attr) {
  var scaleObject = getScaleObjectFromProps(props, attr);
  return scaleObject ? scaleObject.distance : 0;
}

var BarSeriesCanvas = function (_AbstractSeries) {
  _inherits$6(BarSeriesCanvas, _AbstractSeries);

  function BarSeriesCanvas() {
    _classCallCheck$6(this, BarSeriesCanvas);

    return _possibleConstructorReturn$6(this, (BarSeriesCanvas.__proto__ || Object.getPrototypeOf(BarSeriesCanvas)).apply(this, arguments));
  }

  _createClass$6(BarSeriesCanvas, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }], [{
    key: 'renderLayer',
    value: function renderLayer(props, ctx) {
      var data = props.data,
          linePosAttr = props.linePosAttr,
          lineSizeAttr = props.lineSizeAttr,
          valuePosAttr = props.valuePosAttr,
          marginTop = props.marginTop,
          marginBottom = props.marginBottom;

      if (!data || data.length === 0) {
        return;
      }

      var distance = getScaleDistance(props, linePosAttr);
      var line = getAttributeFunctor(props, linePosAttr);
      var value = getAttributeFunctor(props, valuePosAttr);
      var value0 = getAttr0Functor(props, valuePosAttr);
      var fill = getAttributeFunctor(props, 'fill') || getAttributeFunctor(props, 'color');
      var stroke = getAttributeFunctor(props, 'stroke') || getAttributeFunctor(props, 'color');
      var opacity = getAttributeFunctor(props, 'opacity');

      var halfSpace = distance / 2 * 0.85;
      // totalSpaceAvailable is the space we have available to draw all the
      // bars of a same 'linePosAttr' value (a.k.a. sameTypeTotal)
      var totalSpaceAvailable = halfSpace * 2;

      var _getStackParams = getStackParams(props),
          sameTypeTotal = _getStackParams.sameTypeTotal,
          sameTypeIndex = _getStackParams.sameTypeIndex;

      data.forEach(function (row) {
        var totalSpaceCenter = line(row);
        // totalSpaceStartingPoint is the first pixel were we can start drawing
        var totalSpaceStartingPoint = totalSpaceCenter - halfSpace;

        // spaceTakenByInterBarsPixels has the overhead space consumed by each bar of sameTypeTotal
        var spaceTakenByInterBarsPixels = (sameTypeTotal - 1) / sameTypeTotal;
        // lineSize is the space we have available to draw sameTypeIndex bar
        var lineSize = totalSpaceAvailable / sameTypeTotal - spaceTakenByInterBarsPixels;

        var fillColor = rgb(fill(row));
        var strokeColor = rgb(stroke(row));
        var rowOpacity = opacity(row) || DEFAULT_OPACITY;

        // linePos is the first pixel were we can start drawing sameTypeIndex bar
        var linePos = totalSpaceStartingPoint + lineSize * sameTypeIndex + sameTypeIndex;
        var valuePos = Math.min(value0(row), value(row));
        var x = valuePosAttr === 'x' ? valuePos : linePos;
        var y = valuePosAttr === 'y' ? valuePos : linePos;

        var valueSize = Math.abs(-value0(row) + value(row));
        var height = lineSizeAttr === 'height' ? lineSize : valueSize;
        var width = lineSizeAttr === 'width' ? lineSize : valueSize;

        ctx.beginPath();
        ctx.rect(x + marginBottom, y + marginTop, width, height);
        ctx.fillStyle = 'rgba(' + fillColor.r + ', ' + fillColor.g + ', ' + fillColor.b + ', ' + rowOpacity + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(' + strokeColor.r + ', ' + strokeColor.g + ', ' + strokeColor.b + ', ' + rowOpacity + ')';
        ctx.stroke();
      });
    }
  }, {
    key: 'requiresSVG',
    get: function get() {
      return false;
    }
  }, {
    key: 'isCanvas',
    get: function get() {
      return true;
    }
  }]);

  return BarSeriesCanvas;
}(AbstractSeries);

BarSeriesCanvas.displayName = 'BarSeriesCanvas';
BarSeriesCanvas.defaultProps = _extends$9({}, AbstractSeries.defaultProps, {
  linePosAttr: propTypes.string.isRequired,
  valuePosAttr: propTypes.string.isRequired,
  lineSizeAttr: propTypes.string.isRequired,
  valueSizeAttr: propTypes.string.isRequired
});

BarSeriesCanvas.propTypes = _extends$9({}, AbstractSeries.propTypes);

var _extends$a = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$7 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$7(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$7(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HorizontalBarSeriesCanvas = function (_AbstractSeries) {
  _inherits$7(HorizontalBarSeriesCanvas, _AbstractSeries);

  function HorizontalBarSeriesCanvas() {
    _classCallCheck$7(this, HorizontalBarSeriesCanvas);

    return _possibleConstructorReturn$7(this, (HorizontalBarSeriesCanvas.__proto__ || Object.getPrototypeOf(HorizontalBarSeriesCanvas)).apply(this, arguments));
  }

  _createClass$7(HorizontalBarSeriesCanvas, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }], [{
    key: 'getParentConfig',
    value: function getParentConfig(attr) {
      var isDomainAdjustmentNeeded = attr === 'y';
      var zeroBaseValue = attr === 'x';
      return {
        isDomainAdjustmentNeeded: isDomainAdjustmentNeeded,
        zeroBaseValue: zeroBaseValue
      };
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer(props, ctx) {
      BarSeriesCanvas.renderLayer(_extends$a({}, props, {
        linePosAttr: 'y',
        valuePosAttr: 'x',
        lineSizeAttr: 'height',
        valueSizeAttr: 'width'
      }), ctx);
    }
  }, {
    key: 'requiresSVG',
    get: function get() {
      return false;
    }
  }, {
    key: 'isCanvas',
    get: function get() {
      return true;
    }
  }]);

  return HorizontalBarSeriesCanvas;
}(AbstractSeries);

HorizontalBarSeriesCanvas.displayName = 'HorizontalBarSeriesCanvas';
HorizontalBarSeriesCanvas.propTypes = _extends$a({}, AbstractSeries.propTypes);

var _extends$b = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$8 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$8(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$8(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VerticalBarSeries = function (_AbstractSeries) {
  _inherits$8(VerticalBarSeries, _AbstractSeries);

  function VerticalBarSeries() {
    _classCallCheck$8(this, VerticalBarSeries);

    return _possibleConstructorReturn$8(this, (VerticalBarSeries.__proto__ || Object.getPrototypeOf(VerticalBarSeries)).apply(this, arguments));
  }

  _createClass$8(VerticalBarSeries, [{
    key: 'render',
    value: function render() {
      return react.createElement(BarSeries, _extends$b({}, this.props, {
        linePosAttr: 'x',
        valuePosAttr: 'y',
        lineSizeAttr: 'width',
        valueSizeAttr: 'height'
      }));
    }
  }], [{
    key: 'getParentConfig',
    value: function getParentConfig(attr) {
      var isDomainAdjustmentNeeded = attr === 'x';
      var zeroBaseValue = attr === 'y';
      return {
        isDomainAdjustmentNeeded: isDomainAdjustmentNeeded,
        zeroBaseValue: zeroBaseValue
      };
    }
  }]);

  return VerticalBarSeries;
}(AbstractSeries);

VerticalBarSeries.displayName = 'VerticalBarSeries';

var _extends$c = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$9 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$9(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$9(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HorizontalBarSeriesCanvas$1 = function (_AbstractSeries) {
  _inherits$9(HorizontalBarSeriesCanvas, _AbstractSeries);

  function HorizontalBarSeriesCanvas() {
    _classCallCheck$9(this, HorizontalBarSeriesCanvas);

    return _possibleConstructorReturn$9(this, (HorizontalBarSeriesCanvas.__proto__ || Object.getPrototypeOf(HorizontalBarSeriesCanvas)).apply(this, arguments));
  }

  _createClass$9(HorizontalBarSeriesCanvas, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }], [{
    key: 'getParentConfig',
    value: function getParentConfig(attr) {
      var isDomainAdjustmentNeeded = attr === 'x';
      var zeroBaseValue = attr === 'y';
      return {
        isDomainAdjustmentNeeded: isDomainAdjustmentNeeded,
        zeroBaseValue: zeroBaseValue
      };
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer(props, ctx) {
      BarSeriesCanvas.renderLayer(_extends$c({}, props, {
        linePosAttr: 'x',
        valuePosAttr: 'y',
        lineSizeAttr: 'width',
        valueSizeAttr: 'height'
      }), ctx);
    }
  }, {
    key: 'requiresSVG',
    get: function get() {
      return false;
    }
  }, {
    key: 'isCanvas',
    get: function get() {
      return true;
    }
  }]);

  return HorizontalBarSeriesCanvas;
}(AbstractSeries);

HorizontalBarSeriesCanvas$1.displayName = 'HorizontalBarSeriesCanvas';
HorizontalBarSeriesCanvas$1.propTypes = _extends$c({}, AbstractSeries.propTypes);

var _extends$d = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$a = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$a(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$a(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$a(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$2 = 'rv-xy-plot__series rv-xy-plot__series--rect';

var RectSeries = function (_AbstractSeries) {
  _inherits$a(RectSeries, _AbstractSeries);

  function RectSeries() {
    _classCallCheck$a(this, RectSeries);

    return _possibleConstructorReturn$a(this, (RectSeries.__proto__ || Object.getPrototypeOf(RectSeries)).apply(this, arguments));
  }

  _createClass$a(RectSeries, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          data = _props.data,
          linePosAttr = _props.linePosAttr,
          lineSizeAttr = _props.lineSizeAttr,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          style = _props.style,
          valuePosAttr = _props.valuePosAttr,
          valueSizeAttr = _props.valueSizeAttr;


      if (!data) {
        return null;
      }

      if (animation) {
        return react.createElement(
          Animation,
          _extends$d({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(RectSeries, _extends$d({}, this.props, { animation: null }))
        );
      }

      var lineFunctor = this._getAttributeFunctor(linePosAttr);
      var line0Functor = this._getAttr0Functor(linePosAttr);
      var valueFunctor = this._getAttributeFunctor(valuePosAttr);
      var value0Functor = this._getAttr0Functor(valuePosAttr);
      var fillFunctor = this._getAttributeFunctor('fill') || this._getAttributeFunctor('color');
      var strokeFunctor = this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color');
      var opacityFunctor = this._getAttributeFunctor('opacity');

      return react.createElement(
        'g',
        {
          className: predefinedClassName$2 + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        data.map(function (d, i) {
          var _attrs;

          var attrs = (_attrs = {
            style: _extends$d({
              opacity: opacityFunctor && opacityFunctor(d),
              stroke: strokeFunctor && strokeFunctor(d),
              fill: fillFunctor && fillFunctor(d)
            }, style)
          }, _defineProperty$3(_attrs, linePosAttr, line0Functor(d)), _defineProperty$3(_attrs, lineSizeAttr, Math.abs(lineFunctor(d) - line0Functor(d))), _defineProperty$3(_attrs, valuePosAttr, Math.min(value0Functor(d), valueFunctor(d))), _defineProperty$3(_attrs, valueSizeAttr, Math.abs(-value0Functor(d) + valueFunctor(d))), _defineProperty$3(_attrs, 'onClick', function onClick(e) {
            return _this2._valueClickHandler(d, e);
          }), _defineProperty$3(_attrs, 'onContextMenu', function onContextMenu(e) {
            return _this2._valueRightClickHandler(d, e);
          }), _defineProperty$3(_attrs, 'onMouseOver', function onMouseOver(e) {
            return _this2._valueMouseOverHandler(d, e);
          }), _defineProperty$3(_attrs, 'onMouseOut', function onMouseOut(e) {
            return _this2._valueMouseOutHandler(d, e);
          }), _defineProperty$3(_attrs, 'key', i), _attrs);
          return react.createElement('rect', attrs);
        })
      );
    }
  }], [{
    key: 'propTypes',
    get: function get() {
      return _extends$d({}, AbstractSeries.propTypes, {
        linePosAttr: propTypes.string,
        valuePosAttr: propTypes.string,
        lineSizeAttr: propTypes.string,
        valueSizeAttr: propTypes.string
      });
    }
  }]);

  return RectSeries;
}(AbstractSeries);

RectSeries.displayName = 'RectSeries';

var _extends$e = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$b = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$b(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$b(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$b(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VerticalRectSeries = function (_AbstractSeries) {
  _inherits$b(VerticalRectSeries, _AbstractSeries);

  function VerticalRectSeries() {
    _classCallCheck$b(this, VerticalRectSeries);

    return _possibleConstructorReturn$b(this, (VerticalRectSeries.__proto__ || Object.getPrototypeOf(VerticalRectSeries)).apply(this, arguments));
  }

  _createClass$b(VerticalRectSeries, [{
    key: 'render',
    value: function render() {
      return react.createElement(RectSeries, _extends$e({}, this.props, {
        linePosAttr: 'x',
        valuePosAttr: 'y',
        lineSizeAttr: 'width',
        valueSizeAttr: 'height'
      }));
    }
  }], [{
    key: 'getParentConfig',
    value: function getParentConfig(attr) {
      var isDomainAdjustmentNeeded = false;
      var zeroBaseValue = attr === 'y';
      return {
        isDomainAdjustmentNeeded: isDomainAdjustmentNeeded,
        zeroBaseValue: zeroBaseValue
      };
    }
  }]);

  return VerticalRectSeries;
}(AbstractSeries);

VerticalRectSeries.displayName = 'VerticalRectSeries';

var _extends$f = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$c = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$c(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$c(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$c(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RectSeriesCanvas = function (_AbstractSeries) {
  _inherits$c(RectSeriesCanvas, _AbstractSeries);

  function RectSeriesCanvas() {
    _classCallCheck$c(this, RectSeriesCanvas);

    return _possibleConstructorReturn$c(this, (RectSeriesCanvas.__proto__ || Object.getPrototypeOf(RectSeriesCanvas)).apply(this, arguments));
  }

  _createClass$c(RectSeriesCanvas, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }], [{
    key: 'renderLayer',
    value: function renderLayer(props, ctx) {
      var data = props.data,
          linePosAttr = props.linePosAttr,
          lineSizeAttr = props.lineSizeAttr,
          marginLeft = props.marginLeft,
          marginTop = props.marginTop,
          valuePosAttr = props.valuePosAttr;

      if (!data || data.length === 0) {
        return;
      }

      var line = getAttributeFunctor(props, linePosAttr);
      var line0 = getAttr0Functor(props, linePosAttr);
      var value = getAttributeFunctor(props, valuePosAttr);
      var value0 = getAttr0Functor(props, valuePosAttr);
      var fill = getAttributeFunctor(props, 'fill') || getAttributeFunctor(props, 'color');
      var stroke = getAttributeFunctor(props, 'stroke') || getAttributeFunctor(props, 'color');
      var opacity = getAttributeFunctor(props, 'opacity');

      data.forEach(function (row) {
        var fillColor = rgb(fill(row));
        var strokeColor = rgb(stroke(row));
        var rowOpacity = opacity(row) || DEFAULT_OPACITY;

        var linePos = line0(row);
        var valuePos = Math.min(value0(row), value(row));
        var x = valuePosAttr === 'x' ? valuePos : linePos;
        var y = valuePosAttr === 'y' ? valuePos : linePos;

        var lineSize = Math.abs(line(row) - line0(row));
        var valueSize = Math.abs(-value0(row) + value(row));
        var height = lineSizeAttr === 'height' ? lineSize : valueSize;
        var width = lineSizeAttr === 'width' ? lineSize : valueSize;

        ctx.beginPath();
        ctx.rect(x + marginLeft, y + marginTop, width, height);
        ctx.fillStyle = 'rgba(' + fillColor.r + ', ' + fillColor.g + ', ' + fillColor.b + ', ' + rowOpacity + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(' + strokeColor.r + ', ' + strokeColor.g + ', ' + strokeColor.b + ', ' + rowOpacity + ')';
        ctx.stroke();
      });
    }
  }, {
    key: 'requiresSVG',
    get: function get() {
      return false;
    }
  }, {
    key: 'isCanvas',
    get: function get() {
      return true;
    }
  }]);

  return RectSeriesCanvas;
}(AbstractSeries);

RectSeriesCanvas.displayName = 'RectSeriesCanvas';
RectSeriesCanvas.defaultProps = _extends$f({}, AbstractSeries.defaultProps, {
  linePosAttr: propTypes.string.isRequired,
  valuePosAttr: propTypes.string.isRequired,
  lineSizeAttr: propTypes.string.isRequired,
  valueSizeAttr: propTypes.string.isRequired
});

RectSeriesCanvas.propTypes = _extends$f({}, AbstractSeries.propTypes);

var _extends$g = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$d = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$d(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$d(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$d(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HorizontalRectSeriesCanvas = function (_AbstractSeries) {
  _inherits$d(HorizontalRectSeriesCanvas, _AbstractSeries);

  function HorizontalRectSeriesCanvas() {
    _classCallCheck$d(this, HorizontalRectSeriesCanvas);

    return _possibleConstructorReturn$d(this, (HorizontalRectSeriesCanvas.__proto__ || Object.getPrototypeOf(HorizontalRectSeriesCanvas)).apply(this, arguments));
  }

  _createClass$d(HorizontalRectSeriesCanvas, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }], [{
    key: 'getParentConfig',
    value: function getParentConfig(attr) {
      var isDomainAdjustmentNeeded = false;
      var zeroBaseValue = attr === 'y';
      return {
        isDomainAdjustmentNeeded: isDomainAdjustmentNeeded,
        zeroBaseValue: zeroBaseValue
      };
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer(props, ctx) {
      RectSeriesCanvas.renderLayer(_extends$g({}, props, {
        linePosAttr: 'x',
        valuePosAttr: 'y',
        lineSizeAttr: 'width',
        valueSizeAttr: 'height'
      }), ctx);
    }
  }, {
    key: 'requiresSVG',
    get: function get() {
      return false;
    }
  }, {
    key: 'isCanvas',
    get: function get() {
      return true;
    }
  }]);

  return HorizontalRectSeriesCanvas;
}(AbstractSeries);

HorizontalRectSeriesCanvas.displayName = 'HorizontalRectSeriesCanvas';
HorizontalRectSeriesCanvas.propTypes = _extends$g({}, AbstractSeries.propTypes);

var _extends$h = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$e = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$e(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$e(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$e(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HorizontalRectSeries = function (_AbstractSeries) {
  _inherits$e(HorizontalRectSeries, _AbstractSeries);

  function HorizontalRectSeries() {
    _classCallCheck$e(this, HorizontalRectSeries);

    return _possibleConstructorReturn$e(this, (HorizontalRectSeries.__proto__ || Object.getPrototypeOf(HorizontalRectSeries)).apply(this, arguments));
  }

  _createClass$e(HorizontalRectSeries, [{
    key: 'render',
    value: function render() {
      return react.createElement(RectSeries, _extends$h({}, this.props, {
        linePosAttr: 'y',
        valuePosAttr: 'x',
        lineSizeAttr: 'height',
        valueSizeAttr: 'width'
      }));
    }
  }], [{
    key: 'getParentConfig',
    value: function getParentConfig(attr) {
      var isDomainAdjustmentNeeded = false;
      var zeroBaseValue = attr === 'x';
      return {
        isDomainAdjustmentNeeded: isDomainAdjustmentNeeded,
        zeroBaseValue: zeroBaseValue
      };
    }
  }]);

  return HorizontalRectSeries;
}(AbstractSeries);

HorizontalRectSeries.displayName = 'HorizontalRectSeries';

var _extends$i = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$f = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$f(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$f(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$f(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HorizontalRectSeriesCanvas$1 = function (_AbstractSeries) {
  _inherits$f(HorizontalRectSeriesCanvas, _AbstractSeries);

  function HorizontalRectSeriesCanvas() {
    _classCallCheck$f(this, HorizontalRectSeriesCanvas);

    return _possibleConstructorReturn$f(this, (HorizontalRectSeriesCanvas.__proto__ || Object.getPrototypeOf(HorizontalRectSeriesCanvas)).apply(this, arguments));
  }

  _createClass$f(HorizontalRectSeriesCanvas, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }], [{
    key: 'getParentConfig',
    value: function getParentConfig(attr) {
      var isDomainAdjustmentNeeded = false;
      var zeroBaseValue = attr === 'x';
      return {
        isDomainAdjustmentNeeded: isDomainAdjustmentNeeded,
        zeroBaseValue: zeroBaseValue
      };
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer(props, ctx) {
      RectSeriesCanvas.renderLayer(_extends$i({}, props, {
        linePosAttr: 'y',
        valuePosAttr: 'x',
        lineSizeAttr: 'height',
        valueSizeAttr: 'width'
      }), ctx);
    }
  }, {
    key: 'requiresSVG',
    get: function get() {
      return false;
    }
  }, {
    key: 'isCanvas',
    get: function get() {
      return true;
    }
  }]);

  return HorizontalRectSeriesCanvas;
}(AbstractSeries);

HorizontalRectSeriesCanvas$1.displayName = 'HorizontalRectSeriesCanvas';
HorizontalRectSeriesCanvas$1.propTypes = _extends$i({}, AbstractSeries.propTypes);

var _extends$j = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$g = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$g(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$g(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$g(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
var predefinedClassName$3 = 'rv-xy-plot__series rv-xy-plot__series--label';

var getTextAnchor = function getTextAnchor(labelAnchorX, leftOfMiddle) {
  return labelAnchorX ? labelAnchorX : leftOfMiddle ? 'start' : 'end';
};
var getDominantBaseline = function getDominantBaseline(labelAnchorY, aboveMiddle) {
  return labelAnchorY ? labelAnchorY : aboveMiddle ? 'text-before-edge' : 'text-after-edge';
};

var LabelSeries = function (_AbstractSeries) {
  _inherits$g(LabelSeries, _AbstractSeries);

  function LabelSeries() {
    _classCallCheck$g(this, LabelSeries);

    return _possibleConstructorReturn$g(this, (LabelSeries.__proto__ || Object.getPrototypeOf(LabelSeries)).apply(this, arguments));
  }

  _createClass$g(LabelSeries, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          animation = _props.animation,
          allowOffsetToBeReversed = _props.allowOffsetToBeReversed,
          className = _props.className,
          data = _props.data,
          _data = _props._data,
          getLabel = _props.getLabel,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          rotation = _props.rotation,
          style = _props.style,
          xRange = _props.xRange,
          yRange = _props.yRange,
          labelAnchorX = _props.labelAnchorX,
          labelAnchorY = _props.labelAnchorY;

      if (!data) {
        return null;
      }

      if (animation) {
        return react.createElement(
          Animation,
          _extends$j({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(LabelSeries, _extends$j({}, this.props, { animation: null, _data: data }))
        );
      }

      var xFunctor = this._getAttributeFunctor('x');
      var yFunctor = this._getAttributeFunctor('y');

      return react.createElement(
        'g',
        {
          className: predefinedClassName$3 + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')',
          style: style
        },
        data.reduce(function (res, d, i) {
          var markStyle = d.style,
              xOffset = d.xOffset,
              yOffset = d.yOffset;

          if (!getLabel(d)) {
            return res;
          }
          var xVal = xFunctor(d);
          var yVal = yFunctor(d);
          var leftOfMiddle = xVal < (xRange[1] - xRange[0]) / 2;
          var aboveMiddle = yVal < Math.abs(yRange[1] - yRange[0]) / 2;

          var x = xVal + (allowOffsetToBeReversed && leftOfMiddle ? -1 : 1) * (xOffset || 0);
          var y = yVal + (allowOffsetToBeReversed && aboveMiddle ? -1 : 1) * (yOffset || 0);

          var hasRotationValueSet = d.rotation === 0 || d.rotation;
          var labelRotation = hasRotationValueSet ? d.rotation : rotation;
          var attrs = _extends$j({
            dominantBaseline: getDominantBaseline(labelAnchorY, aboveMiddle),
            className: 'rv-xy-plot__series--label-text',
            key: i,
            onClick: function onClick(e) {
              return _this2._valueClickHandler(d, e);
            },
            onContextMenu: function onContextMenu(e) {
              return _this2._valueRightClickHandler(d, e);
            },
            onMouseOver: function onMouseOver(e) {
              return _this2._valueMouseOverHandler(d, e);
            },
            onMouseOut: function onMouseOut(e) {
              return _this2._valueMouseOutHandler(d, e);
            },
            textAnchor: getTextAnchor(labelAnchorX, leftOfMiddle),
            x: x,
            y: y,
            transform: 'rotate(' + labelRotation + ',' + x + ',' + y + ')'
          }, markStyle);
          var textContent = getLabel(_data ? _data[i] : d);
          return res.concat([react.createElement(
            'text',
            attrs,
            textContent
          )]);
        }, [])
      );
    }
  }]);

  return LabelSeries;
}(AbstractSeries);

LabelSeries.propTypes = {
  animation: propTypes.bool,
  allowOffsetToBeReversed: propTypes.bool,
  className: propTypes.string,
  data: propTypes.arrayOf(propTypes.shape({
    x: propTypes.oneOfType([propTypes.number, propTypes.string]),
    y: propTypes.oneOfType([propTypes.number, propTypes.string]),
    angle: propTypes.number,
    radius: propTypes.number,
    label: propTypes.string,
    xOffset: propTypes.number,
    yOffset: propTypes.number,
    style: propTypes.object
  })).isRequired,
  marginLeft: propTypes.number,
  marginTop: propTypes.number,
  rotation: propTypes.number,
  style: propTypes.object,
  xRange: propTypes.arrayOf(propTypes.number),
  yRange: propTypes.arrayOf(propTypes.number),
  labelAnchorX: propTypes.string,
  labelAnchorY: propTypes.string
};
LabelSeries.defaultProps = _extends$j({}, AbstractSeries.defaultProps, {
  animation: false,
  rotation: 0,
  getLabel: function getLabel(d) {
    return d.label;
  }
});
LabelSeries.displayName = 'LabelSeries';

var _extends$k = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$h = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$h(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$h(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$h(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$4 = 'rv-xy-plot__series rv-xy-plot__series--polygon';
var DEFAULT_COLOR$1 = '#12939A';

var generatePath = function generatePath(data, xFunctor, yFunctor) {
  return data.reduce(function (res, row, i) {
    return res + ' ' + (i ? 'L' : 'M') + xFunctor(row) + ' ' + yFunctor(row);
  }, '') + ' Z';
};

var PolygonSeries = function (_AbstractSeries) {
  _inherits$h(PolygonSeries, _AbstractSeries);

  function PolygonSeries() {
    _classCallCheck$h(this, PolygonSeries);

    return _possibleConstructorReturn$h(this, (PolygonSeries.__proto__ || Object.getPrototypeOf(PolygonSeries)).apply(this, arguments));
  }

  _createClass$h(PolygonSeries, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          animation = _props.animation,
          color = _props.color,
          className = _props.className,
          data = _props.data,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          style = _props.style;


      if (!data) {
        return null;
      }

      if (animation) {
        return react.createElement(
          Animation,
          _extends$k({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(PolygonSeries, _extends$k({}, this.props, { animation: null }))
        );
      }
      var xFunctor = this._getAttributeFunctor('x');
      var yFunctor = this._getAttributeFunctor('y');

      return react.createElement('path', {
        className: predefinedClassName$4 + ' ' + className,
        onMouseOver: function onMouseOver(e) {
          return _this2._seriesMouseOverHandler(data, e);
        },
        onMouseOut: function onMouseOut(e) {
          return _this2._seriesMouseOutHandler(data, e);
        },
        onClick: this._seriesClickHandler,
        onContextMenu: this._seriesRightClickHandler,
        fill: color || DEFAULT_COLOR$1,
        style: style,
        d: generatePath(data, xFunctor, yFunctor),
        transform: 'translate(' + marginLeft + ',' + marginTop + ')'
      });
    }
  }], [{
    key: 'propTypes',
    get: function get() {
      return _extends$k({}, AbstractSeries.propTypes);
    }
  }]);

  return PolygonSeries;
}(AbstractSeries);

PolygonSeries.displayName = 'PolygonSeries';

var _extends$l = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$i = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$i(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$i(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$i(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$5 = 'rv-xy-plot__series rv-xy-plot__series--mark';
var DEFAULT_STROKE_WIDTH = 1;

var MarkSeries = function (_AbstractSeries) {
  _inherits$i(MarkSeries, _AbstractSeries);

  function MarkSeries() {
    _classCallCheck$i(this, MarkSeries);

    return _possibleConstructorReturn$i(this, (MarkSeries.__proto__ || Object.getPrototypeOf(MarkSeries)).apply(this, arguments));
  }

  _createClass$i(MarkSeries, [{
    key: '_renderCircle',
    value: function _renderCircle(d, i, strokeWidth, style, scalingFunctions) {
      var _this2 = this;

      var fill = scalingFunctions.fill,
          opacity = scalingFunctions.opacity,
          size = scalingFunctions.size,
          stroke = scalingFunctions.stroke,
          x = scalingFunctions.x,
          y = scalingFunctions.y;


      var attrs = {
        r: size ? size(d) : DEFAULT_SIZE,
        cx: x(d),
        cy: y(d),
        style: _extends$l({
          opacity: opacity ? opacity(d) : DEFAULT_OPACITY,
          stroke: stroke && stroke(d),
          fill: fill && fill(d),
          strokeWidth: strokeWidth || DEFAULT_STROKE_WIDTH
        }, style),
        key: i,
        onClick: function onClick(e) {
          return _this2._valueClickHandler(d, e);
        },
        onContextMenu: function onContextMenu(e) {
          return _this2._valueRightClickHandler(d, e);
        },
        onMouseOver: function onMouseOver(e) {
          return _this2._valueMouseOverHandler(d, e);
        },
        onMouseOut: function onMouseOut(e) {
          return _this2._valueMouseOutHandler(d, e);
        }
      };
      return react.createElement('circle', attrs);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          data = _props.data,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          strokeWidth = _props.strokeWidth,
          style = _props.style;


      if (this.props.nullAccessor) {
        warning('nullAccessor has been renamed to getNull', true);
      }

      var getNull = this.props.nullAccessor || this.props.getNull;

      if (!data) {
        return null;
      }

      if (animation) {
        return react.createElement(
          Animation,
          _extends$l({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(MarkSeries, _extends$l({}, this.props, { animation: null }))
        );
      }

      var scalingFunctions = {
        fill: this._getAttributeFunctor('fill') || this._getAttributeFunctor('color'),
        opacity: this._getAttributeFunctor('opacity'),
        size: this._getAttributeFunctor('size'),
        stroke: this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color'),
        x: this._getAttributeFunctor('x'),
        y: this._getAttributeFunctor('y')
      };

      return react.createElement(
        'g',
        {
          className: predefinedClassName$5 + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        data.map(function (d, i) {
          return getNull(d) && _this3._renderCircle(d, i, strokeWidth, style, scalingFunctions);
        })
      );
    }
  }]);

  return MarkSeries;
}(AbstractSeries);

MarkSeries.displayName = 'MarkSeries';
MarkSeries.propTypes = _extends$l({}, AbstractSeries.propTypes, {
  getNull: propTypes.func,
  strokeWidth: propTypes.number
});
MarkSeries.defaultProps = {
  getNull: function getNull() {
    return true;
  }
};

var _extends$m = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$j = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$j(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$j(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$j(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MarkSeriesCanvas = function (_AbstractSeries) {
  _inherits$j(MarkSeriesCanvas, _AbstractSeries);

  function MarkSeriesCanvas() {
    _classCallCheck$j(this, MarkSeriesCanvas);

    return _possibleConstructorReturn$j(this, (MarkSeriesCanvas.__proto__ || Object.getPrototypeOf(MarkSeriesCanvas)).apply(this, arguments));
  }

  _createClass$j(MarkSeriesCanvas, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }], [{
    key: 'renderLayer',
    value: function renderLayer(props, ctx) {
      var data = props.data,
          marginLeft = props.marginLeft,
          marginTop = props.marginTop;


      var x = getAttributeFunctor(props, 'x');
      var y = getAttributeFunctor(props, 'y');
      var size = getAttributeFunctor(props, 'size') || function (p) {
        return DEFAULT_SIZE;
      };
      var fill = getAttributeFunctor(props, 'fill') || getAttributeFunctor(props, 'color');
      var stroke = getAttributeFunctor(props, 'stroke') || getAttributeFunctor(props, 'color');
      var opacity = getAttributeFunctor(props, 'opacity');

      data.forEach(function (row) {
        var fillColor = rgb(fill(row));
        var strokeColor = rgb(stroke(row));
        var rowOpacity = opacity(row) || DEFAULT_OPACITY;
        ctx.beginPath();
        ctx.arc(x(row) + marginLeft, y(row) + marginTop, size(row), 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(' + fillColor.r + ', ' + fillColor.g + ', ' + fillColor.b + ', ' + rowOpacity + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(' + strokeColor.r + ', ' + strokeColor.g + ', ' + strokeColor.b + ', ' + rowOpacity + ')';
        ctx.stroke();
      });
    }
  }, {
    key: 'requiresSVG',
    get: function get() {
      return false;
    }
  }, {
    key: 'isCanvas',
    get: function get() {
      return true;
    }
  }]);

  return MarkSeriesCanvas;
}(AbstractSeries);

MarkSeriesCanvas.displayName = 'MarkSeriesCanvas';

MarkSeriesCanvas.propTypes = _extends$m({}, AbstractSeries.propTypes);

var _createClass$k = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends$n = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$k(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$k(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$k(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$6 = 'rv-xy-plot__series rv-xy-plot__series--whisker';
var DEFAULT_STROKE_WIDTH$1 = 1;
var DEFAULT_CROSS_BAR_WIDTH = 6;

/**
 * Render whisker lines for a data point.
 * @param {Object} whiskerMarkProps All the properties of the whisker mark.
 * @private
 */
var renderWhiskerMark = function renderWhiskerMark(whiskerMarkProps) {
  return function (d, i) {
    var crossBarWidth = whiskerMarkProps.crossBarWidth,
        opacityFunctor = whiskerMarkProps.opacityFunctor,
        sizeFunctor = whiskerMarkProps.sizeFunctor,
        strokeFunctor = whiskerMarkProps.strokeFunctor,
        strokeWidth = whiskerMarkProps.strokeWidth,
        style = whiskerMarkProps.style,
        valueClickHandler = whiskerMarkProps.valueClickHandler,
        valueMouseOutHandler = whiskerMarkProps.valueMouseOutHandler,
        valueMouseOverHandler = whiskerMarkProps.valueMouseOverHandler,
        valueRightClickHandler = whiskerMarkProps.valueRightClickHandler,
        xFunctor = whiskerMarkProps.xFunctor,
        yFunctor = whiskerMarkProps.yFunctor;


    var r = sizeFunctor ? sizeFunctor(d) : 0;
    var cx = xFunctor(d);
    var cy = yFunctor(d);
    var positiveXVariance = xFunctor({ x: d.x + d.xVariance / 2 });
    var negativeXVariance = xFunctor({ x: d.x - d.xVariance / 2 });
    var positiveYVariance = yFunctor({ y: d.y + d.yVariance / 2 });
    var negativeYVariance = yFunctor({ y: d.y - d.yVariance / 2 });
    /**
     * Determine whether on not we should draw whiskers in each direction.
     * We need to see an actual variance value, and also have that value extend past the
     * radius "buffer" region in which we won't be drawing (if any).
     */
    var hasXWhiskers = positiveXVariance && cx + r < positiveXVariance;
    var hasYWhiskers = positiveYVariance && cy - r > positiveYVariance;
    if (!hasXWhiskers && !hasYWhiskers) {
      return null;
    }

    var styleAttr = _extends$n({
      opacity: opacityFunctor ? opacityFunctor(d) : DEFAULT_OPACITY,
      stroke: strokeFunctor && strokeFunctor(d),
      strokeWidth: strokeWidth || DEFAULT_STROKE_WIDTH$1
    }, style);
    var crossBarExtension = crossBarWidth / 2;

    var rightLineAttrs = {
      x1: cx + r,
      y1: cy,
      x2: positiveXVariance,
      y2: cy,
      style: styleAttr
    };
    var leftLineAttrs = {
      x1: cx - r,
      y1: cy,
      x2: negativeXVariance,
      y2: cy,
      style: styleAttr
    };
    var rightCrossBarAttrs = {
      x1: positiveXVariance,
      y1: cy - crossBarExtension,
      x2: positiveXVariance,
      y2: cy + crossBarExtension,
      style: styleAttr
    };
    var leftCrossBarAttrs = {
      x1: negativeXVariance,
      y1: cy - crossBarExtension,
      x2: negativeXVariance,
      y2: cy + crossBarExtension,
      style: styleAttr
    };

    var upperLineAttrs = {
      x1: cx,
      y1: cy - r,
      x2: cx,
      y2: positiveYVariance,
      style: styleAttr
    };
    var lowerLineAttrs = {
      x1: cx,
      y1: cy + r,
      x2: cx,
      y2: negativeYVariance,
      style: styleAttr
    };
    var upperCrossBarAttrs = {
      x1: cx - crossBarExtension,
      y1: positiveYVariance,
      x2: cx + crossBarExtension,
      y2: positiveYVariance,
      style: styleAttr
    };
    var lowerCrossBarAttrs = {
      x1: cx - crossBarExtension,
      y1: negativeYVariance,
      x2: cx + crossBarExtension,
      y2: negativeYVariance,
      style: styleAttr
    };

    return react.createElement(
      'g',
      {
        className: 'mark-whiskers',
        key: i,
        onClick: function onClick(e) {
          return valueClickHandler(d, e);
        },
        onContextMenu: function onContextMenu(e) {
          return valueRightClickHandler(d, e);
        },
        onMouseOver: function onMouseOver(e) {
          return valueMouseOverHandler(d, e);
        },
        onMouseOut: function onMouseOut(e) {
          return valueMouseOutHandler(d, e);
        }
      },
      hasXWhiskers ? react.createElement(
        'g',
        { className: 'x-whiskers' },
        react.createElement('line', rightLineAttrs),
        react.createElement('line', leftLineAttrs),
        react.createElement('line', rightCrossBarAttrs),
        react.createElement('line', leftCrossBarAttrs)
      ) : null,
      hasYWhiskers ? react.createElement(
        'g',
        { className: 'y-whiskers' },
        react.createElement('line', upperLineAttrs),
        react.createElement('line', lowerLineAttrs),
        react.createElement('line', upperCrossBarAttrs),
        react.createElement('line', lowerCrossBarAttrs)
      ) : null
    );
  };
};

var WhiskerSeries = function (_AbstractSeries) {
  _inherits$k(WhiskerSeries, _AbstractSeries);

  function WhiskerSeries() {
    _classCallCheck$k(this, WhiskerSeries);

    return _possibleConstructorReturn$k(this, (WhiskerSeries.__proto__ || Object.getPrototypeOf(WhiskerSeries)).apply(this, arguments));
  }

  _createClass$k(WhiskerSeries, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          crossBarWidth = _props.crossBarWidth,
          data = _props.data,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          strokeWidth = _props.strokeWidth,
          style = _props.style;

      if (!data) {
        return null;
      }
      if (animation) {
        return react.createElement(
          Animation,
          _extends$n({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(WhiskerSeries, _extends$n({}, this.props, { animation: null }))
        );
      }

      var whiskerMarkProps = {
        crossBarWidth: crossBarWidth,
        opacityFunctor: this._getAttributeFunctor('opacity'),
        sizeFunctor: this._getAttributeFunctor('size'),
        strokeFunctor: this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color'),
        strokeWidth: strokeWidth,
        style: style,
        xFunctor: this._getAttributeFunctor('x'),
        yFunctor: this._getAttributeFunctor('y'),
        valueClickHandler: this._valueClickHandler,
        valueRightClickHandler: this._valueRightClickHandler,
        valueMouseOverHandler: this._valueMouseOverHandler,
        valueMouseOutHandler: this._valueMouseOutHandler
      };

      return react.createElement(
        'g',
        {
          className: predefinedClassName$6 + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        data.map(renderWhiskerMark(whiskerMarkProps))
      );
    }
  }]);

  return WhiskerSeries;
}(AbstractSeries);

WhiskerSeries.displayName = 'WhiskerSeries';
WhiskerSeries.propTypes = _extends$n({}, AbstractSeries.propTypes, {
  strokeWidth: propTypes.number
});
WhiskerSeries.defaultProps = _extends$n({}, AbstractSeries.defaultProps, {
  crossBarWidth: DEFAULT_CROSS_BAR_WIDTH,
  size: 0,
  strokeWidth: DEFAULT_STROKE_WIDTH$1
});

var _extends$o = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$l = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$l(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$l(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$l(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$7 = 'rv-xy-plot__series rv-xy-plot__series--heatmap';

var HeatmapSeries = function (_AbstractSeries) {
  _inherits$l(HeatmapSeries, _AbstractSeries);

  function HeatmapSeries() {
    _classCallCheck$l(this, HeatmapSeries);

    return _possibleConstructorReturn$l(this, (HeatmapSeries.__proto__ || Object.getPrototypeOf(HeatmapSeries)).apply(this, arguments));
  }

  _createClass$l(HeatmapSeries, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          data = _props.data,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          style = _props.style;

      if (!data) {
        return null;
      }
      if (animation) {
        return react.createElement(
          Animation,
          _extends$o({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(HeatmapSeries, _extends$o({}, this.props, { animation: null }))
        );
      }

      var _rectStyle$style = _extends$o({ rectStyle: {} }, style),
          rectStyle = _rectStyle$style.rectStyle;

      var x = this._getAttributeFunctor('x');
      var y = this._getAttributeFunctor('y');
      var opacity = this._getAttributeFunctor('opacity');
      var fill = this._getAttributeFunctor('fill') || this._getAttributeFunctor('color');
      var stroke = this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color');
      var xDistance = this._getScaleDistance('x');
      var yDistance = this._getScaleDistance('y');
      return react.createElement(
        'g',
        {
          className: predefinedClassName$7 + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        data.map(function (d, i) {
          var attrs = _extends$o({
            style: _extends$o({
              stroke: stroke && stroke(d),
              fill: fill && fill(d),
              opacity: opacity && opacity(d)
            }, style)
          }, rectStyle, {
            x: x(d) - xDistance / 2,
            y: y(d) - yDistance / 2,
            width: xDistance,
            height: yDistance,
            key: i,
            onClick: function onClick(e) {
              return _this2._valueClickHandler(d, e);
            },
            onContextMenu: function onContextMenu(e) {
              return _this2._valueRightClickHandler(d, e);
            },
            onMouseOver: function onMouseOver(e) {
              return _this2._valueMouseOverHandler(d, e);
            },
            onMouseOut: function onMouseOut(e) {
              return _this2._valueMouseOutHandler(d, e);
            }
          });
          return react.createElement('rect', attrs);
        })
      );
    }
  }], [{
    key: 'getParentConfig',
    value: function getParentConfig(attr) {
      var isDomainAdjustmentNeeded = attr === 'x' || attr === 'y';
      return { isDomainAdjustmentNeeded: isDomainAdjustmentNeeded };
    }
  }]);

  return HeatmapSeries;
}(AbstractSeries);

HeatmapSeries.propTypes = _extends$o({}, AbstractSeries.propTypes);

HeatmapSeries.displayName = 'HeatmapSeries';

var thirdPi = Math.PI / 3,
    angles = [0, thirdPi, 2 * thirdPi, 3 * thirdPi, 4 * thirdPi, 5 * thirdPi];

function pointX(d) {
  return d[0];
}

function pointY(d) {
  return d[1];
}

function hexbin() {
  var x0 = 0,
      y0 = 0,
      x1 = 1,
      y1 = 1,
      x = pointX,
      y = pointY,
      r,
      dx,
      dy;

  function hexbin(points) {
    var binsById = {}, bins = [], i, n = points.length;

    for (i = 0; i < n; ++i) {
      if (isNaN(px = +x.call(null, point = points[i], i, points))
          || isNaN(py = +y.call(null, point, i, points))) continue;

      var point,
          px,
          py,
          pj = Math.round(py = py / dy),
          pi = Math.round(px = px / dx - (pj & 1) / 2),
          py1 = py - pj;

      if (Math.abs(py1) * 3 > 1) {
        var px1 = px - pi,
            pi2 = pi + (px < pi ? -1 : 1) / 2,
            pj2 = pj + (py < pj ? -1 : 1),
            px2 = px - pi2,
            py2 = py - pj2;
        if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) pi = pi2 + (pj & 1 ? 1 : -1) / 2, pj = pj2;
      }

      var id = pi + "-" + pj, bin = binsById[id];
      if (bin) bin.push(point);
      else {
        bins.push(bin = binsById[id] = [point]);
        bin.x = (pi + (pj & 1) / 2) * dx;
        bin.y = pj * dy;
      }
    }

    return bins;
  }

  function hexagon(radius) {
    var x0 = 0, y0 = 0;
    return angles.map(function(angle) {
      var x1 = Math.sin(angle) * radius,
          y1 = -Math.cos(angle) * radius,
          dx = x1 - x0,
          dy = y1 - y0;
      x0 = x1, y0 = y1;
      return [dx, dy];
    });
  }

  hexbin.hexagon = function(radius) {
    return "m" + hexagon(radius == null ? r : +radius).join("l") + "z";
  };

  hexbin.centers = function() {
    var centers = [],
        j = Math.round(y0 / dy),
        i = Math.round(x0 / dx);
    for (var y = j * dy; y < y1 + r; y += dy, ++j) {
      for (var x = i * dx + (j & 1) * dx / 2; x < x1 + dx / 2; x += dx) {
        centers.push([x, y]);
      }
    }
    return centers;
  };

  hexbin.mesh = function() {
    var fragment = hexagon(r).slice(0, 4).join("l");
    return hexbin.centers().map(function(p) { return "M" + p + "m" + fragment; }).join("");
  };

  hexbin.x = function(_) {
    return arguments.length ? (x = _, hexbin) : x;
  };

  hexbin.y = function(_) {
    return arguments.length ? (y = _, hexbin) : y;
  };

  hexbin.radius = function(_) {
    return arguments.length ? (r = +_, dx = r * 2 * Math.sin(thirdPi), dy = r * 1.5, hexbin) : r;
  };

  hexbin.size = function(_) {
    return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], hexbin) : [x1 - x0, y1 - y0];
  };

  hexbin.extent = function(_) {
    return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], hexbin) : [[x0, y0], [x1, y1]];
  };

  return hexbin.radius(1);
}

var _extends$p = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$m = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$m(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$m(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$m(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var predefinedClassName$8 = 'rv-xy-plot__series rv-xy-plot__series--hexbin';

function getColorDomain(_ref, hexes) {
  var countDomain = _ref.countDomain;

  if (countDomain) {
    return countDomain;
  }
  return [0, Math.max.apply(Math, _toConsumableArray$1(hexes.map(function (row) {
    return row.length;
  })))];
}

var HexbinSeries = function (_AbstractSeries) {
  _inherits$m(HexbinSeries, _AbstractSeries);

  function HexbinSeries() {
    _classCallCheck$m(this, HexbinSeries);

    return _possibleConstructorReturn$m(this, (HexbinSeries.__proto__ || Object.getPrototypeOf(HexbinSeries)).apply(this, arguments));
  }

  _createClass$m(HexbinSeries, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          colorRange = _props.colorRange,
          data = _props.data,
          innerHeight = _props.innerHeight,
          innerWidth = _props.innerWidth,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          radius = _props.radius,
          sizeHexagonsWithCount = _props.sizeHexagonsWithCount,
          style = _props.style,
          xOffset = _props.xOffset,
          yOffset = _props.yOffset;


      if (!data) {
        return null;
      }

      if (animation) {
        return react.createElement(
          Animation,
          _extends$p({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(HexbinSeries, _extends$p({}, this.props, { animation: null }))
        );
      }
      var x = this._getAttributeFunctor('x');
      var y = this._getAttributeFunctor('y');

      var hex = hexbin().x(function (d) {
        return x(d) + xOffset;
      }).y(function (d) {
        return y(d) + yOffset;
      }).radius(radius).size([innerWidth, innerHeight]);

      var hexagonPath = hex.hexagon();
      var hexes = hex(data);

      var countDomain = getColorDomain(this.props, hexes);
      var color = linear$1().domain(countDomain).range(colorRange);
      var size = linear$1().domain(countDomain).range([0, radius]);
      return react.createElement(
        'g',
        {
          className: predefinedClassName$8 + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        hexes.map(function (d, i) {
          var attrs = {
            style: style,
            d: sizeHexagonsWithCount ? hex.hexagon(size(d.length)) : hexagonPath,
            fill: color(d.length),
            transform: 'translate(' + d.x + ', ' + d.y + ')',
            key: i,
            onClick: function onClick(e) {
              return _this2._valueClickHandler(d, e);
            },
            onContextMenu: function onContextMenu(e) {
              return _this2._valueRightClickHandler(d, e);
            },
            onMouseOver: function onMouseOver(e) {
              return _this2._valueMouseOverHandler(d, e);
            },
            onMouseOut: function onMouseOut(e) {
              return _this2._valueMouseOutHandler(d, e);
            }
          };
          return react.createElement('path', attrs);
        })
      );
    }
  }]);

  return HexbinSeries;
}(AbstractSeries);

HexbinSeries.propTypes = _extends$p({}, AbstractSeries.propTypes, {
  radius: propTypes.number
});

HexbinSeries.defaultProps = {
  radius: 20,
  colorRange: CONTINUOUS_COLOR_RANGE,
  xOffset: 0,
  yOffset: 0
};

HexbinSeries.displayName = 'HexbinSeries';

var array$3 = Array.prototype;

var slice$3 = array$3.slice;

function ascending$2(a, b) {
  return a - b;
}

function area$1(ring) {
  var i = 0, n = ring.length, area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
  while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
  return area;
}

function constant$5(x) {
  return function() {
    return x;
  };
}

function contains(ring, hole) {
  var i = -1, n = hole.length, c;
  while (++i < n) if (c = ringContains(ring, hole[i])) return c;
  return 0;
}

function ringContains(ring, point) {
  var x = point[0], y = point[1], contains = -1;
  for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
    var pi = ring[i], xi = pi[0], yi = pi[1], pj = ring[j], xj = pj[0], yj = pj[1];
    if (segmentContains(pi, pj, point)) return 0;
    if (((yi > y) !== (yj > y)) && ((x < (xj - xi) * (y - yi) / (yj - yi) + xi))) contains = -contains;
  }
  return contains;
}

function segmentContains(a, b, c) {
  var i; return collinear(a, b, c) && within(a[i = +(a[0] === b[0])], c[i], b[i]);
}

function collinear(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) === (c[0] - a[0]) * (b[1] - a[1]);
}

function within(p, q, r) {
  return p <= q && q <= r || r <= q && q <= p;
}

function noop$2() {}

var cases = [
  [],
  [[[1.0, 1.5], [0.5, 1.0]]],
  [[[1.5, 1.0], [1.0, 1.5]]],
  [[[1.5, 1.0], [0.5, 1.0]]],
  [[[1.0, 0.5], [1.5, 1.0]]],
  [[[1.0, 1.5], [0.5, 1.0]], [[1.0, 0.5], [1.5, 1.0]]],
  [[[1.0, 0.5], [1.0, 1.5]]],
  [[[1.0, 0.5], [0.5, 1.0]]],
  [[[0.5, 1.0], [1.0, 0.5]]],
  [[[1.0, 1.5], [1.0, 0.5]]],
  [[[0.5, 1.0], [1.0, 0.5]], [[1.5, 1.0], [1.0, 1.5]]],
  [[[1.5, 1.0], [1.0, 0.5]]],
  [[[0.5, 1.0], [1.5, 1.0]]],
  [[[1.0, 1.5], [1.5, 1.0]]],
  [[[0.5, 1.0], [1.0, 1.5]]],
  []
];

function contours() {
  var dx = 1,
      dy = 1,
      threshold$$1 = thresholdSturges,
      smooth = smoothLinear;

  function contours(values) {
    var tz = threshold$$1(values);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      var domain = extent(values), start = domain[0], stop = domain[1];
      tz = tickStep(start, stop, tz);
      tz = range(Math.floor(start / tz) * tz, Math.floor(stop / tz) * tz, tz);
    } else {
      tz = tz.slice().sort(ascending$2);
    }

    return tz.map(function(value) {
      return contour(values, value);
    });
  }

  // Accumulate, smooth contour rings, assign holes to exterior rings.
  // Based on https://github.com/mbostock/shapefile/blob/v0.6.2/shp/polygon.js
  function contour(values, value) {
    var polygons = [],
        holes = [];

    isorings(values, value, function(ring) {
      smooth(ring, values, value);
      if (area$1(ring) > 0) polygons.push([ring]);
      else holes.push(ring);
    });

    holes.forEach(function(hole) {
      for (var i = 0, n = polygons.length, polygon; i < n; ++i) {
        if (contains((polygon = polygons[i])[0], hole) !== -1) {
          polygon.push(hole);
          return;
        }
      }
    });

    return {
      type: "MultiPolygon",
      value: value,
      coordinates: polygons
    };
  }

  // Marching squares with isolines stitched into rings.
  // Based on https://github.com/topojson/topojson-client/blob/v3.0.0/src/stitch.js
  function isorings(values, value, callback) {
    var fragmentByStart = new Array,
        fragmentByEnd = new Array,
        x, y, t0, t1, t2, t3;

    // Special case for the first row (y = -1, t2 = t3 = 0).
    x = y = -1;
    t1 = values[0] >= value;
    cases[t1 << 1].forEach(stitch);
    while (++x < dx - 1) {
      t0 = t1, t1 = values[x + 1] >= value;
      cases[t0 | t1 << 1].forEach(stitch);
    }
    cases[t1 << 0].forEach(stitch);

    // General case for the intermediate rows.
    while (++y < dy - 1) {
      x = -1;
      t1 = values[y * dx + dx] >= value;
      t2 = values[y * dx] >= value;
      cases[t1 << 1 | t2 << 2].forEach(stitch);
      while (++x < dx - 1) {
        t0 = t1, t1 = values[y * dx + dx + x + 1] >= value;
        t3 = t2, t2 = values[y * dx + x + 1] >= value;
        cases[t0 | t1 << 1 | t2 << 2 | t3 << 3].forEach(stitch);
      }
      cases[t1 | t2 << 3].forEach(stitch);
    }

    // Special case for the last row (y = dy - 1, t0 = t1 = 0).
    x = -1;
    t2 = values[y * dx] >= value;
    cases[t2 << 2].forEach(stitch);
    while (++x < dx - 1) {
      t3 = t2, t2 = values[y * dx + x + 1] >= value;
      cases[t2 << 2 | t3 << 3].forEach(stitch);
    }
    cases[t2 << 3].forEach(stitch);

    function stitch(line) {
      var start = [line[0][0] + x, line[0][1] + y],
          end = [line[1][0] + x, line[1][1] + y],
          startIndex = index(start),
          endIndex = index(end),
          f, g;
      if (f = fragmentByEnd[startIndex]) {
        if (g = fragmentByStart[endIndex]) {
          delete fragmentByEnd[f.end];
          delete fragmentByStart[g.start];
          if (f === g) {
            f.ring.push(end);
            callback(f.ring);
          } else {
            fragmentByStart[f.start] = fragmentByEnd[g.end] = {start: f.start, end: g.end, ring: f.ring.concat(g.ring)};
          }
        } else {
          delete fragmentByEnd[f.end];
          f.ring.push(end);
          fragmentByEnd[f.end = endIndex] = f;
        }
      } else if (f = fragmentByStart[endIndex]) {
        if (g = fragmentByEnd[startIndex]) {
          delete fragmentByStart[f.start];
          delete fragmentByEnd[g.end];
          if (f === g) {
            f.ring.push(end);
            callback(f.ring);
          } else {
            fragmentByStart[g.start] = fragmentByEnd[f.end] = {start: g.start, end: f.end, ring: g.ring.concat(f.ring)};
          }
        } else {
          delete fragmentByStart[f.start];
          f.ring.unshift(start);
          fragmentByStart[f.start = startIndex] = f;
        }
      } else {
        fragmentByStart[startIndex] = fragmentByEnd[endIndex] = {start: startIndex, end: endIndex, ring: [start, end]};
      }
    }
  }

  function index(point) {
    return point[0] * 2 + point[1] * (dx + 1) * 4;
  }

  function smoothLinear(ring, values, value) {
    ring.forEach(function(point) {
      var x = point[0],
          y = point[1],
          xt = x | 0,
          yt = y | 0,
          v0,
          v1 = values[yt * dx + xt];
      if (x > 0 && x < dx && xt === x) {
        v0 = values[yt * dx + xt - 1];
        point[0] = x + (value - v0) / (v1 - v0) - 0.5;
      }
      if (y > 0 && y < dy && yt === y) {
        v0 = values[(yt - 1) * dx + xt];
        point[1] = y + (value - v0) / (v1 - v0) - 0.5;
      }
    });
  }

  contours.contour = contour;

  contours.size = function(_) {
    if (!arguments.length) return [dx, dy];
    var _0 = Math.ceil(_[0]), _1 = Math.ceil(_[1]);
    if (!(_0 > 0) || !(_1 > 0)) throw new Error("invalid size");
    return dx = _0, dy = _1, contours;
  };

  contours.thresholds = function(_) {
    return arguments.length ? (threshold$$1 = typeof _ === "function" ? _ : Array.isArray(_) ? constant$5(slice$3.call(_)) : constant$5(_), contours) : threshold$$1;
  };

  contours.smooth = function(_) {
    return arguments.length ? (smooth = _ ? smoothLinear : noop$2, contours) : smooth === smoothLinear;
  };

  return contours;
}

// TODO Optimize edge cases.
// TODO Optimize index calculation.
// TODO Optimize arguments.
function blurX(source, target, r) {
  var n = source.width,
      m = source.height,
      w = (r << 1) + 1;
  for (var j = 0; j < m; ++j) {
    for (var i = 0, sr = 0; i < n + r; ++i) {
      if (i < n) {
        sr += source.data[i + j * n];
      }
      if (i >= r) {
        if (i >= w) {
          sr -= source.data[i - w + j * n];
        }
        target.data[i - r + j * n] = sr / Math.min(i + 1, n - 1 + w - i, w);
      }
    }
  }
}

// TODO Optimize edge cases.
// TODO Optimize index calculation.
// TODO Optimize arguments.
function blurY(source, target, r) {
  var n = source.width,
      m = source.height,
      w = (r << 1) + 1;
  for (var i = 0; i < n; ++i) {
    for (var j = 0, sr = 0; j < m + r; ++j) {
      if (j < m) {
        sr += source.data[i + j * n];
      }
      if (j >= r) {
        if (j >= w) {
          sr -= source.data[i + (j - w) * n];
        }
        target.data[i + (j - r) * n] = sr / Math.min(j + 1, m - 1 + w - j, w);
      }
    }
  }
}

function defaultX(d) {
  return d[0];
}

function defaultY(d) {
  return d[1];
}

function defaultWeight() {
  return 1;
}

function contourDensity() {
  var x = defaultX,
      y = defaultY,
      weight = defaultWeight,
      dx = 960,
      dy = 500,
      r = 20, // blur radius
      k = 2, // log2(grid cell size)
      o = r * 3, // grid offset, to pad for blur
      n = (dx + o * 2) >> k, // grid width
      m = (dy + o * 2) >> k, // grid height
      threshold$$1 = constant$5(20);

  function density(data) {
    var values0 = new Float32Array(n * m),
        values1 = new Float32Array(n * m);

    data.forEach(function(d, i, data) {
      var xi = (+x(d, i, data) + o) >> k,
          yi = (+y(d, i, data) + o) >> k,
          wi = +weight(d, i, data);
      if (xi >= 0 && xi < n && yi >= 0 && yi < m) {
        values0[xi + yi * n] += wi;
      }
    });

    // TODO Optimize.
    blurX({width: n, height: m, data: values0}, {width: n, height: m, data: values1}, r >> k);
    blurY({width: n, height: m, data: values1}, {width: n, height: m, data: values0}, r >> k);
    blurX({width: n, height: m, data: values0}, {width: n, height: m, data: values1}, r >> k);
    blurY({width: n, height: m, data: values1}, {width: n, height: m, data: values0}, r >> k);
    blurX({width: n, height: m, data: values0}, {width: n, height: m, data: values1}, r >> k);
    blurY({width: n, height: m, data: values1}, {width: n, height: m, data: values0}, r >> k);

    var tz = threshold$$1(values0);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      var stop = max(values0);
      tz = tickStep(0, stop, tz);
      tz = range(0, Math.floor(stop / tz) * tz, tz);
      tz.shift();
    }

    return contours()
        .thresholds(tz)
        .size([n, m])
      (values0)
        .map(transform);
  }

  function transform(geometry) {
    geometry.value *= Math.pow(2, -2 * k); // Density in points per square pixel.
    geometry.coordinates.forEach(transformPolygon);
    return geometry;
  }

  function transformPolygon(coordinates) {
    coordinates.forEach(transformRing);
  }

  function transformRing(coordinates) {
    coordinates.forEach(transformPoint);
  }

  // TODO Optimize.
  function transformPoint(coordinates) {
    coordinates[0] = coordinates[0] * Math.pow(2, k) - o;
    coordinates[1] = coordinates[1] * Math.pow(2, k) - o;
  }

  function resize() {
    o = r * 3;
    n = (dx + o * 2) >> k;
    m = (dy + o * 2) >> k;
    return density;
  }

  density.x = function(_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : constant$5(+_), density) : x;
  };

  density.y = function(_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : constant$5(+_), density) : y;
  };

  density.weight = function(_) {
    return arguments.length ? (weight = typeof _ === "function" ? _ : constant$5(+_), density) : weight;
  };

  density.size = function(_) {
    if (!arguments.length) return [dx, dy];
    var _0 = Math.ceil(_[0]), _1 = Math.ceil(_[1]);
    if (!(_0 >= 0) && !(_0 >= 0)) throw new Error("invalid size");
    return dx = _0, dy = _1, resize();
  };

  density.cellSize = function(_) {
    if (!arguments.length) return 1 << k;
    if (!((_ = +_) >= 1)) throw new Error("invalid cell size");
    return k = Math.floor(Math.log(_) / Math.LN2), resize();
  };

  density.thresholds = function(_) {
    return arguments.length ? (threshold$$1 = typeof _ === "function" ? _ : Array.isArray(_) ? constant$5(slice$3.call(_)) : constant$5(_), density) : threshold$$1;
  };

  density.bandwidth = function(_) {
    if (!arguments.length) return Math.sqrt(r * (r + 1));
    if (!((_ = +_) >= 0)) throw new Error("invalid bandwidth");
    return r = Math.round((Math.sqrt(4 * _ * _ + 1) - 1) / 2), resize();
  };

  return density;
}

// Adds floating point numbers with twice the normal precision.
// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
// 305–363 (1997).
// Code adapted from GeographicLib by Charles F. F. Karney,
// http://geographiclib.sourceforge.net/

function adder() {
  return new Adder;
}

function Adder() {
  this.reset();
}

Adder.prototype = {
  constructor: Adder,
  reset: function() {
    this.s = // rounded value
    this.t = 0; // exact error
  },
  add: function(y) {
    add(temp, y, this.t);
    add(this, temp.s, this.s);
    if (this.s) this.t += temp.t;
    else this.s = temp.t;
  },
  valueOf: function() {
    return this.s;
  }
};

var temp = new Adder;

function add(adder, a, b) {
  var x = adder.s = a + b,
      bv = x - a,
      av = x - bv;
  adder.t = (a - av) + (b - bv);
}

var pi$2 = Math.PI;
var tau$2 = pi$2 * 2;

var abs$1 = Math.abs;
var sqrt$2 = Math.sqrt;

function noop$3() {}

function streamGeometry(geometry, stream) {
  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
    streamGeometryType[geometry.type](geometry, stream);
  }
}

var streamObjectType = {
  Feature: function(object, stream) {
    streamGeometry(object.geometry, stream);
  },
  FeatureCollection: function(object, stream) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) streamGeometry(features[i].geometry, stream);
  }
};

var streamGeometryType = {
  Sphere: function(object, stream) {
    stream.sphere();
  },
  Point: function(object, stream) {
    object = object.coordinates;
    stream.point(object[0], object[1], object[2]);
  },
  MultiPoint: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
  },
  LineString: function(object, stream) {
    streamLine(object.coordinates, stream, 0);
  },
  MultiLineString: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamLine(coordinates[i], stream, 0);
  },
  Polygon: function(object, stream) {
    streamPolygon(object.coordinates, stream);
  },
  MultiPolygon: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamPolygon(coordinates[i], stream);
  },
  GeometryCollection: function(object, stream) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) streamGeometry(geometries[i], stream);
  }
};

function streamLine(coordinates, stream, closed) {
  var i = -1, n = coordinates.length - closed, coordinate;
  stream.lineStart();
  while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
  stream.lineEnd();
}

function streamPolygon(coordinates, stream) {
  var i = -1, n = coordinates.length;
  stream.polygonStart();
  while (++i < n) streamLine(coordinates[i], stream, 1);
  stream.polygonEnd();
}

function geoStream(object, stream) {
  if (object && streamObjectType.hasOwnProperty(object.type)) {
    streamObjectType[object.type](object, stream);
  } else {
    streamGeometry(object, stream);
  }
}

var areaRingSum = adder();

var areaSum = adder();

var deltaSum = adder();

var sum$2 = adder();

var lengthSum = adder();

function identity$5(x) {
  return x;
}

var areaSum$1 = adder(),
    areaRingSum$1 = adder(),
    x00,
    y00,
    x0$1,
    y0$1;

var areaStream$1 = {
  point: noop$3,
  lineStart: noop$3,
  lineEnd: noop$3,
  polygonStart: function() {
    areaStream$1.lineStart = areaRingStart$1;
    areaStream$1.lineEnd = areaRingEnd$1;
  },
  polygonEnd: function() {
    areaStream$1.lineStart = areaStream$1.lineEnd = areaStream$1.point = noop$3;
    areaSum$1.add(abs$1(areaRingSum$1));
    areaRingSum$1.reset();
  },
  result: function() {
    var area = areaSum$1 / 2;
    areaSum$1.reset();
    return area;
  }
};

function areaRingStart$1() {
  areaStream$1.point = areaPointFirst$1;
}

function areaPointFirst$1(x, y) {
  areaStream$1.point = areaPoint$1;
  x00 = x0$1 = x, y00 = y0$1 = y;
}

function areaPoint$1(x, y) {
  areaRingSum$1.add(y0$1 * x - x0$1 * y);
  x0$1 = x, y0$1 = y;
}

function areaRingEnd$1() {
  areaPoint$1(x00, y00);
}

var x0$2 = Infinity,
    y0$2 = x0$2,
    x1 = -x0$2,
    y1 = x1;

var boundsStream$1 = {
  point: boundsPoint$1,
  lineStart: noop$3,
  lineEnd: noop$3,
  polygonStart: noop$3,
  polygonEnd: noop$3,
  result: function() {
    var bounds = [[x0$2, y0$2], [x1, y1]];
    x1 = y1 = -(y0$2 = x0$2 = Infinity);
    return bounds;
  }
};

function boundsPoint$1(x, y) {
  if (x < x0$2) x0$2 = x;
  if (x > x1) x1 = x;
  if (y < y0$2) y0$2 = y;
  if (y > y1) y1 = y;
}

// TODO Enforce positive area for exterior, negative area for interior?

var X0$1 = 0,
    Y0$1 = 0,
    Z0$1 = 0,
    X1$1 = 0,
    Y1$1 = 0,
    Z1$1 = 0,
    X2$1 = 0,
    Y2$1 = 0,
    Z2$1 = 0,
    x00$1,
    y00$1,
    x0$3,
    y0$3;

var centroidStream$1 = {
  point: centroidPoint$1,
  lineStart: centroidLineStart$1,
  lineEnd: centroidLineEnd$1,
  polygonStart: function() {
    centroidStream$1.lineStart = centroidRingStart$1;
    centroidStream$1.lineEnd = centroidRingEnd$1;
  },
  polygonEnd: function() {
    centroidStream$1.point = centroidPoint$1;
    centroidStream$1.lineStart = centroidLineStart$1;
    centroidStream$1.lineEnd = centroidLineEnd$1;
  },
  result: function() {
    var centroid = Z2$1 ? [X2$1 / Z2$1, Y2$1 / Z2$1]
        : Z1$1 ? [X1$1 / Z1$1, Y1$1 / Z1$1]
        : Z0$1 ? [X0$1 / Z0$1, Y0$1 / Z0$1]
        : [NaN, NaN];
    X0$1 = Y0$1 = Z0$1 =
    X1$1 = Y1$1 = Z1$1 =
    X2$1 = Y2$1 = Z2$1 = 0;
    return centroid;
  }
};

function centroidPoint$1(x, y) {
  X0$1 += x;
  Y0$1 += y;
  ++Z0$1;
}

function centroidLineStart$1() {
  centroidStream$1.point = centroidPointFirstLine;
}

function centroidPointFirstLine(x, y) {
  centroidStream$1.point = centroidPointLine;
  centroidPoint$1(x0$3 = x, y0$3 = y);
}

function centroidPointLine(x, y) {
  var dx = x - x0$3, dy = y - y0$3, z = sqrt$2(dx * dx + dy * dy);
  X1$1 += z * (x0$3 + x) / 2;
  Y1$1 += z * (y0$3 + y) / 2;
  Z1$1 += z;
  centroidPoint$1(x0$3 = x, y0$3 = y);
}

function centroidLineEnd$1() {
  centroidStream$1.point = centroidPoint$1;
}

function centroidRingStart$1() {
  centroidStream$1.point = centroidPointFirstRing;
}

function centroidRingEnd$1() {
  centroidPointRing(x00$1, y00$1);
}

function centroidPointFirstRing(x, y) {
  centroidStream$1.point = centroidPointRing;
  centroidPoint$1(x00$1 = x0$3 = x, y00$1 = y0$3 = y);
}

function centroidPointRing(x, y) {
  var dx = x - x0$3,
      dy = y - y0$3,
      z = sqrt$2(dx * dx + dy * dy);

  X1$1 += z * (x0$3 + x) / 2;
  Y1$1 += z * (y0$3 + y) / 2;
  Z1$1 += z;

  z = y0$3 * x - x0$3 * y;
  X2$1 += z * (x0$3 + x);
  Y2$1 += z * (y0$3 + y);
  Z2$1 += z * 3;
  centroidPoint$1(x0$3 = x, y0$3 = y);
}

function PathContext(context) {
  this._context = context;
}

PathContext.prototype = {
  _radius: 4.5,
  pointRadius: function(_) {
    return this._radius = _, this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0) this._context.closePath();
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._context.moveTo(x, y);
        this._point = 1;
        break;
      }
      case 1: {
        this._context.lineTo(x, y);
        break;
      }
      default: {
        this._context.moveTo(x + this._radius, y);
        this._context.arc(x, y, this._radius, 0, tau$2);
        break;
      }
    }
  },
  result: noop$3
};

var lengthSum$1 = adder(),
    lengthRing,
    x00$2,
    y00$2,
    x0$4,
    y0$4;

var lengthStream$1 = {
  point: noop$3,
  lineStart: function() {
    lengthStream$1.point = lengthPointFirst$1;
  },
  lineEnd: function() {
    if (lengthRing) lengthPoint$1(x00$2, y00$2);
    lengthStream$1.point = noop$3;
  },
  polygonStart: function() {
    lengthRing = true;
  },
  polygonEnd: function() {
    lengthRing = null;
  },
  result: function() {
    var length = +lengthSum$1;
    lengthSum$1.reset();
    return length;
  }
};

function lengthPointFirst$1(x, y) {
  lengthStream$1.point = lengthPoint$1;
  x00$2 = x0$4 = x, y00$2 = y0$4 = y;
}

function lengthPoint$1(x, y) {
  x0$4 -= x, y0$4 -= y;
  lengthSum$1.add(sqrt$2(x0$4 * x0$4 + y0$4 * y0$4));
  x0$4 = x, y0$4 = y;
}

function PathString() {
  this._string = [];
}

PathString.prototype = {
  _radius: 4.5,
  _circle: circle$2(4.5),
  pointRadius: function(_) {
    if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
    return this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0) this._string.push("Z");
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._string.push("M", x, ",", y);
        this._point = 1;
        break;
      }
      case 1: {
        this._string.push("L", x, ",", y);
        break;
      }
      default: {
        if (this._circle == null) this._circle = circle$2(this._radius);
        this._string.push("M", x, ",", y, this._circle);
        break;
      }
    }
  },
  result: function() {
    if (this._string.length) {
      var result = this._string.join("");
      this._string = [];
      return result;
    } else {
      return null;
    }
  }
};

function circle$2(radius) {
  return "m0," + radius
      + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
      + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
      + "z";
}

function geoPath(projection, context) {
  var pointRadius = 4.5,
      projectionStream,
      contextStream;

  function path(object) {
    if (object) {
      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
      geoStream(object, projectionStream(contextStream));
    }
    return contextStream.result();
  }

  path.area = function(object) {
    geoStream(object, projectionStream(areaStream$1));
    return areaStream$1.result();
  };

  path.measure = function(object) {
    geoStream(object, projectionStream(lengthStream$1));
    return lengthStream$1.result();
  };

  path.bounds = function(object) {
    geoStream(object, projectionStream(boundsStream$1));
    return boundsStream$1.result();
  };

  path.centroid = function(object) {
    geoStream(object, projectionStream(centroidStream$1));
    return centroidStream$1.result();
  };

  path.projection = function(_) {
    return arguments.length ? (projectionStream = _ == null ? (projection = null, identity$5) : (projection = _).stream, path) : projection;
  };

  path.context = function(_) {
    if (!arguments.length) return context;
    contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
    return path;
  };

  path.pointRadius = function(_) {
    if (!arguments.length) return pointRadius;
    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
    return path;
  };

  return path.projection(projection).context(context);
}

var _extends$q = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$n = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$n(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$n(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$n(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$9 = 'rv-xy-plot__series rv-xy-plot__series--contour';

function getDomain(data) {
  return data.reduce(function (acc, row) {
    return {
      min: Math.min(acc.min, row.value),
      max: Math.max(acc.max, row.value)
    };
  }, { min: Infinity, max: -Infinity });
}

var ContourSeries = function (_AbstractSeries) {
  _inherits$n(ContourSeries, _AbstractSeries);

  function ContourSeries() {
    _classCallCheck$n(this, ContourSeries);

    return _possibleConstructorReturn$n(this, (ContourSeries.__proto__ || Object.getPrototypeOf(ContourSeries)).apply(this, arguments));
  }

  _createClass$n(ContourSeries, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          animation = _props.animation,
          bandwidth = _props.bandwidth,
          className = _props.className,
          colorRange = _props.colorRange,
          data = _props.data,
          innerHeight = _props.innerHeight,
          innerWidth = _props.innerWidth,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          style = _props.style;


      if (!data || !innerWidth || !innerHeight) {
        return null;
      }

      if (animation) {
        return react.createElement(
          Animation,
          _extends$q({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(ContourSeries, _extends$q({}, this.props, { animation: null }))
        );
      }

      var x = this._getAttributeFunctor('x');
      var y = this._getAttributeFunctor('y');

      var contouredData = contourDensity().x(function (d) {
        return x(d);
      }).y(function (d) {
        return y(d);
      }).size([innerWidth, innerHeight]).bandwidth(bandwidth)(data);

      var geo = geoPath();

      var _getDomain = getDomain(contouredData),
          min = _getDomain.min,
          max = _getDomain.max;

      var colorScale = linear$1().domain([min, max]).range(colorRange || CONTINUOUS_COLOR_RANGE);
      return react.createElement(
        'g',
        {
          className: predefinedClassName$9 + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        contouredData.map(function (polygon, index) {
          return react.createElement('path', {
            className: 'rv-xy-plot__series--contour-line',
            key: 'rv-xy-plot__series--contour-line-' + index,
            d: geo(polygon),
            style: _extends$q({
              fill: colorScale(polygon.value)
            }, style)
          });
        })
      );
    }
  }]);

  return ContourSeries;
}(AbstractSeries);

ContourSeries.propTypes = _extends$q({}, AbstractSeries.propTypes, {
  animation: propTypes.bool,
  bandwidth: propTypes.number,
  className: propTypes.string,
  marginLeft: propTypes.number,
  marginTop: propTypes.number,
  style: propTypes.object
});

ContourSeries.defaultProps = _extends$q({}, AbstractSeries.defaultProps, {
  bandwidth: 40,
  style: {}
});

var _createClass$o = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends$r = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$o(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$o(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$o(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray$2(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var predefinedClassName$a = 'rv-xy-plot__series rv-xy-plot__series--custom-svg-wrapper';

var DEFAULT_STYLE = {
  stroke: 'blue',
  fill: 'blue'
};

function predefinedComponents(type) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_STYLE;

  switch (type) {
    case 'diamond':
      return react.createElement('polygon', {
        style: style,
        points: '0 0 ' + size / 2 + ' ' + size / 2 + ' 0 ' + size + ' ' + -size / 2 + ' ' + size / 2 + ' 0 0'
      });
    case 'star':
      var starPoints = [].concat(_toConsumableArray$2(new Array(5))).map(function (c, index) {
        var angle = index / 5 * Math.PI * 2;
        var innerAngle = angle + Math.PI / 10;
        var outerAngle = angle - Math.PI / 10;
        // ratio of inner polygon to outer polgyon
        var innerRadius = size / 2.61;
        return '\n        ' + Math.cos(outerAngle) * size + ' ' + Math.sin(outerAngle) * size + '\n        ' + Math.cos(innerAngle) * innerRadius + ' ' + Math.sin(innerAngle) * innerRadius + '\n      ';
      }).join(' ');
      return react.createElement('polygon', {
        points: starPoints,
        x: '0',
        y: '0',
        height: size,
        width: size,
        style: style
      });
    case 'square':
      return react.createElement('rect', {
        x: '' + -size / 2,
        y: '' + -size / 2,
        height: size,
        width: size,
        style: style
      });
    default:
    case 'circle':
      return react.createElement('circle', { cx: '0', cy: '0', r: size / 2, style: style });
  }
}

function getInnerComponent(_ref) {
  var customComponent = _ref.customComponent,
      defaultType = _ref.defaultType,
      positionInPixels = _ref.positionInPixels,
      positionFunctions = _ref.positionFunctions,
      style = _ref.style,
      propsSize = _ref.propsSize;
  var size = customComponent.size;

  var aggStyle = _extends$r({}, style, customComponent.style || {});
  var innerComponent = customComponent.customComponent;
  if (!innerComponent && typeof defaultType === 'string') {
    return predefinedComponents(defaultType, size || propsSize, aggStyle);
  }
  // if default component is a function
  if (!innerComponent) {
    return defaultType(customComponent, positionInPixels, aggStyle);
  }
  if (typeof innerComponent === 'string') {
    return predefinedComponents(innerComponent || defaultType, size, aggStyle);
  }
  // if inner component is a function
  return innerComponent(customComponent, positionInPixels, aggStyle);
}

var CustomSVGSeries = function (_AbstractSeries) {
  _inherits$o(CustomSVGSeries, _AbstractSeries);

  function CustomSVGSeries() {
    _classCallCheck$o(this, CustomSVGSeries);

    return _possibleConstructorReturn$o(this, (CustomSVGSeries.__proto__ || Object.getPrototypeOf(CustomSVGSeries)).apply(this, arguments));
  }

  _createClass$o(CustomSVGSeries, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          customComponent = _props.customComponent,
          data = _props.data,
          innerHeight = _props.innerHeight,
          innerWidth = _props.innerWidth,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          style = _props.style,
          size = _props.size;


      if (!data || !innerWidth || !innerHeight) {
        return null;
      }

      if (animation) {
        return react.createElement(
          Animation,
          _extends$r({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(CustomSVGSeries, _extends$r({}, this.props, { animation: false }))
        );
      }

      var x = this._getAttributeFunctor('x');
      var y = this._getAttributeFunctor('y');
      var contents = data.map(function (seriesComponent, index) {
        var positionInPixels = {
          x: x({ x: seriesComponent.x }),
          y: y({ y: seriesComponent.y })
        };
        var innerComponent = getInnerComponent({
          customComponent: seriesComponent,
          positionInPixels: positionInPixels,
          defaultType: customComponent,
          positionFunctions: { x: x, y: y },
          style: style,
          propsSize: size
        });
        return react.createElement(
          'g',
          {
            className: 'rv-xy-plot__series--custom-svg',
            key: 'rv-xy-plot__series--custom-svg-' + index,
            transform: 'translate(' + positionInPixels.x + ',' + positionInPixels.y + ')',
            onMouseEnter: function onMouseEnter(e) {
              return _this2._valueMouseOverHandler(seriesComponent, e);
            },
            onMouseLeave: function onMouseLeave(e) {
              return _this2._valueMouseOutHandler(seriesComponent, e);
            }
          },
          innerComponent
        );
      });
      return react.createElement(
        'g',
        {
          className: predefinedClassName$a + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        contents
      );
    }
  }]);

  return CustomSVGSeries;
}(AbstractSeries);

CustomSVGSeries.propTypes = {
  animation: propTypes.bool,
  className: propTypes.string,
  customComponent: propTypes.oneOfType([propTypes.string, propTypes.func]),
  data: propTypes.arrayOf(propTypes.shape({
    x: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
    y: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired
  })).isRequired,
  marginLeft: propTypes.number,
  marginTop: propTypes.number,
  style: propTypes.object,
  size: propTypes.number,
  onValueMouseOver: propTypes.func,
  onValueMouseOut: propTypes.func
};

CustomSVGSeries.defaultProps = _extends$r({}, AbstractSeries.defaultProps, {
  animation: false,
  customComponent: 'circle',
  style: {},
  size: 2
});

var _extends$s = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$p = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$p(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$p(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$p(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$b = 'rv-xy-plot__series rv-xy-plot__series--line';

var AreaSeries = function (_AbstractSeries) {
  _inherits$p(AreaSeries, _AbstractSeries);

  function AreaSeries() {
    _classCallCheck$p(this, AreaSeries);

    return _possibleConstructorReturn$p(this, (AreaSeries.__proto__ || Object.getPrototypeOf(AreaSeries)).apply(this, arguments));
  }

  _createClass$p(AreaSeries, [{
    key: '_renderArea',
    value: function _renderArea(data, x, y0, y, curve, getNull) {
      var area$$1 = area();
      if (curve !== null) {
        if (typeof curve === 'string' && d3Shape[curve]) {
          area$$1 = area$$1.curve(d3Shape[curve]);
        } else if (typeof curve === 'function') {
          area$$1 = area$$1.curve(curve);
        }
      }
      area$$1 = area$$1.defined(getNull);
      area$$1 = area$$1.x(x).y0(y0).y1(y);
      return area$$1(data);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          curve = _props.curve,
          data = _props.data,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          style = _props.style;


      if (this.props.nullAccessor) {
        warning('nullAccessor has been renamed to getNull', true);
      }

      if (!data) {
        return null;
      }

      if (animation) {
        return react.createElement(
          Animation,
          _extends$s({}, this.props, { animatedProps: ANIMATED_SERIES_PROPS }),
          react.createElement(AreaSeries, _extends$s({}, this.props, { animation: null }))
        );
      }

      var x = this._getAttributeFunctor('x');
      var y = this._getAttributeFunctor('y');
      var y0 = this._getAttr0Functor('y');
      var stroke = this._getAttributeValue('stroke') || this._getAttributeValue('color');
      var fill = this._getAttributeValue('fill') || this._getAttributeValue('color');
      var newOpacity = this._getAttributeValue('opacity');
      var opacity = Number.isFinite(newOpacity) ? newOpacity : DEFAULT_OPACITY;
      var getNull = this.props.nullAccessor || this.props.getNull;
      var d = this._renderArea(data, x, y0, y, curve, getNull);

      return react.createElement('path', {
        d: d,
        className: predefinedClassName$b + ' ' + className,
        transform: 'translate(' + marginLeft + ',' + marginTop + ')',
        onMouseOver: this._seriesMouseOverHandler,
        onMouseOut: this._seriesMouseOutHandler,
        onClick: this._seriesClickHandler,
        onContextMenu: this._seriesRightClickHandler,
        style: _extends$s({
          opacity: opacity,
          stroke: stroke,
          fill: fill
        }, style)
      });
    }
  }]);

  return AreaSeries;
}(AbstractSeries);

AreaSeries.displayName = 'AreaSeries';
AreaSeries.propTypes = _extends$s({}, AbstractSeries.propTypes, {
  getNull: propTypes.func
});
AreaSeries.defaultProps = _extends$s({}, AbstractSeries.defaultProps, {
  getNull: function getNull() {
    return true;
  }
});

var _createClass$q = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends$t = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$q(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$q(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$q(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$c = 'rv-xy-plot__series rv-xy-plot__series--arc';
var ATTRIBUTES = ['radius', 'angle'];

var defaultProps$1 = _extends$t({}, AbstractSeries.defaultProps, {
  center: { x: 0, y: 0 },
  arcClassName: '',
  className: '',
  style: {},
  padAngle: 0
});

/**
 * Prepare the internal representation of row for real use.
 * This is necessary because d3 insists on starting at 12 oclock and moving
 * clockwise, rather than starting at 3 oclock and moving counter clockwise
 * as one might expect from polar
 * @param {Object} row - coordinate object to be modifed
 * @return {Object} angle corrected object
 */
function modifyRow(row) {
  var radius = row.radius,
      angle = row.angle,
      angle0 = row.angle0;

  var truedAngle = -1 * angle + Math.PI / 2;
  var truedAngle0 = -1 * angle0 + Math.PI / 2;
  return _extends$t({}, row, {
    x: radius * Math.cos(truedAngle),
    y: radius * Math.sin(truedAngle),
    angle: truedAngle,
    angle0: truedAngle0
  });
}

var ArcSeries = function (_AbstractSeries) {
  _inherits$q(ArcSeries, _AbstractSeries);

  function ArcSeries(props) {
    _classCallCheck$q(this, ArcSeries);

    var _this = _possibleConstructorReturn$q(this, (ArcSeries.__proto__ || Object.getPrototypeOf(ArcSeries)).call(this, props));

    var scaleProps = _this._getAllScaleProps(props);
    _this.state = { scaleProps: scaleProps };
    return _this;
  }

  _createClass$q(ArcSeries, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ scaleProps: this._getAllScaleProps(nextProps) });
    }

    /**
     * Get the map of scales from the props.
     * @param {Object} props Props.
     * @param {Array} data Array of all data.
     * @returns {Object} Map of scales.
     * @private
     */

  }, {
    key: '_getAllScaleProps',
    value: function _getAllScaleProps(props) {
      var defaultScaleProps = this._getDefaultScaleProps(props);
      var userScaleProps = extractScalePropsFromProps(props, ATTRIBUTES);
      var missingScaleProps = getMissingScaleProps(_extends$t({}, defaultScaleProps, userScaleProps), props.data, ATTRIBUTES);

      return _extends$t({}, defaultScaleProps, userScaleProps, missingScaleProps);
    }

    /**
     * Get the list of scale-related settings that should be applied by default.
     * @param {Object} props Object of props.
     * @returns {Object} Defaults.
     * @private
     */

  }, {
    key: '_getDefaultScaleProps',
    value: function _getDefaultScaleProps(props) {
      var innerWidth = props.innerWidth,
          innerHeight = props.innerHeight;

      var radius = Math.min(innerWidth / 2, innerHeight / 2);
      return {
        radiusRange: [0, radius],
        _radiusValue: radius,
        angleType: 'literal'
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          arcClassName = _props.arcClassName,
          animation = _props.animation,
          className = _props.className,
          center = _props.center,
          data = _props.data,
          disableSeries = _props.disableSeries,
          hideSeries = _props.hideSeries,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          padAngle = _props.padAngle,
          style = _props.style;


      if (!data) {
        return null;
      }

      if (animation) {
        var cloneData = data.map(function (d) {
          return _extends$t({}, d);
        });
        return react.createElement(
          'g',
          { className: 'rv-xy-plot__series--arc__animation-wrapper' },
          react.createElement(
            Animation,
            _extends$t({}, this.props, {
              animatedProps: ANIMATED_SERIES_PROPS,
              data: cloneData
            }),
            react.createElement(ArcSeries, _extends$t({}, this.props, {
              animation: null,
              disableSeries: true,
              data: cloneData
            }))
          ),
          react.createElement(ArcSeries, _extends$t({}, this.props, {
            animation: null,
            hideSeries: true,
            style: { stroke: 'red' }
          }))
        );
      }

      var scaleProps = this.state.scaleProps;
      var radiusDomain = scaleProps.radiusDomain;
      // need to generate our own functors as abstract series doesnt have anythign for us

      var radius = getAttributeFunctor(scaleProps, 'radius');
      var radius0 = getAttr0Functor(scaleProps, 'radius');
      var angle = getAttributeFunctor(scaleProps, 'angle');
      var angle0 = getAttr0Functor(scaleProps, 'angle');
      // but it does have good color support!
      var fill = this._getAttributeFunctor('fill') || this._getAttributeFunctor('color');
      var stroke = this._getAttributeFunctor('stroke') || this._getAttributeFunctor('color');
      var opacity = this._getAttributeFunctor('opacity');
      var x = this._getAttributeFunctor('x');
      var y = this._getAttributeFunctor('y');

      return react.createElement(
        'g',
        {
          className: predefinedClassName$c + ' ' + className,
          onMouseOver: this._seriesMouseOverHandler,
          onMouseOut: this._seriesMouseOutHandler,
          onClick: this._seriesClickHandler,
          onContextMenu: this._seriesRightClickHandler,
          opacity: hideSeries ? 0 : 1,
          pointerEvents: disableSeries ? 'none' : 'all',
          transform: 'translate(' + (marginLeft + x(center)) + ',' + (marginTop + y(center)) + ')'
        },
        data.map(function (row, i) {
          var noRadius = radiusDomain[1] === radiusDomain[0];
          var arcArg = {
            innerRadius: noRadius ? 0 : radius0(row),
            outerRadius: radius(row),
            startAngle: angle0(row) || 0,
            endAngle: angle(row)
          };
          var arcedData = arcBuilder().padAngle(padAngle);
          var rowStyle = row.style || {};
          var rowClassName = row.className || '';
          return react.createElement('path', {
            style: _extends$t({
              opacity: opacity && opacity(row),
              stroke: stroke && stroke(row),
              fill: fill && fill(row)
            }, style, rowStyle),
            onClick: function onClick(e) {
              return _this2._valueClickHandler(modifyRow(row), e);
            },
            onContextMenu: function onContextMenu(e) {
              return _this2._valueRightClickHandler(modifyRow(row), e);
            },
            onMouseOver: function onMouseOver(e) {
              return _this2._valueMouseOverHandler(modifyRow(row), e);
            },
            onMouseOut: function onMouseOut(e) {
              return _this2._valueMouseOutHandler(modifyRow(row), e);
            },
            key: i,
            className: predefinedClassName$c + '-path ' + arcClassName + ' ' + rowClassName,
            d: arcedData(arcArg)
          });
        })
      );
    }
  }]);

  return ArcSeries;
}(AbstractSeries);

ArcSeries.propTypes = _extends$t({}, AbstractSeries.propTypes, getScalePropTypesByAttribute('radius'), getScalePropTypesByAttribute('angle'), {
  center: propTypes.shape({
    x: propTypes.number,
    y: propTypes.number
  }),
  arcClassName: propTypes.string,
  padAngle: propTypes.oneOfType([propTypes.func, propTypes.number])
});
ArcSeries.defaultProps = defaultProps$1;
ArcSeries.displayName = 'ArcSeries';

var _createClass$r = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends$u = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$r(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$r(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$r(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes$3 = _extends$u({}, LineSeries.propTypes, {
  lineStyle: propTypes.object,
  markStyle: propTypes.object
});

var LineMarkSeries = function (_AbstractSeries) {
  _inherits$r(LineMarkSeries, _AbstractSeries);

  function LineMarkSeries() {
    _classCallCheck$r(this, LineMarkSeries);

    return _possibleConstructorReturn$r(this, (LineMarkSeries.__proto__ || Object.getPrototypeOf(LineMarkSeries)).apply(this, arguments));
  }

  _createClass$r(LineMarkSeries, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          lineStyle = _props.lineStyle,
          markStyle = _props.markStyle,
          style = _props.style;

      return react.createElement(
        'g',
        { className: 'rv-xy-plot__series rv-xy-plot__series--linemark' },
        react.createElement(LineSeries, _extends$u({}, this.props, { style: _extends$u({}, style, lineStyle) })),
        react.createElement(MarkSeries, _extends$u({}, this.props, { style: _extends$u({}, style, markStyle) }))
      );
    }
  }], [{
    key: 'defaultProps',
    get: function get() {
      return _extends$u({}, LineSeries.defaultProps, {
        lineStyle: {},
        markStyle: {}
      });
    }
  }]);

  return LineMarkSeries;
}(AbstractSeries);

LineMarkSeries.displayName = 'LineMarkSeries';
LineMarkSeries.propTypes = propTypes$3;

var _extends$v = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$s = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$s(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$s(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$s(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LineMarkSeriesCanvas = function (_AbstractSeries) {
  _inherits$s(LineMarkSeriesCanvas, _AbstractSeries);

  function LineMarkSeriesCanvas() {
    _classCallCheck$s(this, LineMarkSeriesCanvas);

    return _possibleConstructorReturn$s(this, (LineMarkSeriesCanvas.__proto__ || Object.getPrototypeOf(LineMarkSeriesCanvas)).apply(this, arguments));
  }

  _createClass$s(LineMarkSeriesCanvas, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }], [{
    key: 'renderLayer',
    value: function renderLayer(props, ctx) {
      LineSeriesCanvas.renderLayer(props, ctx);
      MarkSeriesCanvas.renderLayer(props, ctx);
    }
  }, {
    key: 'requiresSVG',
    get: function get() {
      return false;
    }
  }, {
    key: 'isCanvas',
    get: function get() {
      return true;
    }
  }]);

  return LineMarkSeriesCanvas;
}(AbstractSeries);

LineMarkSeriesCanvas.displayName = 'LineMarkSeriesCanvas';
LineMarkSeriesCanvas.propTypes = _extends$v({}, AbstractSeries.propTypes);

var _extends$w = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$t = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$t(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$t(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$t(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Hint provides two options for placement of hint:
 * a) around a data point in one of four quadrants (imagine the point bisected
 *    by two axes -vertical, horizontal- creating 4 quadrants around a data
 *    point).
 * b) **New** pin to an edge of chart/plot area and position along that edge
 *    using data point's other dimension value.
 *
 * To support these two options, deprecate one Hint props (orientation) with two
 * new Hint align prop object (horizontal, vertical) with following values:
 *
 *   horizontal: auto, left, right, leftEdge, rightEdge
 *   vertical: auto, bottom, top, bottomEdge, topEdge
 *
 * Thus, the following ALIGN constants are the values for horizontal
 * and vertical
 */
var ALIGN = {
  AUTO: 'auto',
  LEFT: 'left',
  RIGHT: 'right',
  LEFT_EDGE: 'leftEdge',
  RIGHT_EDGE: 'rightEdge',
  BOTTOM: 'bottom',
  TOP: 'top',
  BOTTOM_EDGE: 'bottomEdge',
  TOP_EDGE: 'topEdge'
};

/**
 * For backwards support, retain the ORIENTATION prop constants
 */
var ORIENTATION = {
  BOTTOM_LEFT: 'bottomleft',
  BOTTOM_RIGHT: 'bottomright',
  TOP_LEFT: 'topleft',
  TOP_RIGHT: 'topright'
};

/**
 * Default format function for the value.
 * @param {Object} value Value.
 * @returns {Array} title-value pairs.
 */
function defaultFormat(value) {
  return Object.keys(value).map(function getProp(key) {
    return { title: key, value: value[key] };
  });
}

var Hint = function (_PureComponent) {
  _inherits$t(Hint, _PureComponent);

  function Hint() {
    _classCallCheck$t(this, Hint);

    return _possibleConstructorReturn$t(this, (Hint.__proto__ || Object.getPrototypeOf(Hint)).apply(this, arguments));
  }

  _createClass$t(Hint, [{
    key: '_getAlign',


    /**
     * Obtain align object with horizontal and vertical settings
     * but convert any AUTO values to the non-auto ALIGN depending on the
     * values of x and y.
     * @param {number} x X value.
     * @param {number} y Y value.
     * @returns {Object} Align object w/ horizontal, vertical prop strings.
     * @private
     */
    value: function _getAlign(x, y) {
      var _props = this.props,
          innerWidth = _props.innerWidth,
          innerHeight = _props.innerHeight,
          orientation = _props.orientation,
          _props$align = _props.align,
          horizontal = _props$align.horizontal,
          vertical = _props$align.vertical;

      var align = orientation ? this._mapOrientationToAlign(orientation) : { horizontal: horizontal, vertical: vertical };
      if (horizontal === ALIGN.AUTO) {
        align.horizontal = x > innerWidth / 2 ? ALIGN.LEFT : ALIGN.RIGHT;
      }
      if (vertical === ALIGN.AUTO) {
        align.vertical = y > innerHeight / 2 ? ALIGN.TOP : ALIGN.BOTTOM;
      }
      return align;
    }

    /**
     * Get the class names from align values.
     * @param {Object} align object with horizontal and vertical prop strings.
     * @returns {string} Class names.
     * @private
     */

  }, {
    key: '_getAlignClassNames',
    value: function _getAlignClassNames(align) {
      var orientation = this.props.orientation;

      var orientationClass = orientation ? 'rv-hint--orientation-' + orientation : '';
      return orientationClass + ' rv-hint--horizontalAlign-' + align.horizontal + '\n     rv-hint--verticalAlign-' + align.vertical;
    }

    /**
     * Get a CSS mixin for a proper positioning of the element.
     * @param {Object} align object with horizontal and vertical prop strings.
     * @param {number} x X position.
     * @param {number} y Y position.
     * @returns {Object} Object, that may contain `left` or `right, `top` or
     * `bottom` properties.
     * @private
     */

  }, {
    key: '_getAlignStyle',
    value: function _getAlignStyle(align, x, y) {
      return _extends$w({}, this._getXCSS(align.horizontal, x), this._getYCSS(align.vertical, y));
    }

    /**
     * Get the bottom coordinate of the hint.
     * When y undefined or null, edge case, pin bottom.
     * @param {number} y Y.
     * @returns {{bottom: *}} Mixin.
     * @private
     */

  }, {
    key: '_getCSSBottom',
    value: function _getCSSBottom(y) {
      if (y === undefined || y === null) {
        return {
          bottom: 0
        };
      }

      var _props2 = this.props,
          innerHeight = _props2.innerHeight,
          marginBottom = _props2.marginBottom;

      return {
        bottom: marginBottom + innerHeight - y
      };
    }

    /**
     * Get the left coordinate of the hint.
     * When x undefined or null, edge case, pin left.
     * @param {number} x X.
     * @returns {{left: *}} Mixin.
     * @private
     */

  }, {
    key: '_getCSSLeft',
    value: function _getCSSLeft(x) {
      if (x === undefined || x === null) {
        return {
          left: 0
        };
      }

      var marginLeft = this.props.marginLeft;

      return {
        left: marginLeft + x
      };
    }

    /**
     * Get the right coordinate of the hint.
     * When x undefined or null, edge case, pin right.
     * @param {number} x X.
     * @returns {{right: *}} Mixin.
     * @private
     */

  }, {
    key: '_getCSSRight',
    value: function _getCSSRight(x) {
      if (x === undefined || x === null) {
        return {
          right: 0
        };
      }

      var _props3 = this.props,
          innerWidth = _props3.innerWidth,
          marginRight = _props3.marginRight;

      return {
        right: marginRight + innerWidth - x
      };
    }

    /**
     * Get the top coordinate of the hint.
     * When y undefined or null, edge case, pin top.
     * @param {number} y Y.
     * @returns {{top: *}} Mixin.
     * @private
     */

  }, {
    key: '_getCSSTop',
    value: function _getCSSTop(y) {
      if (y === undefined || y === null) {
        return {
          top: 0
        };
      }

      var marginTop = this.props.marginTop;

      return {
        top: marginTop + y
      };
    }

    /**
     * Get the position for the hint and the appropriate class name.
     * @returns {{style: Object, className: string}} Style and className for the
     * hint.
     * @private
     */

  }, {
    key: '_getPositionInfo',
    value: function _getPositionInfo() {
      var _props4 = this.props,
          value = _props4.value,
          getAlignStyle = _props4.getAlignStyle;


      var x = getAttributeFunctor(this.props, 'x')(value);
      var y = getAttributeFunctor(this.props, 'y')(value);

      var align = this._getAlign(x, y);

      return {
        position: getAlignStyle ? getAlignStyle(align, x, y) : this._getAlignStyle(align, x, y),
        className: this._getAlignClassNames(align)
      };
    }
  }, {
    key: '_getXCSS',
    value: function _getXCSS(horizontal, x) {
      // obtain xCSS
      switch (horizontal) {
        case ALIGN.LEFT_EDGE:
          // this pins x to left edge
          return this._getCSSLeft(null);
        case ALIGN.RIGHT_EDGE:
          // this pins x to left edge
          return this._getCSSRight(null);
        case ALIGN.LEFT:
          // this places hint text to the left of center, so set its right edge
          return this._getCSSRight(x);
        case ALIGN.RIGHT:
        default:
          // this places hint text to the right of center, so set its left edge
          // default case should not be possible but if it happens set to RIGHT
          return this._getCSSLeft(x);
      }
    }
  }, {
    key: '_getYCSS',
    value: function _getYCSS(verticalAlign, y) {
      // obtain yCSS
      switch (verticalAlign) {
        case ALIGN.TOP_EDGE:
          // this pins x to top edge
          return this._getCSSTop(null);
        case ALIGN.BOTTOM_EDGE:
          // this pins x to bottom edge
          return this._getCSSBottom(null);
        case ALIGN.BOTTOM:
          // this places hint text to the bottom of center, so set its top edge
          return this._getCSSTop(y);
        case ALIGN.TOP:
        default:
          // this places hint text to the top of center, so set its bottom edge
          // default case should not be possible but if it happens set to BOTTOM
          return this._getCSSBottom(y);
      }
    }
  }, {
    key: '_mapOrientationToAlign',
    value: function _mapOrientationToAlign(orientation) {
      // TODO: print warning that this feature is deprecated and support will be
      // removed in next major release.
      switch (orientation) {
        case ORIENTATION.BOTTOM_LEFT:
          return {
            horizontal: ALIGN.LEFT,
            vertical: ALIGN.BOTTOM
          };
        case ORIENTATION.BOTTOM_RIGHT:
          return {
            horizontal: ALIGN.RIGHT,
            vertical: ALIGN.BOTTOM
          };
        case ORIENTATION.TOP_LEFT:
          return {
            horizontal: ALIGN.LEFT,
            vertical: ALIGN.TOP
          };
        case ORIENTATION.TOP_RIGHT:
          return {
            horizontal: ALIGN.RIGHT,
            vertical: ALIGN.TOP
          };
        default:
          // fall back to horizontalAlign, verticalAlign that are either
          // provided or defaulted to AUTO.  So, don't change things
          break;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          value = _props5.value,
          format = _props5.format,
          children = _props5.children,
          style = _props5.style;

      var _getPositionInfo2 = this._getPositionInfo(),
          position = _getPositionInfo2.position,
          className = _getPositionInfo2.className;

      return react.createElement(
        'div',
        {
          className: 'rv-hint ' + className,
          style: _extends$w({}, style, position, {
            position: 'absolute'
          })
        },
        children ? children : react.createElement(
          'div',
          { className: 'rv-hint__content', style: style.content },
          format(value).map(function (formattedProp, i) {
            return react.createElement(
              'div',
              { key: 'rv-hint' + i, style: style.row },
              react.createElement(
                'span',
                { className: 'rv-hint__title', style: style.title },
                formattedProp.title
              ),
              ': ',
              react.createElement(
                'span',
                { className: 'rv-hint__value', style: style.value },
                formattedProp.value
              )
            );
          })
        )
      );
    }
  }], [{
    key: 'defaultProps',
    get: function get() {
      return {
        format: defaultFormat,
        align: {
          horizontal: ALIGN.AUTO,
          vertical: ALIGN.AUTO
        },
        style: {}
      };
    }
  }, {
    key: 'propTypes',
    get: function get() {
      return {
        marginTop: propTypes.number,
        marginLeft: propTypes.number,
        innerWidth: propTypes.number,
        innerHeight: propTypes.number,
        scales: propTypes.object,
        value: propTypes.object,
        format: propTypes.func,
        style: propTypes.object,
        align: propTypes.shape({
          horizontal: propTypes.oneOf([ALIGN.AUTO, ALIGN.LEFT, ALIGN.RIGHT, ALIGN.LEFT_EDGE, ALIGN.RIGHT_EDGE]),
          vertical: propTypes.oneOf([ALIGN.AUTO, ALIGN.BOTTOM, ALIGN.TOP, ALIGN.BOTTOM_EDGE, ALIGN.TOP_EDGE])
        }),
        getAlignStyle: propTypes.func,
        orientation: propTypes.oneOf([ORIENTATION.BOTTOM_LEFT, ORIENTATION.BOTTOM_RIGHT, ORIENTATION.TOP_LEFT, ORIENTATION.TOP_RIGHT])
      };
    }
  }]);

  return Hint;
}(react_1);

Hint.displayName = 'Hint';
Hint.ORIENTATION = ORIENTATION;
Hint.ALIGN = ALIGN;

var propTypes$4 = {
  style: propTypes.shape({
    bottom: propTypes.object,
    left: propTypes.object,
    right: propTypes.object,
    top: propTypes.object
  }),
  // supplied by xyplot
  marginTop: propTypes.number,
  marginBottom: propTypes.number,
  marginLeft: propTypes.number,
  marginRight: propTypes.number,
  innerWidth: propTypes.number,
  innerHeight: propTypes.number
};

var _extends$y = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$u = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$u(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$u(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$u(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Format title by detault.
 * @param {Array} values List of values.
 * @returns {*} Formatted value or undefined.
 */
function defaultTitleFormat(values) {
  var value = getFirstNonEmptyValue(values);
  if (value) {
    return {
      title: 'x',
      value: value.x
    };
  }
}

/**
 * Format items by default.
 * @param {Array} values Array of values.
 * @returns {*} Formatted list of items.
 */
function defaultItemsFormat(values) {
  return values.map(function (v, i) {
    if (v) {
      return { value: v.y, title: i };
    }
  });
}

/**
 * Get the first non-empty item from an array.
 * @param {Array} values Array of values.
 * @returns {*} First non-empty value or undefined.
 */
function getFirstNonEmptyValue(values) {
  return (values || []).find(function (v) {
    return Boolean(v);
  });
}

var Crosshair = function (_PureComponent) {
  _inherits$u(Crosshair, _PureComponent);

  function Crosshair() {
    _classCallCheck$u(this, Crosshair);

    return _possibleConstructorReturn$u(this, (Crosshair.__proto__ || Object.getPrototypeOf(Crosshair)).apply(this, arguments));
  }

  _createClass$u(Crosshair, [{
    key: '_renderCrosshairItems',


    /**
     * Render crosshair items (title + value for each series).
     * @returns {*} Array of React classes with the crosshair values.
     * @private
     */
    value: function _renderCrosshairItems() {
      var _props = this.props,
          values = _props.values,
          itemsFormat = _props.itemsFormat;

      var items = itemsFormat(values);
      if (!items) {
        return null;
      }
      return items.filter(function (i) {
        return i;
      }).map(function renderValue(item, i) {
        return react.createElement(
          'div',
          { className: 'rv-crosshair__item', key: 'item' + i },
          react.createElement(
            'span',
            { className: 'rv-crosshair__item__title' },
            item.title
          ),
          ': ',
          react.createElement(
            'span',
            { className: 'rv-crosshair__item__value' },
            item.value
          )
        );
      });
    }

    /**
     * Render crosshair title.
     * @returns {*} Container with the crosshair title.
     * @private
     */

  }, {
    key: '_renderCrosshairTitle',
    value: function _renderCrosshairTitle() {
      var _props2 = this.props,
          values = _props2.values,
          titleFormat = _props2.titleFormat,
          style = _props2.style;

      var titleItem = titleFormat(values);
      if (!titleItem) {
        return null;
      }
      return react.createElement(
        'div',
        { className: 'rv-crosshair__title', key: 'title', style: style.title },
        react.createElement(
          'span',
          { className: 'rv-crosshair__title__title' },
          titleItem.title
        ),
        ': ',
        react.createElement(
          'span',
          { className: 'rv-crosshair__title__value' },
          titleItem.value
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          children = _props3.children,
          className = _props3.className,
          values = _props3.values,
          marginTop = _props3.marginTop,
          marginLeft = _props3.marginLeft,
          innerWidth = _props3.innerWidth,
          innerHeight = _props3.innerHeight,
          style = _props3.style;

      var value = getFirstNonEmptyValue(values);
      if (!value) {
        return null;
      }
      var x = getAttributeFunctor(this.props, 'x');
      var innerLeft = x(value);

      var _props$orientation = this.props.orientation,
          orientation = _props$orientation === undefined ? innerLeft > innerWidth / 2 ? 'left' : 'right' : _props$orientation;

      var left = marginLeft + innerLeft;
      var top = marginTop;
      var innerClassName = 'rv-crosshair__inner rv-crosshair__inner--' + orientation;

      return react.createElement(
        'div',
        {
          className: 'rv-crosshair ' + className,
          style: { left: left + 'px', top: top + 'px' }
        },
        react.createElement('div', {
          className: 'rv-crosshair__line',
          style: _extends$y({ height: innerHeight + 'px' }, style.line)
        }),
        react.createElement(
          'div',
          { className: innerClassName },
          children ? children : react.createElement(
            'div',
            { className: 'rv-crosshair__inner__content', style: style.box },
            react.createElement(
              'div',
              null,
              this._renderCrosshairTitle(),
              this._renderCrosshairItems()
            )
          )
        )
      );
    }
  }], [{
    key: 'defaultProps',
    get: function get() {
      return {
        titleFormat: defaultTitleFormat,
        itemsFormat: defaultItemsFormat,
        style: {
          line: {},
          title: {},
          box: {}
        }
      };
    }
  }, {
    key: 'propTypes',
    get: function get() {
      return {
        className: propTypes.string,
        values: propTypes.arrayOf(propTypes.oneOfType([propTypes.number, propTypes.string, propTypes.object])),
        series: propTypes.object,
        innerWidth: propTypes.number,
        innerHeight: propTypes.number,
        marginLeft: propTypes.number,
        marginTop: propTypes.number,
        orientation: propTypes.oneOf(['left', 'right']),
        itemsFormat: propTypes.func,
        titleFormat: propTypes.func,
        style: propTypes.shape({
          line: propTypes.object,
          title: propTypes.object,
          box: propTypes.object
        })
      };
    }
  }]);

  return Crosshair;
}(react_1);

Crosshair.displayName = 'Crosshair';

var keys$1 = createCommonjsModule(function (module, exports) {
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
});
var keys_1 = keys$1.shim;

var is_arguments = createCommonjsModule(function (module, exports) {
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}
exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
}});
var is_arguments_1 = is_arguments.supported;
var is_arguments_2 = is_arguments.unsupported;

var deepEqual_1 = createCommonjsModule(function (module) {
var pSlice = Array.prototype.slice;



var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
};

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (is_arguments(a)) {
    if (!is_arguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = keys$1(a),
        kb = keys$1(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}
});

var _extends$z = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Get the dimensions of the component for the future use.
 * @param {Object} props Props.
 * @param {Object} defaultMargins Object with default margins.
 * @returns {Object} Dimensions of the component.
 */
function getInnerDimensions(props, defaultMargins) {
  var margin = props.margin,
      width = props.width,
      height = props.height;

  var marginProps = _extends$z({}, defaultMargins, typeof margin === 'number' ? {
    left: margin,
    right: margin,
    top: margin,
    bottom: margin
  } : margin);
  var _marginProps$left = marginProps.left,
      marginLeft = _marginProps$left === undefined ? 0 : _marginProps$left,
      _marginProps$top = marginProps.top,
      marginTop = _marginProps$top === undefined ? 0 : _marginProps$top,
      _marginProps$right = marginProps.right,
      marginRight = _marginProps$right === undefined ? 0 : _marginProps$right,
      _marginProps$bottom = marginProps.bottom,
      marginBottom = _marginProps$bottom === undefined ? 0 : _marginProps$bottom;

  return {
    marginLeft: marginLeft,
    marginTop: marginTop,
    marginRight: marginRight,
    marginBottom: marginBottom,
    innerHeight: height - marginBottom - marginTop,
    innerWidth: width - marginLeft - marginRight
  };
}

/**
 * Calculate the margin of the sunburst,
 * so it can be at the center of the container
 * @param  {Number} width - the width of the container
 * @param  {Number} height - the height of the container
 * @param  {Number} radius - the max radius of the sunburst
 * @return {Object} an object includes {bottom, left, right, top}
 */
function getRadialLayoutMargin(width, height, radius) {
  var marginX = width / 2 - radius;
  var marginY = height / 2 - radius;
  return {
    bottom: marginY,
    left: marginX,
    right: marginX,
    top: marginY
  };
}

var MarginPropType = propTypes.oneOfType([propTypes.shape({
  left: propTypes.number,
  top: propTypes.number,
  right: propTypes.number,
  bottom: propTypes.number
}), propTypes.number]);

var DEFAULT_MARGINS = {
  left: 40,
  right: 10,
  top: 10,
  bottom: 40
};

var _createClass$v = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends$A = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$v(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$v(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$v(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAX_DRAWS = 30;

/**
 * Draw loop draws each of the layers until it should draw more
 * @param {CanvasContext} ctx - the context where the drawing will take place
 * @param {Number} height - height of the canvas
 * @param {Number} width - width of the canvas
 * @param {Array} layers - the layer objects to render
 */
function engageDrawLoop(ctx, height, width, layers) {
  var drawIteration = 0;
  // using setInterval because request animation frame goes too fast
  var drawCycle = setInterval(function () {
    if (!ctx) {
      clearInterval(drawCycle);
      return;
    }
    drawLayers(ctx, height, width, layers, drawIteration);
    if (drawIteration > MAX_DRAWS) {
      clearInterval(drawCycle);
    }
    drawIteration += 1;
  }, 1);
}

/**
 * Loops across each of the layers to be drawn and draws them
 * @param {CanvasContext} ctx - the context where the drawing will take place
 * @param {Number} height - height of the canvas
 * @param {Number} width - width of the canvas
 * @param {Array} layers - the layer objects to render
 * @param {Number} drawIteration - width of the canvas
 */
function drawLayers(ctx, height, width, layers, drawIteration) {
  ctx.clearRect(0, 0, width, height);
  layers.forEach(function (layer) {
    var interpolator = layer.interpolator,
        newProps = layer.newProps,
        animation = layer.animation;
    // return an empty object if dont need to be animating

    var interpolatedProps = animation ? interpolator ? interpolator(drawIteration / MAX_DRAWS) : interpolator : function () {
      return {};
    };
    layer.renderLayer(_extends$A({}, newProps, interpolatedProps), ctx);
  });
}

/**
 * Build an array of layer of objects the contain the method for drawing each series
 * as well as an interpolar (specifically a d3-interpolate interpolator)
 * @param {Object} newChildren the new children to be rendered.
 * @param {Object} oldChildren the old children to be rendered.
 * @returns {Array} Object for rendering
 */
function buildLayers(newChildren, oldChildren) {
  return newChildren.map(function (child, index) {
    var oldProps = oldChildren[index] ? oldChildren[index].props : {};
    var newProps = child.props;

    var oldAnimatedProps = extractAnimatedPropValues(_extends$A({}, oldProps, {
      animatedProps: ANIMATED_SERIES_PROPS
    }));
    var newAnimatedProps = newProps ? extractAnimatedPropValues(_extends$A({}, newProps, {
      animatedProps: ANIMATED_SERIES_PROPS
    })) : null;
    var interpolator = interpolateValue(oldAnimatedProps, newAnimatedProps);

    return {
      renderLayer: child.type.renderLayer,
      newProps: child.props,
      animation: child.props.animation,
      interpolator: interpolator
    };
  });
}

var CanvasWrapper = function (_Component) {
  _inherits$v(CanvasWrapper, _Component);

  function CanvasWrapper() {
    _classCallCheck$v(this, CanvasWrapper);

    return _possibleConstructorReturn$v(this, (CanvasWrapper.__proto__ || Object.getPrototypeOf(CanvasWrapper)).apply(this, arguments));
  }

  _createClass$v(CanvasWrapper, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var ctx = this.canvas.getContext('2d');
      if (!ctx) {
        return;
      }
      var pixelRatio = this.props.pixelRatio;

      if (!ctx) {
        return;
      }
      ctx.scale(pixelRatio, pixelRatio);

      this.drawChildren(null, this.props, ctx);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(oldProps) {
      this.drawChildren(oldProps, this.props, this.canvas.getContext('2d'));
    }

    /**
     * Check that we can and should be animating, then kick off animations as apporpriate
     * @param {Object} newProps the new props to be interpolated to
     * @param {Object} oldProps the old props to be interpolated against
     * @param {DomRef} ctx the canvas context to be drawn on.
     * @returns {Array} Object for rendering
     */

  }, {
    key: 'drawChildren',
    value: function drawChildren(oldProps, newProps, ctx) {
      var children = newProps.children,
          innerHeight = newProps.innerHeight,
          innerWidth = newProps.innerWidth,
          marginBottom = newProps.marginBottom,
          marginLeft = newProps.marginLeft,
          marginRight = newProps.marginRight,
          marginTop = newProps.marginTop;

      if (!ctx) {
        return;
      }

      var childrenShouldAnimate = children.find(function (child) {
        return child.props.animation;
      });

      var height = innerHeight + marginTop + marginBottom;
      var width = innerWidth + marginLeft + marginRight;
      var layers = buildLayers(newProps.children, oldProps ? oldProps.children : []);
      // if we don't need to be animating, dont! cut short
      if (!childrenShouldAnimate) {
        drawLayers(ctx, height, width, layers);
        return;
      }

      engageDrawLoop(ctx, height, width, layers);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          innerHeight = _props.innerHeight,
          innerWidth = _props.innerWidth,
          marginBottom = _props.marginBottom,
          marginLeft = _props.marginLeft,
          marginRight = _props.marginRight,
          marginTop = _props.marginTop,
          pixelRatio = _props.pixelRatio;


      var height = innerHeight + marginTop + marginBottom;
      var width = innerWidth + marginLeft + marginRight;

      return react.createElement(
        'div',
        { style: { left: 0, top: 0 }, className: 'rv-xy-canvas' },
        react.createElement('canvas', {
          className: 'rv-xy-canvas-element',
          height: height * pixelRatio,
          width: width * pixelRatio,
          style: {
            height: height + 'px',
            width: width + 'px'
          },
          ref: function ref(_ref) {
            return _this2.canvas = _ref;
          }
        }),
        this.props.children
      );
    }
  }], [{
    key: 'defaultProps',
    get: function get() {
      return {
        pixelRatio: window && window.devicePixelRatio || 1
      };
    }
  }]);

  return CanvasWrapper;
}(react_2);

CanvasWrapper.displayName = 'CanvasWrapper';
CanvasWrapper.propTypes = {
  marginBottom: propTypes.number.isRequired,
  marginLeft: propTypes.number.isRequired,
  marginRight: propTypes.number.isRequired,
  marginTop: propTypes.number.isRequired,
  innerHeight: propTypes.number.isRequired,
  innerWidth: propTypes.number.isRequired,
  pixelRatio: propTypes.number.isRequired
};

var _createClass$w = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends$B = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray$3(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$w(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$w(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$w(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ATTRIBUTES$1 = ['x', 'y', 'radius', 'angle', 'color', 'fill', 'stroke', 'opacity', 'size'];

/**
 * Remove parents from tree formatted data. deep-equal doesnt play nice with data
 * that has circular structures, so we make every node single directional by pruning the parents.
 * @param {Array} data - the data object to have circular deps resolved in
 * @returns {Array} the sanitized data
 */
function cleanseData(data) {
  return data.map(function (series) {
    if (!Array.isArray(series)) {
      return series;
    }
    return series.map(function (row) {
      return _extends$B({}, row, { parent: null });
    });
  });
}

/**
 * Wrapper on the deep-equal method for checking equality of next props vs current props
 * @param {Object} scaleMixins - Scale object.
 * @param {Object} nextScaleMixins - Scale object.
 * @param {Boolean} hasTreeStructure - Whether or not to cleanse the data of possible cyclic structures
 * @returns {Boolean} whether or not the two mixins objects are equal
 */
function checkIfMixinsAreEqual(nextScaleMixins, scaleMixins, hasTreeStructure) {
  var newMixins = _extends$B({}, nextScaleMixins, {
    _allData: hasTreeStructure ? cleanseData(nextScaleMixins._allData) : nextScaleMixins._allData
  });
  var oldMixins = _extends$B({}, scaleMixins, {
    _allData: hasTreeStructure ? cleanseData(scaleMixins._allData) : scaleMixins._allData
  });
  // it's hard to say if this function is reasonable?
  return deepEqual_1(newMixins, oldMixins);
}

var XYPlot = function (_React$Component) {
  _inherits$w(XYPlot, _React$Component);

  _createClass$w(XYPlot, null, [{
    key: 'defaultProps',
    get: function get() {
      return {
        className: ''
      };
    }
  }, {
    key: 'propTypes',
    get: function get() {
      return {
        animation: AnimationPropType,
        className: propTypes.string,
        dontCheckIfEmpty: propTypes.bool,
        height: propTypes.number.isRequired,
        margin: MarginPropType,
        onClick: propTypes.func,
        onDoubleClick: propTypes.func,
        onMouseDown: propTypes.func,
        onMouseUp: propTypes.func,
        onMouseEnter: propTypes.func,
        onMouseLeave: propTypes.func,
        onMouseMove: propTypes.func,
        onTouchStart: propTypes.func,
        onTouchMove: propTypes.func,
        onTouchEnd: propTypes.func,
        onTouchCancel: propTypes.func,
        onWheel: propTypes.func,
        stackBy: propTypes.oneOf(ATTRIBUTES$1),
        style: propTypes.object,
        width: propTypes.number.isRequired
      };
    }
  }]);

  function XYPlot(props) {
    _classCallCheck$w(this, XYPlot);

    var _this = _possibleConstructorReturn$w(this, (XYPlot.__proto__ || Object.getPrototypeOf(XYPlot)).call(this, props));

    _initialiseProps.call(_this);

    var stackBy = props.stackBy;

    var children = getSeriesChildren(props.children);
    var data = getStackedData(children, stackBy);
    _this.state = {
      scaleMixins: _this._getScaleMixins(data, props),
      data: data
    };
    return _this;
  }

  _createClass$w(XYPlot, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var children = getSeriesChildren(nextProps.children);
      var nextData = getStackedData(children, nextProps.stackBy);
      var scaleMixins = this.state.scaleMixins;

      var nextScaleMixins = this._getScaleMixins(nextData, nextProps);
      if (!checkIfMixinsAreEqual(nextScaleMixins, scaleMixins, nextProps.hasTreeStructure)) {
        this.setState({
          scaleMixins: nextScaleMixins,
          data: nextData
        });
      }
    }

    /**
     * Trigger click related callbacks if they are available.
     * @param {React.SyntheticEvent} event Click event.
     * @private
     */


    /**
     * Trigger doule-click related callbacks if they are available.
     * @param {React.SyntheticEvent} event Double-click event.
     * @private
     */

  }, {
    key: '_getClonedChildComponents',


    /**
     * Prepare the child components (including series) for rendering.
     * @returns {Array} Array of child components.
     * @private
     */
    value: function _getClonedChildComponents() {
      var _this2 = this;

      var props = this.props;
      var animation = this.props.animation;
      var _state = this.state,
          scaleMixins = _state.scaleMixins,
          data = _state.data;

      var dimensions = getInnerDimensions(this.props, DEFAULT_MARGINS);
      var children = react.Children.toArray(this.props.children);
      var seriesProps = getSeriesPropsFromChildren(children);
      var XYPlotValues = getXYPlotValues(props, children);
      return children.map(function (child, index) {
        var dataProps = null;
        if (seriesProps[index]) {
          // Get the index of the series in the list of props and retrieve
          // the data property from it.
          var seriesIndex = seriesProps[index].seriesIndex;

          dataProps = { data: data[seriesIndex] };
        }
        return react.cloneElement(child, _extends$B({}, dimensions, {
          animation: animation
        }, dataProps && child.type.prototype && child.type.prototype.render ? {
          ref: function ref(_ref) {
            return _this2['series' + seriesProps[index].seriesIndex] = _ref;
          }
        } : {}, seriesProps[index], scaleMixins, child.props, XYPlotValues[index], dataProps));
      });
    }
    /**
     * Get the list of scale-related settings that should be applied by default.
     * @param {Object} props Object of props.
     * @returns {Object} Defaults.
     * @private
     */

  }, {
    key: '_getDefaultScaleProps',
    value: function _getDefaultScaleProps(props) {
      var _getInnerDimensions = getInnerDimensions(props, DEFAULT_MARGINS),
          innerWidth = _getInnerDimensions.innerWidth,
          innerHeight = _getInnerDimensions.innerHeight;

      var colorRanges = ['color', 'fill', 'stroke'].reduce(function (acc, attr) {
        var range = props[attr + 'Type'] === 'category' ? EXTENDED_DISCRETE_COLOR_RANGE : CONTINUOUS_COLOR_RANGE;
        return _extends$B({}, acc, _defineProperty$4({}, attr + 'Range', range));
      }, {});

      return _extends$B({
        xRange: [0, innerWidth],
        yRange: [innerHeight, 0]
      }, colorRanges, {
        opacityType: OPACITY_TYPE,
        sizeRange: SIZE_RANGE
      });
    }

    /**
     * Get the map of scales from the props, apply defaults to them and then pass
     * them further.
     * @param {Object} data Array of all data.
     * @param {Object} props Props of the component.
     * @returns {Object} Map of scale-related props.
     * @private
     */

  }, {
    key: '_getScaleMixins',
    value: function _getScaleMixins(data, props) {
      var _ref2;

      var filteredData = data.filter(function (d) {
        return d;
      });
      var allData = (_ref2 = []).concat.apply(_ref2, _toConsumableArray$3(filteredData));

      var defaultScaleProps = this._getDefaultScaleProps(props);
      var optionalScaleProps = getOptionalScaleProps(props);
      var userScaleProps = extractScalePropsFromProps(props, ATTRIBUTES$1);
      var missingScaleProps = getMissingScaleProps(_extends$B({}, defaultScaleProps, optionalScaleProps, userScaleProps), allData, ATTRIBUTES$1);
      var children = getSeriesChildren(props.children);
      var zeroBaseProps = {};
      var adjustBy = new Set();
      var adjustWhat = new Set();
      children.forEach(function (child, index) {
        if (!child || !data[index]) {
          return;
        }
        ATTRIBUTES$1.forEach(function (attr) {
          var _child$type$getParent = child.type.getParentConfig(attr, child.props),
              isDomainAdjustmentNeeded = _child$type$getParent.isDomainAdjustmentNeeded,
              zeroBaseValue = _child$type$getParent.zeroBaseValue;

          if (isDomainAdjustmentNeeded) {
            adjustBy.add(attr);
            adjustWhat.add(index);
          }
          if (zeroBaseValue) {
            var specifiedDomain = props[attr + 'Domain'];
            zeroBaseProps[attr + 'BaseValue'] = specifiedDomain ? specifiedDomain[0] : 0;
          }
        });
      });
      return _extends$B({}, defaultScaleProps, zeroBaseProps, userScaleProps, missingScaleProps, {
        _allData: data,
        _adjustBy: Array.from(adjustBy),
        _adjustWhat: Array.from(adjustWhat),
        _stackBy: props.stackBy
      });
    }

    /**
     * Checks if the plot is empty or not.
     * Currently checks the data only.
     * @returns {boolean} True for empty.
     * @private
     */

  }, {
    key: '_isPlotEmpty',
    value: function _isPlotEmpty() {
      var data = this.state.data;

      return !data || !data.length || !data.some(function (series) {
        return series && series.some(function (d) {
          return d;
        });
      });
    }

    /**
     * Trigger mouse-down related callbacks if they are available.
     * @param {React.SyntheticEvent} event Mouse down event.
     * @private
     */


    /**
     * Trigger onMouseEnter handler if it was passed in props.
     * @param {React.SyntheticEvent} event Mouse enter event.
     * @private
     */


    /**
     * Trigger onMouseLeave handler if it was passed in props.
     * @param {React.SyntheticEvent} event Mouse leave event.
     * @private
     */


    /**
     * Trigger movement-related callbacks if they are available.
     * @param {React.SyntheticEvent} event Mouse move event.
     * @private
     */


    /**
     * Trigger mouse-up related callbacks if they are available.
     * @param {React.SyntheticEvent} event Mouse up event.
     * @private
     */


    /**
     * Trigger onTouchCancel handler if it was passed in props.
     * @param {React.SyntheticEvent} event Touch Cancel event.
     * @private
     */


    /**
     * Trigger onTouchEnd handler if it was passed in props.
     * @param {React.SyntheticEvent} event Touch End event.
     * @private
     */


    /**
     * Trigger touch movement-related callbacks if they are available.
     * @param {React.SyntheticEvent} event Touch move event.
     * @private
     */


    /**
     * Trigger touch-start related callbacks if they are available.
     * @param {React.SyntheticEvent} event Touch start event.
     * @private
     */


    /**
     * Trigger doule-click related callbacks if they are available.
     * @param {React.SyntheticEvent} event Double-click event.
     * @private
     */

  }, {
    key: 'renderCanvasComponents',
    value: function renderCanvasComponents(components, props) {
      var componentsToRender = components.filter(function (c) {
        return c && !c.type.requiresSVG && c.type.isCanvas;
      });

      if (componentsToRender.length === 0) {
        return null;
      }
      var _componentsToRender$ = componentsToRender[0].props,
          marginLeft = _componentsToRender$.marginLeft,
          marginTop = _componentsToRender$.marginTop,
          marginBottom = _componentsToRender$.marginBottom,
          marginRight = _componentsToRender$.marginRight,
          innerHeight = _componentsToRender$.innerHeight,
          innerWidth = _componentsToRender$.innerWidth;

      return react.createElement(
        CanvasWrapper,
        {
          innerHeight: innerHeight,
          innerWidth: innerWidth,
          marginLeft: marginLeft,
          marginTop: marginTop,
          marginBottom: marginBottom,
          marginRight: marginRight
        },
        componentsToRender
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          dontCheckIfEmpty = _props.dontCheckIfEmpty,
          style = _props.style,
          width = _props.width,
          height = _props.height;


      if (!dontCheckIfEmpty && this._isPlotEmpty()) {
        return react.createElement('div', {
          className: 'rv-xy-plot ' + className,
          style: _extends$B({
            width: width + 'px',
            height: height + 'px'
          }, this.props.style)
        });
      }
      var components = this._getClonedChildComponents();
      return react.createElement(
        'div',
        {
          style: {
            width: width + 'px',
            height: height + 'px'
          },
          className: 'rv-xy-plot ' + className
        },
        react.createElement(
          'svg',
          {
            className: 'rv-xy-plot__inner',
            width: width,
            height: height,
            style: style,
            onClick: this._clickHandler,
            onDoubleClick: this._doubleClickHandler,
            onMouseDown: this._mouseDownHandler,
            onMouseUp: this._mouseUpHandler,
            onMouseMove: this._mouseMoveHandler,
            onMouseLeave: this._mouseLeaveHandler,
            onMouseEnter: this._mouseEnterHandler,
            onTouchStart: this._mouseDownHandler,
            onTouchMove: this._touchMoveHandler,
            onTouchEnd: this._touchEndHandler,
            onTouchCancel: this._touchCancelHandler,
            onWheel: this._wheelHandler
          },
          components.filter(function (c) {
            return c && c.type.requiresSVG;
          })
        ),
        this.renderCanvasComponents(components, this.props),
        components.filter(function (c) {
          return c && !c.type.requiresSVG && !c.type.isCanvas;
        })
      );
    }
  }]);

  return XYPlot;
}(react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this._clickHandler = function (event) {
    var onClick = _this3.props.onClick;

    if (onClick) {
      onClick(event);
    }
  };

  this._doubleClickHandler = function (event) {
    var onDoubleClick = _this3.props.onDoubleClick;

    if (onDoubleClick) {
      onDoubleClick(event);
    }
  };

  this._mouseDownHandler = function (event) {
    var _props2 = _this3.props,
        onMouseDown = _props2.onMouseDown,
        children = _props2.children;

    if (onMouseDown) {
      onMouseDown(event);
    }
    var seriesChildren = getSeriesChildren(children);
    seriesChildren.forEach(function (child, index) {
      var component = _this3['series' + index];
      if (component && component.onParentMouseDown) {
        component.onParentMouseDown(event);
      }
    });
  };

  this._mouseEnterHandler = function (event) {
    var _props3 = _this3.props,
        onMouseEnter = _props3.onMouseEnter,
        children = _props3.children;

    if (onMouseEnter) {
      onMouseEnter(event);
    }
    var seriesChildren = getSeriesChildren(children);
    seriesChildren.forEach(function (child, index) {
      var component = _this3['series' + index];
      if (component && component.onParentMouseEnter) {
        component.onParentMouseEnter(event);
      }
    });
  };

  this._mouseLeaveHandler = function (event) {
    var _props4 = _this3.props,
        onMouseLeave = _props4.onMouseLeave,
        children = _props4.children;

    if (onMouseLeave) {
      onMouseLeave(event);
    }
    var seriesChildren = getSeriesChildren(children);
    seriesChildren.forEach(function (child, index) {
      var component = _this3['series' + index];
      if (component && component.onParentMouseLeave) {
        component.onParentMouseLeave(event);
      }
    });
  };

  this._mouseMoveHandler = function (event) {
    var _props5 = _this3.props,
        onMouseMove = _props5.onMouseMove,
        children = _props5.children;

    if (onMouseMove) {
      onMouseMove(event);
    }
    var seriesChildren = getSeriesChildren(children);
    seriesChildren.forEach(function (child, index) {
      var component = _this3['series' + index];
      if (component && component.onParentMouseMove) {
        component.onParentMouseMove(event);
      }
    });
  };

  this._mouseUpHandler = function (event) {
    var _props6 = _this3.props,
        onMouseUp = _props6.onMouseUp,
        children = _props6.children;

    if (onMouseUp) {
      onMouseUp(event);
    }
    var seriesChildren = getSeriesChildren(children);
    seriesChildren.forEach(function (child, index) {
      var component = _this3['series' + index];
      if (component && component.onParentMouseUp) {
        component.onParentMouseUp(event);
      }
    });
  };

  this._touchCancelHandler = function (event) {
    var onTouchCancel = _this3.props.onTouchCancel;

    if (onTouchCancel) {
      onTouchCancel(event);
    }
  };

  this._touchEndHandler = function (event) {
    var onTouchEnd = _this3.props.onTouchEnd;

    if (onTouchEnd) {
      onTouchEnd(event);
    }
  };

  this._touchMoveHandler = function (event) {
    var _props7 = _this3.props,
        onTouchMove = _props7.onTouchMove,
        children = _props7.children;

    if (onTouchMove) {
      onTouchMove(event);
    }
    var seriesChildren = getSeriesChildren(children);
    seriesChildren.forEach(function (child, index) {
      var component = _this3['series' + index];
      if (component && component.onParentTouchMove) {
        component.onParentTouchMove(event);
      }
    });
  };

  this._touchStartHandler = function (event) {
    var _props8 = _this3.props,
        onTouchStart = _props8.onTouchStart,
        children = _props8.children;

    if (onTouchStart) {
      onTouchStart(event);
    }
    var seriesChildren = getSeriesChildren(children);
    seriesChildren.forEach(function (child, index) {
      var component = _this3['series' + index];
      if (component && component.onParentTouchStart) {
        component.onParentTouchStart(event);
      }
    });
  };

  this._wheelHandler = function (event) {
    var onWheel = _this3.props.onWheel;

    if (onWheel) {
      onWheel(event);
    }
  };
};

XYPlot.displayName = 'XYPlot';

// Copyright (c) 2016 - 2017 Uber Technologies, Inc.

var ORIENTATION$1 = {
  TOP: 'top',
  LEFT: 'left',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

var DIRECTION = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

/**
 * Get total amount of ticks from a given size in pixels.
 * @param {number} size Size of the axis in pixels.
 * @returns {number} Total amount of ticks.
 */
function getTicksTotalFromSize(size) {
  if (size < 700) {
    if (size > 300) {
      return 10;
    }
    return 5;
  }
  return 20;
}

/**
 * Get the tick values from a given d3 scale.
 * @param {d3.scale} scale Scale function.
 * @param {number} tickTotal Total number of ticks
 * @param {Array} tickValues Array of tick values if they exist.
 * @returns {Array} Array of tick values.
 */
function getTickValues(scale, tickTotal, tickValues) {
  return !tickValues ? scale.ticks ? scale.ticks(tickTotal) : scale.domain() : tickValues;
}

/**
 * Generate a description of a decorative axis in terms of a linear equation
 * y = slope * x + offset in coordinates
 * @param {Object} axisStart Object of format {x, y} describing in coordinates
 * the start position of the decorative axis
 * @param {Object} axisEnd Object of format {x, y} describing in coordinates
 * the start position of the decorative axis
 * @returns {Number} Object describing each the line in coordinates
 */
function generateFit(axisStart, axisEnd) {
  // address the special case when the slope is infinite
  if (axisStart.x === axisEnd.x) {
    return {
      left: axisStart.y,
      right: axisEnd.y,
      slope: 0,
      offset: axisStart.x
    };
  }
  var slope = (axisStart.y - axisEnd.y) / (axisStart.x - axisEnd.x);
  return {
    left: axisStart.x,
    right: axisEnd.x,
    // generate the linear projection of the axis direction
    slope: slope,
    offset: axisStart.y - slope * axisStart.x
  };
}

/**
 * Generate a description of a decorative axis in terms of a linear equation
 * y = slope * x + offset in coordinates
 * @param props
 * props.@param {Object} axisStart Object of format {x, y} describing in coordinates
 * the start position of the decorative axis
 * props.@param {Object} axisEnd Object of format {x, y} describing in coordinates
 * the start position of the decorative axis
 * props.@param {Number} numberOfTicks The number of ticks on the axis
 * props.@param {Array.Numbers} axisDomain The values to be interpolated across for the axis
 * @returns {Number} Object describing the slope and the specific coordinates of the points
 */
function generatePoints(_ref) {
  var axisStart = _ref.axisStart,
      axisEnd = _ref.axisEnd,
      numberOfTicks = _ref.numberOfTicks,
      axisDomain = _ref.axisDomain;

  var _generateFit = generateFit(axisStart, axisEnd),
      left = _generateFit.left,
      right = _generateFit.right,
      slope = _generateFit.slope,
      offset = _generateFit.offset;
  // construct a linear band of points, then map them


  var pointSlope = (right - left) / numberOfTicks;
  var axisScale = linear$1().domain([left, right]).range(axisDomain);

  var slopeVertical = axisStart.x === axisEnd.x;
  return {
    slope: slopeVertical ? Infinity : slope,
    points: range(left, right + pointSlope, pointSlope).map(function (val) {
      if (slopeVertical) {
        return { y: val, x: slope * val + offset, text: axisScale(val) };
      }
      return { x: val, y: slope * val + offset, text: axisScale(val) };
    }).slice(0, numberOfTicks + 1)
  };
}

/**
 * Compute the angle (in radians) of a decorative axis
 * @param {Object} axisStart Object of format {x, y} describing in coordinates
 * the start position of the decorative axis
 * @param {Object} axisEnd Object of format {x, y} describing in coordinates
 * the start position of the decorative axis
 * @returns {Number} Angle in radials
 */
function getAxisAngle(axisStart, axisEnd) {
  if (axisStart.x === axisEnd.x) {
    return axisEnd.y > axisStart.y ? Math.PI / 2 : 3 * Math.PI / 2;
  }
  return Math.atan((axisEnd.y - axisStart.y) / (axisEnd.x - axisStart.x));
}

var _extends$C = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Generate the actual polygons to be plotted
 * @param {Object} props
 - props.animation {Boolean}
 - props.axisDomain {Array} a pair of values specifying the domain of the axis
 - props.numberOfTicks{Number} the number of ticks on the axis
 - props.axisStart {Object} a object specify in cartesian space the start of the axis
 example: {x: 0, y: 0}
 - props.axisEnd {Object} a object specify in cartesian space the start of the axis
 - props.tickValue {Func} a formatting function for the tick values
 - props.tickSize {Number} a pixel size of the axis
 - props.style {Object} The style object for the axis
 * @return {Component} the plotted axis
 */
function decorativeAxisTick(props) {
  var axisDomain = props.axisDomain,
      numberOfTicks = props.numberOfTicks,
      axisStart = props.axisStart,
      axisEnd = props.axisEnd,
      tickValue = props.tickValue,
      tickSize = props.tickSize,
      style = props.style;

  var _generatePoints = generatePoints({
    axisStart: axisStart,
    axisEnd: axisEnd,
    numberOfTicks: numberOfTicks,
    axisDomain: axisDomain
  }),
      points = _generatePoints.points;
  // add a quarter rotation to make ticks orthogonal to axis


  var tickAngle = getAxisAngle(axisStart, axisEnd) + Math.PI / 2;
  return points.map(function (point, index) {
    var tickProps = _extends$C({
      x1: 0,
      y1: 0,
      x2: tickSize * Math.cos(tickAngle),
      y2: tickSize * Math.sin(tickAngle)
    }, style.ticks);

    var textProps = _extends$C({
      x: tickSize * Math.cos(tickAngle),
      y: tickSize * Math.sin(tickAngle),
      textAnchor: 'start'
    }, style.text);
    return react.createElement(
      'g',
      {
        key: index,
        transform: 'translate(' + point.x + ', ' + point.y + ')',
        className: 'rv-xy-plot__axis__tick'
      },
      react.createElement('line', _extends$C({}, tickProps, { className: 'rv-xy-plot__axis__tick__line' })),
      react.createElement(
        'text',
        _extends$C({}, textProps, { className: 'rv-xy-plot__axis__tick__text' }),
        tickValue(point.text)
      )
    );
  });
}

var _extends$D = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$x = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$x(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$x(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$x(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$d = 'rv-xy-manipulable-axis rv-xy-plot__axis';

var animatedProps = ['xRange', 'yRange', 'xDomain', 'yDomain', 'width', 'height', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'tickSize', 'tickTotal', 'tickSizeInner', 'tickSizeOuter'];

var DecorativeAxis = function (_AbstractSeries) {
  _inherits$x(DecorativeAxis, _AbstractSeries);

  function DecorativeAxis() {
    _classCallCheck$x(this, DecorativeAxis);

    return _possibleConstructorReturn$x(this, (DecorativeAxis.__proto__ || Object.getPrototypeOf(DecorativeAxis)).apply(this, arguments));
  }

  _createClass$x(DecorativeAxis, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          animation = _props.animation,
          className = _props.className,
          marginLeft = _props.marginLeft,
          marginTop = _props.marginTop,
          axisStart = _props.axisStart,
          axisEnd = _props.axisEnd,
          axisDomain = _props.axisDomain,
          numberOfTicks = _props.numberOfTicks,
          tickValue = _props.tickValue,
          tickSize = _props.tickSize,
          style = _props.style;


      if (animation) {
        return react.createElement(
          Animation,
          _extends$D({}, this.props, { animatedProps: animatedProps }),
          react.createElement(DecorativeAxis, _extends$D({}, this.props, { animation: null }))
        );
      }

      var x = this._getAttributeFunctor('x');
      var y = this._getAttributeFunctor('y');

      return react.createElement(
        'g',
        {
          className: predefinedClassName$d + ' ' + className,
          transform: 'translate(' + marginLeft + ',' + marginTop + ')'
        },
        react.createElement('line', _extends$D({}, _extends$D({
          x1: x({ x: axisStart.x }),
          x2: x({ x: axisEnd.x }),
          y1: y({ y: axisStart.y }),
          y2: y({ y: axisEnd.y })
        }, style.line), {
          className: 'rv-xy-plot__axis__line'
        })),
        react.createElement(
          'g',
          { className: 'rv-xy-manipulable-axis__ticks' },
          decorativeAxisTick({
            axisDomain: axisDomain,
            axisEnd: { x: x(axisEnd), y: y(axisEnd) },
            axisStart: { x: x(axisStart), y: y(axisStart) },
            numberOfTicks: numberOfTicks,
            tickValue: tickValue,
            tickSize: tickSize,
            style: style
          })
        )
      );
    }
  }]);

  return DecorativeAxis;
}(AbstractSeries);

var DEFAULT_FORMAT = format('.2r');

DecorativeAxis.defaultProps = {
  className: '',
  numberOfTicks: 10,
  tickValue: function tickValue(d) {
    return DEFAULT_FORMAT(d);
  },
  tickSize: 5,
  style: {
    line: {
      strokeWidth: 1
    },
    ticks: {
      strokeWidth: 2
    },
    text: {}
  }
};
DecorativeAxis.propTypes = _extends$D({}, AbstractSeries.propTypes, {
  axisDomain: propTypes.arrayOf(propTypes.number).isRequired,
  axisEnd: propTypes.shape({
    x: propTypes.oneOfType([propTypes.number, propTypes.string]),
    y: propTypes.oneOfType([propTypes.number, propTypes.string])
  }).isRequired,
  axisStart: propTypes.shape({
    x: propTypes.oneOfType([propTypes.number, propTypes.string]),
    y: propTypes.oneOfType([propTypes.number, propTypes.string])
  }).isRequired,
  className: propTypes.string,
  numberOfTicks: propTypes.number,
  tickValue: propTypes.func,
  tickSize: propTypes.number,
  style: propTypes.shape({
    line: propTypes.object,
    ticks: propTypes.object,
    text: propTypes.object
  })
});
DecorativeAxis.displayName = 'DecorativeAxis';

var _extends$E = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var LEFT = ORIENTATION$1.LEFT,
    RIGHT = ORIENTATION$1.RIGHT,
    TOP = ORIENTATION$1.TOP,
    BOTTOM = ORIENTATION$1.BOTTOM;


var propTypes$5 = {
  height: propTypes.number.isRequired,
  style: propTypes.object,
  orientation: propTypes.oneOf([LEFT, RIGHT, TOP, BOTTOM]).isRequired,
  width: propTypes.number.isRequired
};

var defaultProps$2 = {
  style: {}
};

function AxisLine(_ref) {
  var orientation = _ref.orientation,
      width = _ref.width,
      height = _ref.height,
      style = _ref.style;

  var lineProps = void 0;
  if (orientation === LEFT) {
    lineProps = {
      x1: width,
      x2: width,
      y1: 0,
      y2: height
    };
  } else if (orientation === RIGHT) {
    lineProps = {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: height
    };
  } else if (orientation === TOP) {
    lineProps = {
      x1: 0,
      x2: width,
      y1: height,
      y2: height
    };
  } else {
    lineProps = {
      x1: 0,
      x2: width,
      y1: 0,
      y2: 0
    };
  }
  return react.createElement('line', _extends$E({}, lineProps, { className: 'rv-xy-plot__axis__line', style: style }));
}

AxisLine.defaultProps = defaultProps$2;
AxisLine.displayName = 'AxisLine';
AxisLine.propTypes = propTypes$5;

var _extends$F = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$y = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty$5(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$y(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$y(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$y(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LEFT$1 = ORIENTATION$1.LEFT,
    RIGHT$1 = ORIENTATION$1.RIGHT,
    TOP$1 = ORIENTATION$1.TOP,
    BOTTOM$1 = ORIENTATION$1.BOTTOM;


var propTypes$6 = {
  height: propTypes.number.isRequired,
  orientation: propTypes.oneOf([LEFT$1, RIGHT$1, TOP$1, BOTTOM$1]).isRequired,
  style: propTypes.object,
  width: propTypes.number.isRequired
};

var defaultProps$3 = {
  style: {}
};

function _getTickFormatFn(scale, tickTotal, tickFormat) {
  return !tickFormat ? scale.tickFormat ? scale.tickFormat(tickTotal) : function (v) {
    return v;
  } : tickFormat;
}

var AxisTicks = function (_React$Component) {
  _inherits$y(AxisTicks, _React$Component);

  function AxisTicks() {
    _classCallCheck$y(this, AxisTicks);

    return _possibleConstructorReturn$y(this, (AxisTicks.__proto__ || Object.getPrototypeOf(AxisTicks)).apply(this, arguments));
  }

  _createClass$y(AxisTicks, [{
    key: '_areTicksWrapped',

    /**
     * Check if axis ticks should be mirrored (for the right and top positions.
     * @returns {boolean} True if mirrored.
     * @private
     */
    value: function _areTicksWrapped() {
      var orientation = this.props.orientation;

      return orientation === LEFT$1 || orientation === TOP$1;
    }
  }, {
    key: '_getTickContainerPropsGetterFn',
    value: function _getTickContainerPropsGetterFn() {
      if (this._isAxisVertical()) {
        return function (pos) {
          return { transform: 'translate(0, ' + pos + ')' };
        };
      }
      return function (pos) {
        return { transform: 'translate(' + pos + ', 0)' };
      };
    }

    /**
     * Get attributes for the label of the tick.
     * @returns {Object} Object with properties.
     * @private
     */

  }, {
    key: '_getTickLabelProps',
    value: function _getTickLabelProps() {
      var _props = this.props,
          orientation = _props.orientation,
          tickLabelAngle = _props.tickLabelAngle,
          tickSize = _props.tickSize,
          _props$tickSizeOuter = _props.tickSizeOuter,
          tickSizeOuter = _props$tickSizeOuter === undefined ? tickSize : _props$tickSizeOuter,
          _props$tickPadding = _props.tickPadding,
          tickPadding = _props$tickPadding === undefined ? tickSize : _props$tickPadding;

      // Assign the text orientation inside the label of the tick mark.

      var textAnchor = void 0;
      if (orientation === LEFT$1 || orientation === BOTTOM$1 && tickLabelAngle) {
        textAnchor = 'end';
      } else if (orientation === RIGHT$1 || orientation === TOP$1 && tickLabelAngle) {
        textAnchor = 'start';
      } else {
        textAnchor = 'middle';
      }

      // The label's position is translated to the given padding and then the
      // label is rotated to the given angle.
      var isVertical = this._isAxisVertical();
      var wrap = this._areTicksWrapped() ? -1 : 1;

      var labelOffset = wrap * (tickSizeOuter + tickPadding);
      var transform = (isVertical ? 'translate(' + labelOffset + ', 0)' : 'translate(0, ' + labelOffset + ')') + (tickLabelAngle ? ' rotate(' + tickLabelAngle + ')' : '');

      // Set the vertical offset of the label according to the position of
      // the axis.
      var dy = orientation === TOP$1 || tickLabelAngle ? '0' : orientation === BOTTOM$1 ? '0.72em' : '0.32em';

      return {
        textAnchor: textAnchor,
        dy: dy,
        transform: transform
      };
    }

    /**
     * Get the props of the tick line.
     * @returns {Object} Props.
     * @private
     */

  }, {
    key: '_getTickLineProps',
    value: function _getTickLineProps() {
      var _ref;

      var _props2 = this.props,
          tickSize = _props2.tickSize,
          _props2$tickSizeOuter = _props2.tickSizeOuter,
          tickSizeOuter = _props2$tickSizeOuter === undefined ? tickSize : _props2$tickSizeOuter,
          _props2$tickSizeInner = _props2.tickSizeInner,
          tickSizeInner = _props2$tickSizeInner === undefined ? tickSize : _props2$tickSizeInner;

      var isVertical = this._isAxisVertical();
      var tickXAttr = isVertical ? 'y' : 'x';
      var tickYAttr = isVertical ? 'x' : 'y';
      var wrap = this._areTicksWrapped() ? -1 : 1;
      return _ref = {}, _defineProperty$5(_ref, tickXAttr + '1', 0), _defineProperty$5(_ref, tickXAttr + '2', 0), _defineProperty$5(_ref, tickYAttr + '1', -wrap * tickSizeInner), _defineProperty$5(_ref, tickYAttr + '2', wrap * tickSizeOuter), _ref;
    }

    /**
     * Gets if the axis is vertical.
     * @returns {boolean} True if vertical.
     * @private
     */

  }, {
    key: '_isAxisVertical',
    value: function _isAxisVertical() {
      var orientation = this.props.orientation;

      return orientation === LEFT$1 || orientation === RIGHT$1;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          attr = _props3.attr,
          orientation = _props3.orientation,
          width = _props3.width,
          height = _props3.height,
          style = _props3.style,
          tickFormat = _props3.tickFormat,
          tickTotal = _props3.tickTotal,
          tickValues = _props3.tickValues;


      var x = orientation === LEFT$1 ? width : 0;
      var y = orientation === TOP$1 ? height : 0;

      var scale = getAttributeScale(this.props, attr);

      var values = getTickValues(scale, tickTotal, tickValues);
      var tickFormatFn = _getTickFormatFn(scale, tickTotal, tickFormat);

      var translateFn = this._getTickContainerPropsGetterFn();
      var pathProps = this._getTickLineProps();
      var textProps = this._getTickLabelProps();

      var ticks = values.map(function (v, i) {
        var pos = scale(v);
        var labelNode = tickFormatFn(v, i, scale, tickTotal);
        var shouldRenderAsOwnNode = react.isValidElement(labelNode) && !['tspan', 'textPath'].includes(labelNode.type);
        var shouldAddProps = labelNode && typeof labelNode.type !== 'string';
        return react.createElement(
          'g',
          _extends$F({
            key: i
          }, translateFn(pos, 0), {
            className: 'rv-xy-plot__axis__tick',
            style: style
          }),
          react.createElement('line', _extends$F({}, pathProps, {
            className: 'rv-xy-plot__axis__tick__line',
            style: _extends$F({}, style, style.line)
          })),
          shouldRenderAsOwnNode ? react.cloneElement(labelNode, shouldAddProps ? _extends$F({}, textProps, {
            containerWidth: width,
            tickCount: values.length
          }) : undefined) : react.createElement(
            'text',
            _extends$F({}, textProps, {
              className: 'rv-xy-plot__axis__tick__text',
              style: _extends$F({}, style, style.text)
            }),
            labelNode
          )
        );
      });

      return react.createElement(
        'g',
        {
          transform: 'translate(' + x + ', ' + y + ')',
          className: 'rv-xy-plot__axis__ticks'
        },
        ticks
      );
    }
  }]);

  return AxisTicks;
}(react.Component);

AxisTicks.defaultProps = defaultProps$3;
AxisTicks.displayName = 'AxisTicks';
AxisTicks.propTypes = propTypes$6;
AxisTicks.requiresSVG = true;

var _extends$G = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty$6(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Assuming that 16px = 1em
var ADJUSTMENT_FOR_TEXT_SIZE = 16;
var MARGIN = 6;
var LEFT$2 = ORIENTATION$1.LEFT,
    RIGHT$2 = ORIENTATION$1.RIGHT,
    TOP$2 = ORIENTATION$1.TOP,
    BOTTOM$2 = ORIENTATION$1.BOTTOM;

var defaultProps$4 = {
  position: 'end'
};

/**
 * Compute transformations, keyed by orientation
 * @param {number} width - width of axis
 * @param {number} height - height of axis
 * @returns {Object} Object of transformations, keyed by orientation
 */
var transformation = function transformation(width, height) {
  var _ref;

  return _ref = {}, _defineProperty$6(_ref, LEFT$2, {
    end: {
      x: ADJUSTMENT_FOR_TEXT_SIZE,
      y: MARGIN,
      rotation: -90,
      textAnchor: 'end'
    },
    middle: {
      x: ADJUSTMENT_FOR_TEXT_SIZE,
      y: height / 2 - MARGIN,
      rotation: -90,
      textAnchor: 'middle'
    },
    start: {
      x: ADJUSTMENT_FOR_TEXT_SIZE,
      y: height - MARGIN,
      rotation: -90,
      textAnchor: 'start'
    }
  }), _defineProperty$6(_ref, RIGHT$2, {
    end: {
      x: ADJUSTMENT_FOR_TEXT_SIZE * -0.5,
      y: MARGIN,
      rotation: -90,
      textAnchor: 'end'
    },
    middle: {
      x: ADJUSTMENT_FOR_TEXT_SIZE * -0.5,
      y: height / 2 - MARGIN,
      rotation: -90,
      textAnchor: 'middle'
    },
    start: {
      x: ADJUSTMENT_FOR_TEXT_SIZE * -0.5,
      y: height - MARGIN,
      rotation: -90,
      textAnchor: 'start'
    }
  }), _defineProperty$6(_ref, TOP$2, {
    start: {
      x: MARGIN,
      y: ADJUSTMENT_FOR_TEXT_SIZE,
      rotation: 0,
      textAnchor: 'start'
    },
    middle: {
      x: width / 2 - MARGIN,
      y: ADJUSTMENT_FOR_TEXT_SIZE,
      rotation: 0,
      textAnchor: 'middle'
    },
    end: {
      x: width - MARGIN,
      y: ADJUSTMENT_FOR_TEXT_SIZE,
      rotation: 0,
      textAnchor: 'end'
    }
  }), _defineProperty$6(_ref, BOTTOM$2, {
    start: {
      x: MARGIN,
      y: -MARGIN,
      rotation: 0,
      textAnchor: 'start'
    },
    middle: {
      x: width / 2 - MARGIN,
      y: -MARGIN,
      rotation: 0,
      textAnchor: 'middle'
    },
    end: {
      x: width - MARGIN,
      y: -MARGIN,
      rotation: 0,
      textAnchor: 'end'
    }
  }), _ref;
};

var propTypes$7 = {
  width: propTypes.number.isRequired,
  height: propTypes.number.isRequired,
  orientation: propTypes.oneOf([LEFT$2, RIGHT$2, TOP$2, BOTTOM$2]).isRequired,
  style: propTypes.object,
  title: propTypes.string.isRequired
};

function AxisTitle(_ref2) {
  var orientation = _ref2.orientation,
      position = _ref2.position,
      width = _ref2.width,
      height = _ref2.height,
      style = _ref2.style,
      title = _ref2.title;

  var outerGroupTranslateX = orientation === LEFT$2 ? width : 0;
  var outerGroupTranslateY = orientation === TOP$2 ? height : 0;
  var outerGroupTransform = 'translate(' + outerGroupTranslateX + ', ' + outerGroupTranslateY + ')';
  var _transformation$orien = transformation(width, height)[orientation][position],
      x = _transformation$orien.x,
      y = _transformation$orien.y,
      rotation = _transformation$orien.rotation,
      textAnchor = _transformation$orien.textAnchor;

  var innerGroupTransform = 'translate(' + x + ', ' + y + ') rotate(' + rotation + ')';

  return react.createElement(
    'g',
    { transform: outerGroupTransform, className: 'rv-xy-plot__axis__title' },
    react.createElement(
      'g',
      { style: _extends$G({ textAnchor: textAnchor }, style), transform: innerGroupTransform },
      react.createElement(
        'text',
        { style: style },
        title
      )
    )
  );
}

AxisTitle.displayName = 'AxisTitle';
AxisTitle.propTypes = propTypes$7;
AxisTitle.defaultProps = defaultProps$4;

var _extends$H = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$z = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$z(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$z(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$z(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultAnimatedProps = ['xRange', 'yRange', 'xDomain', 'yDomain', 'width', 'height', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'tickSize', 'tickTotal', 'tickSizeInner', 'tickSizeOuter'];

var LEFT$3 = ORIENTATION$1.LEFT,
    RIGHT$3 = ORIENTATION$1.RIGHT,
    TOP$3 = ORIENTATION$1.TOP,
    BOTTOM$3 = ORIENTATION$1.BOTTOM;


var propTypes$8 = {
  orientation: propTypes.oneOf([LEFT$3, RIGHT$3, TOP$3, BOTTOM$3]),
  attr: propTypes.string.isRequired,
  attrAxis: propTypes.string,
  width: propTypes.number,
  height: propTypes.number,
  top: propTypes.number,
  left: propTypes.number,
  title: propTypes.string,

  style: propTypes.object,

  className: propTypes.string,
  hideTicks: propTypes.bool,
  hideLine: propTypes.bool,
  on0: propTypes.bool,
  tickLabelAngle: propTypes.number,
  tickSize: propTypes.number,
  tickSizeInner: propTypes.number,
  tickSizeOuter: propTypes.number,
  tickPadding: propTypes.number,
  tickValues: propTypes.arrayOf(propTypes.oneOfType([propTypes.number, propTypes.string])),
  tickFormat: propTypes.func,
  tickTotal: propTypes.number,

  // Not expected to be used by the users.
  // TODO: Add underscore to these properties later.
  marginTop: propTypes.number,
  marginBottom: propTypes.number,
  marginLeft: propTypes.number,
  marginRight: propTypes.number,
  innerWidth: propTypes.number,
  innerHeight: propTypes.number
};

var defaultProps$5 = {
  className: '',
  on0: false,
  style: {},
  tickSize: 6,
  tickPadding: 8,
  orientation: BOTTOM$3
};

var predefinedClassName$e = 'rv-xy-plot__axis';
var VERTICAL_CLASS_NAME = 'rv-xy-plot__axis--vertical';
var HORIZONTAL_CLASS_NAME = 'rv-xy-plot__axis--horizontal';

var Axis = function (_PureComponent) {
  _inherits$z(Axis, _PureComponent);

  function Axis() {
    _classCallCheck$z(this, Axis);

    return _possibleConstructorReturn$z(this, (Axis.__proto__ || Object.getPrototypeOf(Axis)).apply(this, arguments));
  }

  _createClass$z(Axis, [{
    key: '_getDefaultAxisProps',

    /**
     * Define the default values depending on the data passed from the outside.
     * @returns {*} Object of default properties.
     * @private
     */
    value: function _getDefaultAxisProps() {
      var _props = this.props,
          innerWidth = _props.innerWidth,
          innerHeight = _props.innerHeight,
          marginTop = _props.marginTop,
          marginBottom = _props.marginBottom,
          marginLeft = _props.marginLeft,
          marginRight = _props.marginRight,
          orientation = _props.orientation;

      if (orientation === BOTTOM$3) {
        return {
          tickTotal: getTicksTotalFromSize(innerWidth),
          top: innerHeight + marginTop,
          left: marginLeft,
          width: innerWidth,
          height: marginBottom
        };
      } else if (orientation === TOP$3) {
        return {
          tickTotal: getTicksTotalFromSize(innerWidth),
          top: 0,
          left: marginLeft,
          width: innerWidth,
          height: marginTop
        };
      } else if (orientation === LEFT$3) {
        return {
          tickTotal: getTicksTotalFromSize(innerHeight),
          top: marginTop,
          left: 0,
          width: marginLeft,
          height: innerHeight
        };
      }
      return {
        tickTotal: getTicksTotalFromSize(innerHeight),
        top: marginTop,
        left: marginLeft + innerWidth,
        width: marginRight,
        height: innerHeight
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var animation = this.props.animation;


      if (animation) {
        var animatedProps = animation.nonAnimatedProps ? defaultAnimatedProps.filter(function (prop) {
          return animation.nonAnimatedProps.indexOf(prop) < 0;
        }) : defaultAnimatedProps;

        return react.createElement(
          Animation,
          _extends$H({}, this.props, { animatedProps: animatedProps }),
          react.createElement(Axis, _extends$H({}, this.props, { animation: null }))
        );
      }

      var props = _extends$H({}, this._getDefaultAxisProps(), this.props);

      var attrAxis = props.attrAxis,
          className = props.className,
          height = props.height,
          hideLine = props.hideLine,
          hideTicks = props.hideTicks,
          left = props.left,
          marginTop = props.marginTop,
          on0 = props.on0,
          orientation = props.orientation,
          position = props.position,
          style = props.style,
          title = props.title,
          top = props.top,
          width = props.width;

      var isVertical = [LEFT$3, RIGHT$3].indexOf(orientation) > -1;
      var axisClassName = isVertical ? VERTICAL_CLASS_NAME : HORIZONTAL_CLASS_NAME;

      var leftPos = left;
      var topPos = top;
      if (on0) {
        var scale = getAttributeScale(props, attrAxis);
        if (isVertical) {
          leftPos = scale(0);
        } else {
          topPos = marginTop + scale(0);
        }
      }

      return react.createElement(
        'g',
        {
          transform: 'translate(' + leftPos + ',' + topPos + ')',
          className: predefinedClassName$e + ' ' + axisClassName + ' ' + className,
          style: style
        },
        !hideLine && react.createElement(AxisLine, {
          height: height,
          width: width,
          orientation: orientation,
          style: _extends$H({}, style, style.line)
        }),
        !hideTicks && react.createElement(AxisTicks, _extends$H({}, props, { style: _extends$H({}, style, style.ticks) })),
        title ? react.createElement(AxisTitle, {
          position: position,
          title: title,
          height: height,
          width: width,
          style: _extends$H({}, style, style.title),
          orientation: orientation
        }) : null
      );
    }
  }]);

  return Axis;
}(react_1);

Axis.displayName = 'Axis';
Axis.propTypes = propTypes$8;
Axis.defaultProps = defaultProps$5;
Axis.requiresSVG = true;

var _extends$I = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var TOP$4 = ORIENTATION$1.TOP,
    BOTTOM$4 = ORIENTATION$1.BOTTOM;


var propTypes$9 = _extends$I({}, Axis.propTypes, {
  orientation: propTypes.oneOf([TOP$4, BOTTOM$4])
});

var _extends$J = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var LEFT$4 = ORIENTATION$1.LEFT,
    RIGHT$4 = ORIENTATION$1.RIGHT;


var propTypes$a = _extends$J({}, Axis.propTypes, {
  orientation: propTypes.oneOf([LEFT$4, RIGHT$4])
});

var _extends$K = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$A = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$A(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$A(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$A(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var animatedProps$1 = ['xRange', 'yRange', 'xDomain', 'yDomain', 'width', 'height', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'tickTotal'];

var CircularGridLines = function (_PureComponent) {
  _inherits$A(CircularGridLines, _PureComponent);

  function CircularGridLines() {
    _classCallCheck$A(this, CircularGridLines);

    return _possibleConstructorReturn$A(this, (CircularGridLines.__proto__ || Object.getPrototypeOf(CircularGridLines)).apply(this, arguments));
  }

  _createClass$A(CircularGridLines, [{
    key: '_getDefaultProps',
    value: function _getDefaultProps() {
      var _props = this.props,
          innerWidth = _props.innerWidth,
          innerHeight = _props.innerHeight,
          marginTop = _props.marginTop,
          marginLeft = _props.marginLeft;

      return {
        left: marginLeft,
        top: marginTop,
        width: innerWidth,
        height: innerHeight,
        style: {},
        tickTotal: getTicksTotalFromSize(Math.min(innerWidth, innerHeight))
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          animation = _props2.animation,
          centerX = _props2.centerX,
          centerY = _props2.centerY;

      if (animation) {
        return react.createElement(
          Animation,
          _extends$K({}, this.props, { animatedProps: animatedProps$1 }),
          react.createElement(CircularGridLines, _extends$K({}, this.props, { animation: null }))
        );
      }

      var props = _extends$K({}, this._getDefaultProps(), this.props);

      var tickTotal = props.tickTotal,
          tickValues = props.tickValues,
          marginLeft = props.marginLeft,
          marginTop = props.marginTop,
          rRange = props.rRange,
          style = props.style;


      var xScale = getAttributeScale(props, 'x');
      var yScale = getAttributeScale(props, 'y');
      var values = getTickValues(xScale, tickTotal, tickValues);
      return react.createElement(
        'g',
        {
          transform: 'translate(' + (xScale(centerX) + marginLeft) + ',' + (yScale(centerY) + marginTop) + ')',
          className: 'rv-xy-plot__circular-grid-lines'
        },
        values.reduce(function (res, value, index) {
          var radius = xScale(value);
          if (rRange && (radius < rRange[0] || radius > rRange[1])) {
            return res;
          }
          return res.concat([react.createElement('circle', _extends$K({ cx: 0, cy: 0, r: radius }, {
            key: index,
            className: 'rv-xy-plot__circular-grid-lines__line',
            style: style
          }))]);
        }, [])
      );
    }
  }]);

  return CircularGridLines;
}(react_1);

CircularGridLines.displayName = 'CircularGridLines';
CircularGridLines.propTypes = {
  centerX: propTypes.number,
  centerY: propTypes.number,
  width: propTypes.number,
  height: propTypes.number,
  top: propTypes.number,
  left: propTypes.number,
  rRange: propTypes.arrayOf(propTypes.number),

  style: propTypes.object,

  tickValues: propTypes.arrayOf(propTypes.number),
  tickTotal: propTypes.number,

  animation: AnimationPropType,
  // generally supplied by xyplot
  marginTop: propTypes.number,
  marginBottom: propTypes.number,
  marginLeft: propTypes.number,
  marginRight: propTypes.number,
  innerWidth: propTypes.number,
  innerHeight: propTypes.number
};
CircularGridLines.defaultProps = {
  centerX: 0,
  centerY: 0
};
CircularGridLines.requiresSVG = true;

var _createClass$B = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$B(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$B(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$B(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChartLabel = function (_React$PureComponent) {
  _inherits$B(ChartLabel, _React$PureComponent);

  function ChartLabel() {
    _classCallCheck$B(this, ChartLabel);

    return _possibleConstructorReturn$B(this, (ChartLabel.__proto__ || Object.getPrototypeOf(ChartLabel)).apply(this, arguments));
  }

  _createClass$B(ChartLabel, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          innerHeight = _props.innerHeight,
          innerWidth = _props.innerWidth,
          marginBottom = _props.marginBottom,
          marginLeft = _props.marginLeft,
          marginRight = _props.marginRight,
          marginTop = _props.marginTop,
          className = _props.className,
          includeMargin = _props.includeMargin,
          style = _props.style,
          text = _props.text,
          xPercent = _props.xPercent,
          yPercent = _props.yPercent;

      var width = innerWidth + (includeMargin ? marginLeft + marginRight : 0);
      var height = innerHeight + (includeMargin ? marginTop + marginBottom : 0);
      var xPos = width * xPercent + (includeMargin ? 0 : marginLeft);
      var yPos = height * yPercent + (includeMargin ? marginLeft : 0);
      return react.createElement(
        'g',
        {
          transform: 'translate(' + xPos + ', ' + yPos + ')',
          className: 'rv-xy-plot__axis__title ' + className },
        react.createElement(
          'text',
          style,
          text
        )
      );
    }
  }], [{
    key: 'requiresSVG',
    get: function get() {
      return true;
    }
  }]);

  return ChartLabel;
}(react.PureComponent);

ChartLabel.displayName = 'ChartLabel';
ChartLabel.propTypes = {
  className: propTypes.string,
  includeMargin: propTypes.bool,
  style: propTypes.object,
  text: propTypes.string.isRequired,
  xPercent: propTypes.number.isRequired,
  yPercent: propTypes.number.isRequired
};
ChartLabel.defaultProps = {
  className: '',
  includeMargin: true,
  text: '',
  xPercent: 0,
  yPercent: 0,
  style: {}
};

var _extends$L = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$C = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty$7(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$C(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$C(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$C(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VERTICAL = DIRECTION.VERTICAL,
    HORIZONTAL = DIRECTION.HORIZONTAL;


var propTypes$b = {
  direction: propTypes.oneOf([VERTICAL, HORIZONTAL]),
  attr: propTypes.string.isRequired,
  width: propTypes.number,
  height: propTypes.number,
  top: propTypes.number,
  left: propTypes.number,

  style: propTypes.object,

  tickValues: propTypes.arrayOf(propTypes.oneOfType([propTypes.number, propTypes.string])),
  tickTotal: propTypes.number,

  animation: AnimationPropType,

  // generally supplied by xyplot
  marginTop: propTypes.number,
  marginBottom: propTypes.number,
  marginLeft: propTypes.number,
  marginRight: propTypes.number,
  innerWidth: propTypes.number,
  innerHeight: propTypes.number
};

var defaultProps$8 = {
  direction: VERTICAL
};

var animatedProps$2 = ['xRange', 'yRange', 'xDomain', 'yDomain', 'width', 'height', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'tickTotal'];

var GridLines = function (_PureComponent) {
  _inherits$C(GridLines, _PureComponent);

  function GridLines() {
    _classCallCheck$C(this, GridLines);

    return _possibleConstructorReturn$C(this, (GridLines.__proto__ || Object.getPrototypeOf(GridLines)).apply(this, arguments));
  }

  _createClass$C(GridLines, [{
    key: '_getDefaultProps',
    value: function _getDefaultProps() {
      var _props = this.props,
          innerWidth = _props.innerWidth,
          innerHeight = _props.innerHeight,
          marginTop = _props.marginTop,
          marginLeft = _props.marginLeft,
          direction = _props.direction;

      return {
        left: marginLeft,
        top: marginTop,
        width: innerWidth,
        height: innerHeight,
        tickTotal: getTicksTotalFromSize(direction === VERTICAL ? innerWidth : innerHeight)
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var animation = this.props.animation;

      if (animation) {
        return react.createElement(
          Animation,
          _extends$L({}, this.props, { animatedProps: animatedProps$2 }),
          react.createElement(GridLines, _extends$L({}, this.props, { animation: null }))
        );
      }

      var props = _extends$L({}, this._getDefaultProps(), this.props);

      var attr = props.attr,
          direction = props.direction,
          width = props.width,
          height = props.height,
          style = props.style,
          tickTotal = props.tickTotal,
          tickValues = props.tickValues,
          top = props.top,
          left = props.left;

      var isVertical = direction === VERTICAL;
      var tickXAttr = isVertical ? 'y' : 'x';
      var tickYAttr = isVertical ? 'x' : 'y';
      var length = isVertical ? height : width;

      var scale = getAttributeScale(props, attr);
      var values = getTickValues(scale, tickTotal, tickValues);

      return react.createElement(
        'g',
        {
          transform: 'translate(' + left + ',' + top + ')',
          className: 'rv-xy-plot__grid-lines'
        },
        values.map(function (v, i) {
          var _pathProps;

          var pos = scale(v);
          var pathProps = (_pathProps = {}, _defineProperty$7(_pathProps, tickYAttr + '1', pos), _defineProperty$7(_pathProps, tickYAttr + '2', pos), _defineProperty$7(_pathProps, tickXAttr + '1', 0), _defineProperty$7(_pathProps, tickXAttr + '2', length), _pathProps);
          return react.createElement('line', _extends$L({}, pathProps, {
            key: i,
            className: 'rv-xy-plot__grid-lines__line',
            style: style
          }));
        })
      );
    }
  }]);

  return GridLines;
}(react_1);

GridLines.displayName = 'GridLines';
GridLines.defaultProps = defaultProps$8;
GridLines.propTypes = propTypes$b;
GridLines.requiresSVG = true;

// Copyright (c) 2016 - 2017 Uber Technologies, Inc.

var predefinedClassName$f = 'rv-gradient-defs';

function GradientDefs(props) {
  var className = props.className;

  return react.createElement(
    'defs',
    { className: predefinedClassName$f + ' ' + className },
    props.children
  );
}

GradientDefs.displayName = 'GradientDefs';
GradientDefs.requiresSVG = true;
GradientDefs.propTypes = {
  className: propTypes.string
};
GradientDefs.defaultProps = {
  className: ''
};

var _extends$M = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var VERTICAL$1 = DIRECTION.VERTICAL;


var propTypes$c = _extends$M({}, GridLines.propTypes, {
  direction: propTypes.oneOf([VERTICAL$1])
});

var _extends$N = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var HORIZONTAL$1 = DIRECTION.HORIZONTAL;


var propTypes$d = _extends$N({}, GridLines.propTypes, {
  direction: propTypes.oneOf([HORIZONTAL$1])
});

var _extends$O = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var NOOP = function NOOP(f) {
  return f;
};

// Find the index of the node at coordinates of a touch point
function getNodeIndex(evt) {
  var _evt$nativeEvent = evt.nativeEvent,
      pageX = _evt$nativeEvent.pageX,
      pageY = _evt$nativeEvent.pageY;

  var target = document.elementFromPoint(pageX, pageY);
  if (!target) {
    return -1;
  }
  var parentNode = target.parentNode;

  return Array.prototype.indexOf.call(parentNode.childNodes, target);
}

function getExtent(_ref) {
  var innerWidth = _ref.innerWidth,
      innerHeight = _ref.innerHeight,
      marginLeft = _ref.marginLeft,
      marginTop = _ref.marginTop;

  return [[marginLeft, marginTop], [innerWidth + marginLeft, innerHeight + marginTop]];
}

function Voronoi(props) {
  var className = props.className,
      extent = props.extent,
      nodes = props.nodes,
      onBlur = props.onBlur,
      _onClick = props.onClick,
      _onMouseUp = props.onMouseUp,
      _onMouseDown = props.onMouseDown,
      onHover = props.onHover,
      polygonStyle = props.polygonStyle,
      style = props.style,
      x = props.x,
      y = props.y;
  // Create a voronoi with each node center points

  var voronoiInstance = voronoi().x(x || getAttributeFunctor(props, 'x')).y(y || getAttributeFunctor(props, 'y')).extent(extent || getExtent(props));

  // Create an array of polygons corresponding to the cells in voronoi
  var polygons = voronoiInstance.polygons(nodes);

  // Create helper function to handle special logic for touch events
  var handleTouchEvent = function handleTouchEvent(handler) {
    return function (evt) {
      evt.preventDefault();
      var index = getNodeIndex(evt);
      if (index > -1 && index < polygons.length) {
        var d = polygons[index];
        handler(d.data);
      }
    };
  };

  return react.createElement(
    'g',
    {
      className: className + ' rv-voronoi',
      style: style
      // Because of the nature of how touch events, and more specifically touchmove
      // and how it differs from mouseover, we must manage touch events on the parent
      , onTouchEnd: handleTouchEvent(_onMouseUp),
      onTouchStart: handleTouchEvent(_onMouseDown),
      onTouchMove: handleTouchEvent(onHover),
      onTouchCancel: handleTouchEvent(onBlur)
    },
    polygons.map(function (d, i) {
      return react.createElement('path', {
        className: 'rv-voronoi__cell ' + (d.data && d.data.className || ''),
        d: 'M' + d.join('L') + 'Z',
        onClick: function onClick() {
          return _onClick(d.data);
        },
        onMouseUp: function onMouseUp() {
          return _onMouseUp(d.data);
        },
        onMouseDown: function onMouseDown() {
          return _onMouseDown(d.data);
        },
        onMouseOver: function onMouseOver() {
          return onHover(d.data);
        },
        onMouseOut: function onMouseOut() {
          return onBlur(d.data);
        },
        fill: 'none',
        style: _extends$O({
          pointerEvents: 'all'
        }, polygonStyle, d.data && d.data.style),
        key: i
      });
    })
  );
}

Voronoi.requiresSVG = true;
Voronoi.displayName = 'Voronoi';
Voronoi.defaultProps = {
  className: '',
  onBlur: NOOP,
  onClick: NOOP,
  onHover: NOOP,
  onMouseDown: NOOP,
  onMouseUp: NOOP
};

Voronoi.propTypes = {
  className: propTypes.string,
  extent: propTypes.arrayOf(propTypes.arrayOf(propTypes.number)),
  nodes: propTypes.arrayOf(propTypes.object).isRequired,
  onBlur: propTypes.func,
  onClick: propTypes.func,
  onHover: propTypes.func,
  onMouseDown: propTypes.func,
  onMouseUp: propTypes.func,
  x: propTypes.func,
  y: propTypes.func
};

var _extends$P = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$D = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$D(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$D(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$D(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getLocs(evt) {
  var xLoc = evt.type === 'touchstart' ? evt.pageX : evt.offsetX;
  var yLoc = evt.type === 'touchstart' ? evt.pageY : evt.offsetY;
  return { xLoc: xLoc, yLoc: yLoc };
}

var Highlight = function (_AbstractSeries) {
  _inherits$D(Highlight, _AbstractSeries);

  function Highlight() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck$D(this, Highlight);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn$D(this, (_ref = Highlight.__proto__ || Object.getPrototypeOf(Highlight)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      dragging: false,
      brushArea: { top: 0, right: 0, bottom: 0, left: 0 },
      brushing: false,
      startLocX: 0,
      startLocY: 0,
      dragArea: null
    }, _temp), _possibleConstructorReturn$D(_this, _ret);
  }

  _createClass$D(Highlight, [{
    key: '_getDrawArea',
    value: function _getDrawArea(xLoc, yLoc) {
      var _state = this.state,
          startLocX = _state.startLocX,
          startLocY = _state.startLocY;
      var _props = this.props,
          enableX = _props.enableX,
          enableY = _props.enableY,
          highlightWidth = _props.highlightWidth,
          highlightHeight = _props.highlightHeight,
          innerWidth = _props.innerWidth,
          innerHeight = _props.innerHeight,
          marginLeft = _props.marginLeft,
          marginRight = _props.marginRight,
          marginBottom = _props.marginBottom,
          marginTop = _props.marginTop;

      var plotHeight = innerHeight + marginTop + marginBottom;
      var plotWidth = innerWidth + marginLeft + marginRight;
      var touchWidth = highlightWidth || plotWidth;
      var touchHeight = highlightHeight || plotHeight;

      return {
        bottom: enableY ? Math.max(startLocY, yLoc) : touchHeight,
        right: enableX ? Math.max(startLocX, xLoc) : touchWidth,
        left: enableX ? Math.min(xLoc, startLocX) : 0,
        top: enableY ? Math.min(yLoc, startLocY) : 0
      };
    }
  }, {
    key: '_getDragArea',
    value: function _getDragArea(xLoc, yLoc) {
      var _props2 = this.props,
          enableX = _props2.enableX,
          enableY = _props2.enableY;
      var _state2 = this.state,
          startLocX = _state2.startLocX,
          startLocY = _state2.startLocY,
          dragArea = _state2.dragArea;


      return {
        bottom: dragArea.bottom + (enableY ? yLoc - startLocY : 0),
        left: dragArea.left + (enableX ? xLoc - startLocX : 0),
        right: dragArea.right + (enableX ? xLoc - startLocX : 0),
        top: dragArea.top + (enableY ? yLoc - startLocY : 0)
      };
    }
  }, {
    key: '_clickedOutsideDrag',
    value: function _clickedOutsideDrag(xLoc, yLoc) {
      var _props3 = this.props,
          enableX = _props3.enableX,
          enableY = _props3.enableY;
      var _state3 = this.state,
          dragArea = _state3.dragArea,
          _state3$brushArea = _state3.brushArea,
          left = _state3$brushArea.left,
          right = _state3$brushArea.right,
          top = _state3$brushArea.top,
          bottom = _state3$brushArea.bottom;

      var clickedOutsideDragX = dragArea && (xLoc < left || xLoc > right);
      var clickedOutsideDragY = dragArea && (yLoc < top || yLoc > bottom);
      if (enableX && enableY) {
        return clickedOutsideDragX || clickedOutsideDragY;
      }
      if (enableX) {
        return clickedOutsideDragX;
      }
      if (enableY) {
        return clickedOutsideDragY;
      }
      return true;
    }
  }, {
    key: '_convertAreaToCoordinates',
    value: function _convertAreaToCoordinates(brushArea) {
      // NOTE only continuous scales are supported for brushing/getting coordinates back
      var _props4 = this.props,
          enableX = _props4.enableX,
          enableY = _props4.enableY,
          marginLeft = _props4.marginLeft,
          marginTop = _props4.marginTop;

      var xScale = getAttributeScale(this.props, 'x');
      var yScale = getAttributeScale(this.props, 'y');

      // Ensure that users wishes are being respected about which scales are evaluated
      // this is specifically enabled to ensure brushing on mixed categorical and linear
      // charts will run as expected

      if (enableX && enableY) {
        return {
          bottom: yScale.invert(brushArea.bottom),
          left: xScale.invert(brushArea.left - marginLeft),
          right: xScale.invert(brushArea.right - marginLeft),
          top: yScale.invert(brushArea.top)
        };
      }

      if (enableY) {
        return {
          bottom: yScale.invert(brushArea.bottom - marginTop),
          top: yScale.invert(brushArea.top - marginTop)
        };
      }

      if (enableX) {
        return {
          left: xScale.invert(brushArea.left - marginLeft),
          right: xScale.invert(brushArea.right - marginLeft)
        };
      }

      return {};
    }
  }, {
    key: 'startBrushing',
    value: function startBrushing(e) {
      var _this2 = this;

      var _props5 = this.props,
          onBrushStart = _props5.onBrushStart,
          onDragStart = _props5.onDragStart,
          drag = _props5.drag;
      var dragArea = this.state.dragArea;

      var _getLocs = getLocs(e.nativeEvent),
          xLoc = _getLocs.xLoc,
          yLoc = _getLocs.yLoc;

      var startArea = function startArea(dragging, resetDrag) {
        var emptyBrush = {
          bottom: yLoc,
          left: xLoc,
          right: xLoc,
          top: yLoc
        };
        _this2.setState({
          dragging: dragging,
          brushArea: dragArea && !resetDrag ? dragArea : emptyBrush,
          brushing: !dragging,
          startLocX: xLoc,
          startLocY: yLoc
        });
      };

      var clickedOutsideDrag = this._clickedOutsideDrag(xLoc, yLoc);
      if (drag && !dragArea || !drag || clickedOutsideDrag) {
        startArea(false, clickedOutsideDrag);

        if (onBrushStart) {
          onBrushStart(e);
        }
        return;
      }

      if (drag && dragArea) {
        startArea(true, clickedOutsideDrag);
        if (onDragStart) {
          onDragStart(e);
        }
      }
    }
  }, {
    key: 'stopBrushing',
    value: function stopBrushing(e) {
      var _state4 = this.state,
          brushing = _state4.brushing,
          dragging = _state4.dragging,
          brushArea = _state4.brushArea;
      // Quickly short-circuit if the user isn't brushing in our component

      if (!brushing && !dragging) {
        return;
      }
      var _props6 = this.props,
          onBrushEnd = _props6.onBrushEnd,
          onDragEnd = _props6.onDragEnd,
          drag = _props6.drag;

      var noHorizontal = Math.abs(brushArea.right - brushArea.left) < 5;
      var noVertical = Math.abs(brushArea.top - brushArea.bottom) < 5;
      // Invoke the callback with null if the selected area was < 5px
      var isNulled = noVertical || noHorizontal;
      // Clear the draw area
      this.setState({
        brushing: false,
        dragging: false,
        brushArea: drag ? brushArea : { top: 0, right: 0, bottom: 0, left: 0 },
        startLocX: 0,
        startLocY: 0,
        dragArea: drag && !isNulled && brushArea
      });

      if (brushing && onBrushEnd) {
        onBrushEnd(!isNulled ? this._convertAreaToCoordinates(brushArea) : null);
      }

      if (drag && onDragEnd) {
        onDragEnd(!isNulled ? this._convertAreaToCoordinates(brushArea) : null);
      }
    }
  }, {
    key: 'onBrush',
    value: function onBrush(e) {
      var _props7 = this.props,
          onBrush = _props7.onBrush,
          onDrag = _props7.onDrag,
          drag = _props7.drag;
      var _state5 = this.state,
          brushing = _state5.brushing,
          dragging = _state5.dragging;

      var _getLocs2 = getLocs(e.nativeEvent),
          xLoc = _getLocs2.xLoc,
          yLoc = _getLocs2.yLoc;

      if (brushing) {
        var brushArea = this._getDrawArea(xLoc, yLoc);
        this.setState({ brushArea: brushArea });

        if (onBrush) {
          onBrush(this._convertAreaToCoordinates(brushArea));
        }
      }

      if (drag && dragging) {
        var _brushArea = this._getDragArea(xLoc, yLoc);
        this.setState({ brushArea: _brushArea });
        if (onDrag) {
          onDrag(this._convertAreaToCoordinates(_brushArea));
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props8 = this.props,
          color = _props8.color,
          className = _props8.className,
          highlightHeight = _props8.highlightHeight,
          highlightWidth = _props8.highlightWidth,
          highlightX = _props8.highlightX,
          highlightY = _props8.highlightY,
          innerWidth = _props8.innerWidth,
          innerHeight = _props8.innerHeight,
          marginLeft = _props8.marginLeft,
          marginRight = _props8.marginRight,
          marginTop = _props8.marginTop,
          marginBottom = _props8.marginBottom,
          opacity = _props8.opacity;
      var _state$brushArea = this.state.brushArea,
          left = _state$brushArea.left,
          right = _state$brushArea.right,
          top = _state$brushArea.top,
          bottom = _state$brushArea.bottom;


      var leftPos = 0;
      if (highlightX) {
        var xScale = getAttributeScale(this.props, 'x');
        leftPos = xScale(highlightX);
      }

      var topPos = 0;
      if (highlightY) {
        var yScale = getAttributeScale(this.props, 'y');
        topPos = yScale(highlightY);
      }

      var plotWidth = marginLeft + marginRight + innerWidth;
      var plotHeight = marginTop + marginBottom + innerHeight;
      var touchWidth = highlightWidth || plotWidth;
      var touchHeight = highlightHeight || plotHeight;

      return react.createElement(
        'g',
        {
          transform: 'translate(' + leftPos + ', ' + topPos + ')',
          className: className + ' rv-highlight-container'
        },
        react.createElement('rect', {
          className: 'rv-mouse-target',
          fill: 'black',
          opacity: '0',
          x: '0',
          y: '0',
          width: Math.max(touchWidth, 0),
          height: Math.max(touchHeight, 0),
          onMouseDown: function onMouseDown(e) {
            return _this3.startBrushing(e);
          },
          onMouseMove: function onMouseMove(e) {
            return _this3.onBrush(e);
          },
          onMouseUp: function onMouseUp(e) {
            return _this3.stopBrushing(e);
          },
          onMouseLeave: function onMouseLeave(e) {
            return _this3.stopBrushing(e);
          }
          // preventDefault() so that mouse event emulation does not happen
          , onTouchEnd: function onTouchEnd(e) {
            e.preventDefault();
            _this3.stopBrushing(e);
          },
          onTouchCancel: function onTouchCancel(e) {
            e.preventDefault();
            _this3.stopBrushing(e);
          },
          onContextMenu: function onContextMenu(e) {
            return e.preventDefault();
          },
          onContextMenuCapture: function onContextMenuCapture(e) {
            return e.preventDefault();
          }
        }),
        react.createElement('rect', {
          className: 'rv-highlight',
          pointerEvents: 'none',
          opacity: opacity,
          fill: color,
          x: left,
          y: top,
          width: Math.min(Math.max(0, right - left), touchWidth),
          height: Math.min(Math.max(0, bottom - top), touchHeight)
        })
      );
    }
  }]);

  return Highlight;
}(AbstractSeries);

Highlight.displayName = 'HighlightOverlay';
Highlight.defaultProps = {
  color: 'rgb(77, 182, 172)',
  className: '',
  enableX: true,
  enableY: true,
  opacity: 0.3
};

Highlight.propTypes = _extends$P({}, AbstractSeries.propTypes, {
  enableX: propTypes.bool,
  enableY: propTypes.bool,
  highlightHeight: propTypes.number,
  highlightWidth: propTypes.number,
  highlightX: propTypes.oneOfType([propTypes.string, propTypes.number]),
  highlightY: propTypes.oneOfType([propTypes.string, propTypes.number]),
  onBrushStart: propTypes.func,
  onDragStart: propTypes.func,
  onBrush: propTypes.func,
  onDrag: propTypes.func,
  onBrushEnd: propTypes.func,
  onDragEnd: propTypes.func
});

var _extends$Q = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var STROKE_STYLES$1 = {
  dashed: '6, 2',
  solid: null
};

function DiscreteColorLegendItem(_ref) {
  var color = _ref.color,
      strokeDasharray = _ref.strokeDasharray,
      strokeStyle = _ref.strokeStyle,
      strokeWidth = _ref.strokeWidth,
      disabled = _ref.disabled,
      onClick = _ref.onClick,
      orientation = _ref.orientation,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      title = _ref.title;

  var className = 'rv-discrete-color-legend-item ' + orientation;
  if (disabled) {
    className += ' disabled';
  }
  if (onClick) {
    className += ' clickable';
  }
  var strokeDasharrayStyle = STROKE_STYLES$1[strokeStyle] || strokeDasharray;
  return react.createElement(
    'div',
    { className: className, onClick: onClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
    react.createElement(
      'svg',
      { className: 'rv-discrete-color-legend-item__color', height: 2, width: 14 },
      react.createElement('path', {
        className: 'rv-discrete-color-legend-item__color__path',
        d: 'M 0, 1 L 14, 1',
        style: _extends$Q({}, strokeWidth ? { strokeWidth: strokeWidth } : {}, strokeDasharrayStyle ? { strokeDasharray: strokeDasharrayStyle } : {}, {
          stroke: disabled ? null : color
        })

      })
    ),
    react.createElement(
      'span',
      { className: 'rv-discrete-color-legend-item__title' },
      title
    )
  );
}

DiscreteColorLegendItem.propTypes = {
  color: propTypes.string.isRequired,
  disabled: propTypes.bool,
  title: propTypes.oneOfType([propTypes.string, propTypes.element]).isRequired,
  onClick: propTypes.func,
  onMouseEnter: propTypes.func,
  onMouseLeave: propTypes.func,
  orientation: propTypes.oneOf(['vertical', 'horizontal']).isRequired,
  strokeDasharray: propTypes.string,
  strokeWidth: propTypes.number,
  strokeStyle: propTypes.oneOf(Object.keys(STROKE_STYLES$1))
};
DiscreteColorLegendItem.defaultProps = {
  disabled: false,
  strokeStyle: 'solid'
};
DiscreteColorLegendItem.displayName = 'DiscreteColorLegendItem';

var _extends$R = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function DiscreteColorLegend(_ref) {
  var className = _ref.className,
      colors = _ref.colors,
      height = _ref.height,
      items = _ref.items,
      onItemClick = _ref.onItemClick,
      onItemMouseEnter = _ref.onItemMouseEnter,
      onItemMouseLeave = _ref.onItemMouseLeave,
      orientation = _ref.orientation,
      style = _ref.style,
      width = _ref.width;

  return react.createElement(
    'div',
    {
      className: 'rv-discrete-color-legend ' + orientation + ' ' + className,
      style: _extends$R({ width: width, height: height }, style)
    },
    items.map(function (item, i) {
      return react.createElement(DiscreteColorLegendItem, {
        title: item.title ? item.title : item,
        color: item.color ? item.color : colors[i % colors.length],
        strokeDasharray: item.strokeDasharray,
        strokeStyle: item.strokeStyle,
        strokeWidth: item.strokeWidth,
        disabled: Boolean(item.disabled),
        orientation: orientation,
        key: i,
        onClick: onItemClick ? function (e) {
          return onItemClick(item, i, e);
        } : null,
        onMouseEnter: onItemMouseEnter ? function (e) {
          return onItemMouseEnter(item, i, e);
        } : null,
        onMouseLeave: onItemMouseEnter ? function (e) {
          return onItemMouseLeave(item, i, e);
        } : null
      });
    })
  );
}

DiscreteColorLegend.displayName = 'DiscreteColorLegendItem';
DiscreteColorLegend.propTypes = {
  className: propTypes.string,
  items: propTypes.arrayOf(propTypes.oneOfType([propTypes.shape({
    title: propTypes.string.isRequired,
    color: propTypes.string,
    disabled: propTypes.bool
  }), propTypes.string.isRequired, propTypes.element])).isRequired,
  onItemClick: propTypes.func,
  onItemMouseEnter: propTypes.func,
  onItemMouseLeave: propTypes.func,
  height: propTypes.number,
  width: propTypes.number,
  orientation: propTypes.oneOf(['vertical', 'horizontal'])
};

DiscreteColorLegend.defaultProps = {
  className: '',
  colors: DISCRETE_COLOR_RANGE,
  orientation: 'vertical'
};

var _extends$S = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var propTypes$e = _extends$S({}, DiscreteColorLegend.propTypes, {
  searchText: propTypes.string,
  onSearchChange: propTypes.func,
  searchPlaceholder: propTypes.string,
  searchFn: propTypes.func
});

// Copyright (c) 2016 - 2017 Uber Technologies, Inc.

var propTypes$f = {
  className: propTypes.string,
  height: propTypes.number,
  endColor: propTypes.string,
  endTitle: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
  midColor: propTypes.string,
  midTitle: propTypes.oneOfType([propTypes.number, propTypes.string]),
  startColor: propTypes.string,
  startTitle: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
  width: propTypes.number
};

// Copyright (c) 2016 - 2017 Uber Technologies, Inc.

var propTypes$g = {
  className: propTypes.string,
  circlesTotal: propTypes.number,
  endSize: propTypes.number,
  endTitle: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
  height: propTypes.number,
  startSize: propTypes.number,
  startTitle: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
  width: propTypes.number
};

function count(node) {
  var sum = 0,
      children = node.children,
      i = children && children.length;
  if (!i) sum = 1;
  else while (--i >= 0) sum += children[i].value;
  node.value = sum;
}

function node_count() {
  return this.eachAfter(count);
}

function node_each(callback) {
  var node = this, current, next = [node], children, i, n;
  do {
    current = next.reverse(), next = [];
    while (node = current.pop()) {
      callback(node), children = node.children;
      if (children) for (i = 0, n = children.length; i < n; ++i) {
        next.push(children[i]);
      }
    }
  } while (next.length);
  return this;
}

function node_eachBefore(callback) {
  var node = this, nodes = [node], children, i;
  while (node = nodes.pop()) {
    callback(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }
  return this;
}

function node_eachAfter(callback) {
  var node = this, nodes = [node], next = [], children, i, n;
  while (node = nodes.pop()) {
    next.push(node), children = node.children;
    if (children) for (i = 0, n = children.length; i < n; ++i) {
      nodes.push(children[i]);
    }
  }
  while (node = next.pop()) {
    callback(node);
  }
  return this;
}

function node_sum(value) {
  return this.eachAfter(function(node) {
    var sum = +value(node.data) || 0,
        children = node.children,
        i = children && children.length;
    while (--i >= 0) sum += children[i].value;
    node.value = sum;
  });
}

function node_sort(compare) {
  return this.eachBefore(function(node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
}

function node_path(end) {
  var start = this,
      ancestor = leastCommonAncestor(start, end),
      nodes = [start];
  while (start !== ancestor) {
    start = start.parent;
    nodes.push(start);
  }
  var k = nodes.length;
  while (end !== ancestor) {
    nodes.splice(k, 0, end);
    end = end.parent;
  }
  return nodes;
}

function leastCommonAncestor(a, b) {
  if (a === b) return a;
  var aNodes = a.ancestors(),
      bNodes = b.ancestors(),
      c = null;
  a = aNodes.pop();
  b = bNodes.pop();
  while (a === b) {
    c = a;
    a = aNodes.pop();
    b = bNodes.pop();
  }
  return c;
}

function node_ancestors() {
  var node = this, nodes = [node];
  while (node = node.parent) {
    nodes.push(node);
  }
  return nodes;
}

function node_descendants() {
  var nodes = [];
  this.each(function(node) {
    nodes.push(node);
  });
  return nodes;
}

function node_leaves() {
  var leaves = [];
  this.eachBefore(function(node) {
    if (!node.children) {
      leaves.push(node);
    }
  });
  return leaves;
}

function node_links() {
  var root = this, links = [];
  root.each(function(node) {
    if (node !== root) { // Don’t include the root’s parent, if any.
      links.push({source: node.parent, target: node});
    }
  });
  return links;
}

function hierarchy(data, children) {
  var root = new Node(data),
      valued = +data.value && (root.value = data.value),
      node,
      nodes = [root],
      child,
      childs,
      i,
      n;

  if (children == null) children = defaultChildren;

  while (node = nodes.pop()) {
    if (valued) node.value = +node.data.value;
    if ((childs = children(node.data)) && (n = childs.length)) {
      node.children = new Array(n);
      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new Node(childs[i]));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }

  return root.eachBefore(computeHeight);
}

function node_copy() {
  return hierarchy(this).eachBefore(copyData);
}

function defaultChildren(d) {
  return d.children;
}

function copyData(node) {
  node.data = node.data.data;
}

function computeHeight(node) {
  var height = 0;
  do node.height = height;
  while ((node = node.parent) && (node.height < ++height));
}

function Node(data) {
  this.data = data;
  this.depth =
  this.height = 0;
  this.parent = null;
}

Node.prototype = hierarchy.prototype = {
  constructor: Node,
  count: node_count,
  each: node_each,
  eachAfter: node_eachAfter,
  eachBefore: node_eachBefore,
  sum: node_sum,
  sort: node_sort,
  path: node_path,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  links: node_links,
  copy: node_copy
};

var slice$4 = Array.prototype.slice;

function shuffle$1(array) {
  var m = array.length,
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function enclose(circles) {
  var i = 0, n = (circles = shuffle$1(slice$4.call(circles))).length, B = [], p, e;

  while (i < n) {
    p = circles[i];
    if (e && enclosesWeak(e, p)) ++i;
    else e = encloseBasis(B = extendBasis(B, p)), i = 0;
  }

  return e;
}

function extendBasis(B, p) {
  var i, j;

  if (enclosesWeakAll(p, B)) return [p];

  // If we get here then B must have at least one element.
  for (i = 0; i < B.length; ++i) {
    if (enclosesNot(p, B[i])
        && enclosesWeakAll(encloseBasis2(B[i], p), B)) {
      return [B[i], p];
    }
  }

  // If we get here then B must have at least two elements.
  for (i = 0; i < B.length - 1; ++i) {
    for (j = i + 1; j < B.length; ++j) {
      if (enclosesNot(encloseBasis2(B[i], B[j]), p)
          && enclosesNot(encloseBasis2(B[i], p), B[j])
          && enclosesNot(encloseBasis2(B[j], p), B[i])
          && enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)) {
        return [B[i], B[j], p];
      }
    }
  }

  // If we get here then something is very wrong.
  throw new Error;
}

function enclosesNot(a, b) {
  var dr = a.r - b.r, dx = b.x - a.x, dy = b.y - a.y;
  return dr < 0 || dr * dr < dx * dx + dy * dy;
}

function enclosesWeak(a, b) {
  var dr = a.r - b.r + 1e-6, dx = b.x - a.x, dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function enclosesWeakAll(a, B) {
  for (var i = 0; i < B.length; ++i) {
    if (!enclosesWeak(a, B[i])) {
      return false;
    }
  }
  return true;
}

function encloseBasis(B) {
  switch (B.length) {
    case 1: return encloseBasis1(B[0]);
    case 2: return encloseBasis2(B[0], B[1]);
    case 3: return encloseBasis3(B[0], B[1], B[2]);
  }
}

function encloseBasis1(a) {
  return {
    x: a.x,
    y: a.y,
    r: a.r
  };
}

function encloseBasis2(a, b) {
  var x1 = a.x, y1 = a.y, r1 = a.r,
      x2 = b.x, y2 = b.y, r2 = b.r,
      x21 = x2 - x1, y21 = y2 - y1, r21 = r2 - r1,
      l = Math.sqrt(x21 * x21 + y21 * y21);
  return {
    x: (x1 + x2 + x21 / l * r21) / 2,
    y: (y1 + y2 + y21 / l * r21) / 2,
    r: (l + r1 + r2) / 2
  };
}

function encloseBasis3(a, b, c) {
  var x1 = a.x, y1 = a.y, r1 = a.r,
      x2 = b.x, y2 = b.y, r2 = b.r,
      x3 = c.x, y3 = c.y, r3 = c.r,
      a2 = x1 - x2,
      a3 = x1 - x3,
      b2 = y1 - y2,
      b3 = y1 - y3,
      c2 = r2 - r1,
      c3 = r3 - r1,
      d1 = x1 * x1 + y1 * y1 - r1 * r1,
      d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2,
      d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3,
      ab = a3 * b2 - a2 * b3,
      xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1,
      xb = (b3 * c2 - b2 * c3) / ab,
      ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1,
      yb = (a2 * c3 - a3 * c2) / ab,
      A = xb * xb + yb * yb - 1,
      B = 2 * (r1 + xa * xb + ya * yb),
      C = xa * xa + ya * ya - r1 * r1,
      r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
  return {
    x: x1 + xa + xb * r,
    y: y1 + ya + yb * r,
    r: r
  };
}

function place(b, a, c) {
  var dx = b.x - a.x, x, a2,
      dy = b.y - a.y, y, b2,
      d2 = dx * dx + dy * dy;
  if (d2) {
    a2 = a.r + c.r, a2 *= a2;
    b2 = b.r + c.r, b2 *= b2;
    if (a2 > b2) {
      x = (d2 + b2 - a2) / (2 * d2);
      y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
      c.x = b.x - x * dx - y * dy;
      c.y = b.y - x * dy + y * dx;
    } else {
      x = (d2 + a2 - b2) / (2 * d2);
      y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
      c.x = a.x + x * dx - y * dy;
      c.y = a.y + x * dy + y * dx;
    }
  } else {
    c.x = a.x + c.r;
    c.y = a.y;
  }
}

function intersects(a, b) {
  var dr = a.r + b.r - 1e-6, dx = b.x - a.x, dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function score(node) {
  var a = node._,
      b = node.next._,
      ab = a.r + b.r,
      dx = (a.x * b.r + b.x * a.r) / ab,
      dy = (a.y * b.r + b.y * a.r) / ab;
  return dx * dx + dy * dy;
}

function Node$1(circle) {
  this._ = circle;
  this.next = null;
  this.previous = null;
}

function packEnclose(circles) {
  if (!(n = circles.length)) return 0;

  var a, b, c, n, aa, ca, i, j, k, sj, sk;

  // Place the first circle.
  a = circles[0], a.x = 0, a.y = 0;
  if (!(n > 1)) return a.r;

  // Place the second circle.
  b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0;
  if (!(n > 2)) return a.r + b.r;

  // Place the third circle.
  place(b, a, c = circles[2]);

  // Initialize the front-chain using the first three circles a, b and c.
  a = new Node$1(a), b = new Node$1(b), c = new Node$1(c);
  a.next = c.previous = b;
  b.next = a.previous = c;
  c.next = b.previous = a;

  // Attempt to place each remaining circle…
  pack: for (i = 3; i < n; ++i) {
    place(a._, b._, c = circles[i]), c = new Node$1(c);

    // Find the closest intersecting circle on the front-chain, if any.
    // “Closeness” is determined by linear distance along the front-chain.
    // “Ahead” or “behind” is likewise determined by linear distance.
    j = b.next, k = a.previous, sj = b._.r, sk = a._.r;
    do {
      if (sj <= sk) {
        if (intersects(j._, c._)) {
          b = j, a.next = b, b.previous = a, --i;
          continue pack;
        }
        sj += j._.r, j = j.next;
      } else {
        if (intersects(k._, c._)) {
          a = k, a.next = b, b.previous = a, --i;
          continue pack;
        }
        sk += k._.r, k = k.previous;
      }
    } while (j !== k.next);

    // Success! Insert the new circle c between a and b.
    c.previous = a, c.next = b, a.next = b.previous = b = c;

    // Compute the new closest circle pair to the centroid.
    aa = score(a);
    while ((c = c.next) !== b) {
      if ((ca = score(c)) < aa) {
        a = c, aa = ca;
      }
    }
    b = a.next;
  }

  // Compute the enclosing circle of the front chain.
  a = [b._], c = b; while ((c = c.next) !== b) a.push(c._); c = enclose(a);

  // Translate the circles to put the enclosing circle around the origin.
  for (i = 0; i < n; ++i) a = circles[i], a.x -= c.x, a.y -= c.y;

  return c.r;
}

function optional(f) {
  return f == null ? null : required(f);
}

function required(f) {
  if (typeof f !== "function") throw new Error;
  return f;
}

function constantZero() {
  return 0;
}

function constant$7(x) {
  return function() {
    return x;
  };
}

function defaultRadius(d) {
  return Math.sqrt(d.value);
}

function pack$1() {
  var radius = null,
      dx = 1,
      dy = 1,
      padding = constantZero;

  function pack(root) {
    root.x = dx / 2, root.y = dy / 2;
    if (radius) {
      root.eachBefore(radiusLeaf(radius))
          .eachAfter(packChildren(padding, 0.5))
          .eachBefore(translateChild(1));
    } else {
      root.eachBefore(radiusLeaf(defaultRadius))
          .eachAfter(packChildren(constantZero, 1))
          .eachAfter(packChildren(padding, root.r / Math.min(dx, dy)))
          .eachBefore(translateChild(Math.min(dx, dy) / (2 * root.r)));
    }
    return root;
  }

  pack.radius = function(x) {
    return arguments.length ? (radius = optional(x), pack) : radius;
  };

  pack.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
  };

  pack.padding = function(x) {
    return arguments.length ? (padding = typeof x === "function" ? x : constant$7(+x), pack) : padding;
  };

  return pack;
}

function radiusLeaf(radius) {
  return function(node) {
    if (!node.children) {
      node.r = Math.max(0, +radius(node) || 0);
    }
  };
}

function packChildren(padding, k) {
  return function(node) {
    if (children = node.children) {
      var children,
          i,
          n = children.length,
          r = padding(node) * k || 0,
          e;

      if (r) for (i = 0; i < n; ++i) children[i].r += r;
      e = packEnclose(children);
      if (r) for (i = 0; i < n; ++i) children[i].r -= r;
      node.r = e + r;
    }
  };
}

function translateChild(k) {
  return function(node) {
    var parent = node.parent;
    node.r *= k;
    if (parent) {
      node.x = parent.x + k * node.x;
      node.y = parent.y + k * node.y;
    }
  };
}

function roundNode(node) {
  node.x0 = Math.round(node.x0);
  node.y0 = Math.round(node.y0);
  node.x1 = Math.round(node.x1);
  node.y1 = Math.round(node.y1);
}

function treemapDice(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      k = parent.value && (x1 - x0) / parent.value;

  while (++i < n) {
    node = nodes[i], node.y0 = y0, node.y1 = y1;
    node.x0 = x0, node.x1 = x0 += node.value * k;
  }
}

function partition() {
  var dx = 1,
      dy = 1,
      padding = 0,
      round = false;

  function partition(root) {
    var n = root.height + 1;
    root.x0 =
    root.y0 = padding;
    root.x1 = dx;
    root.y1 = dy / n;
    root.eachBefore(positionNode(dy, n));
    if (round) root.eachBefore(roundNode);
    return root;
  }

  function positionNode(dy, n) {
    return function(node) {
      if (node.children) {
        treemapDice(node, node.x0, dy * (node.depth + 1) / n, node.x1, dy * (node.depth + 2) / n);
      }
      var x0 = node.x0,
          y0 = node.y0,
          x1 = node.x1 - padding,
          y1 = node.y1 - padding;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      node.x0 = x0;
      node.y0 = y0;
      node.x1 = x1;
      node.y1 = y1;
    };
  }

  partition.round = function(x) {
    return arguments.length ? (round = !!x, partition) : round;
  };

  partition.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [dx, dy];
  };

  partition.padding = function(x) {
    return arguments.length ? (padding = +x, partition) : padding;
  };

  return partition;
}

function treemapSlice(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      k = parent.value && (y1 - y0) / parent.value;

  while (++i < n) {
    node = nodes[i], node.x0 = x0, node.x1 = x1;
    node.y0 = y0, node.y1 = y0 += node.value * k;
  }
}

var phi = (1 + Math.sqrt(5)) / 2;

function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
  var rows = [],
      nodes = parent.children,
      row,
      nodeValue,
      i0 = 0,
      i1 = 0,
      n = nodes.length,
      dx, dy,
      value = parent.value,
      sumValue,
      minValue,
      maxValue,
      newRatio,
      minRatio,
      alpha,
      beta;

  while (i0 < n) {
    dx = x1 - x0, dy = y1 - y0;

    // Find the next non-empty node.
    do sumValue = nodes[i1++].value; while (!sumValue && i1 < n);
    minValue = maxValue = sumValue;
    alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
    beta = sumValue * sumValue * alpha;
    minRatio = Math.max(maxValue / beta, beta / minValue);

    // Keep adding nodes while the aspect ratio maintains or improves.
    for (; i1 < n; ++i1) {
      sumValue += nodeValue = nodes[i1].value;
      if (nodeValue < minValue) minValue = nodeValue;
      if (nodeValue > maxValue) maxValue = nodeValue;
      beta = sumValue * sumValue * alpha;
      newRatio = Math.max(maxValue / beta, beta / minValue);
      if (newRatio > minRatio) { sumValue -= nodeValue; break; }
      minRatio = newRatio;
    }

    // Position and record the row orientation.
    rows.push(row = {value: sumValue, dice: dx < dy, children: nodes.slice(i0, i1)});
    if (row.dice) treemapDice(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);
    else treemapSlice(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
    value -= sumValue, i0 = i1;
  }

  return rows;
}

var squarify = (function custom(ratio) {

  function squarify(parent, x0, y0, x1, y1) {
    squarifyRatio(ratio, parent, x0, y0, x1, y1);
  }

  squarify.ratio = function(x) {
    return custom((x = +x) > 1 ? x : 1);
  };

  return squarify;
})(phi);

function treemap() {
  var tile = squarify,
      round = false,
      dx = 1,
      dy = 1,
      paddingStack = [0],
      paddingInner = constantZero,
      paddingTop = constantZero,
      paddingRight = constantZero,
      paddingBottom = constantZero,
      paddingLeft = constantZero;

  function treemap(root) {
    root.x0 =
    root.y0 = 0;
    root.x1 = dx;
    root.y1 = dy;
    root.eachBefore(positionNode);
    paddingStack = [0];
    if (round) root.eachBefore(roundNode);
    return root;
  }

  function positionNode(node) {
    var p = paddingStack[node.depth],
        x0 = node.x0 + p,
        y0 = node.y0 + p,
        x1 = node.x1 - p,
        y1 = node.y1 - p;
    if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
    if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
    node.x0 = x0;
    node.y0 = y0;
    node.x1 = x1;
    node.y1 = y1;
    if (node.children) {
      p = paddingStack[node.depth + 1] = paddingInner(node) / 2;
      x0 += paddingLeft(node) - p;
      y0 += paddingTop(node) - p;
      x1 -= paddingRight(node) - p;
      y1 -= paddingBottom(node) - p;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      tile(node, x0, y0, x1, y1);
    }
  }

  treemap.round = function(x) {
    return arguments.length ? (round = !!x, treemap) : round;
  };

  treemap.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
  };

  treemap.tile = function(x) {
    return arguments.length ? (tile = required(x), treemap) : tile;
  };

  treemap.padding = function(x) {
    return arguments.length ? treemap.paddingInner(x).paddingOuter(x) : treemap.paddingInner();
  };

  treemap.paddingInner = function(x) {
    return arguments.length ? (paddingInner = typeof x === "function" ? x : constant$7(+x), treemap) : paddingInner;
  };

  treemap.paddingOuter = function(x) {
    return arguments.length ? treemap.paddingTop(x).paddingRight(x).paddingBottom(x).paddingLeft(x) : treemap.paddingTop();
  };

  treemap.paddingTop = function(x) {
    return arguments.length ? (paddingTop = typeof x === "function" ? x : constant$7(+x), treemap) : paddingTop;
  };

  treemap.paddingRight = function(x) {
    return arguments.length ? (paddingRight = typeof x === "function" ? x : constant$7(+x), treemap) : paddingRight;
  };

  treemap.paddingBottom = function(x) {
    return arguments.length ? (paddingBottom = typeof x === "function" ? x : constant$7(+x), treemap) : paddingBottom;
  };

  treemap.paddingLeft = function(x) {
    return arguments.length ? (paddingLeft = typeof x === "function" ? x : constant$7(+x), treemap) : paddingLeft;
  };

  return treemap;
}

function treemapBinary(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      i, n = nodes.length,
      sum, sums = new Array(n + 1);

  for (sums[0] = sum = i = 0; i < n; ++i) {
    sums[i + 1] = sum += nodes[i].value;
  }

  partition(0, n, parent.value, x0, y0, x1, y1);

  function partition(i, j, value, x0, y0, x1, y1) {
    if (i >= j - 1) {
      var node = nodes[i];
      node.x0 = x0, node.y0 = y0;
      node.x1 = x1, node.y1 = y1;
      return;
    }

    var valueOffset = sums[i],
        valueTarget = (value / 2) + valueOffset,
        k = i + 1,
        hi = j - 1;

    while (k < hi) {
      var mid = k + hi >>> 1;
      if (sums[mid] < valueTarget) k = mid + 1;
      else hi = mid;
    }

    if ((valueTarget - sums[k - 1]) < (sums[k] - valueTarget) && i + 1 < k) --k;

    var valueLeft = sums[k] - valueOffset,
        valueRight = value - valueLeft;

    if ((x1 - x0) > (y1 - y0)) {
      var xk = (x0 * valueRight + x1 * valueLeft) / value;
      partition(i, k, valueLeft, x0, y0, xk, y1);
      partition(k, j, valueRight, xk, y0, x1, y1);
    } else {
      var yk = (y0 * valueRight + y1 * valueLeft) / value;
      partition(i, k, valueLeft, x0, y0, x1, yk);
      partition(k, j, valueRight, x0, yk, x1, y1);
    }
  }
}

function treemapSliceDice(parent, x0, y0, x1, y1) {
  (parent.depth & 1 ? treemapSlice : treemapDice)(parent, x0, y0, x1, y1);
}

var treemapResquarify = (function custom(ratio) {

  function resquarify(parent, x0, y0, x1, y1) {
    if ((rows = parent._squarify) && (rows.ratio === ratio)) {
      var rows,
          row,
          nodes,
          i,
          j = -1,
          n,
          m = rows.length,
          value = parent.value;

      while (++j < m) {
        row = rows[j], nodes = row.children;
        for (i = row.value = 0, n = nodes.length; i < n; ++i) row.value += nodes[i].value;
        if (row.dice) treemapDice(row, x0, y0, x1, y0 += (y1 - y0) * row.value / value);
        else treemapSlice(row, x0, y0, x0 += (x1 - x0) * row.value / value, y1);
        value -= row.value;
      }
    } else {
      parent._squarify = rows = squarifyRatio(ratio, parent, x0, y0, x1, y1);
      rows.ratio = ratio;
    }
  }

  resquarify.ratio = function(x) {
    return custom((x = +x) > 1 ? x : 1);
  };

  return resquarify;
})(phi);

var _extends$T = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ANIMATED_PROPS = ['colorRange', 'colorDomain', 'color', 'opacityRange', 'opacityDomain', 'opacity', 'x0', 'x1', 'y0', 'y1', 'r'];

function TreemapLeaf(props) {
  var animation = props.animation,
      getLabel = props.getLabel,
      mode = props.mode,
      node = props.node,
      onLeafClick = props.onLeafClick,
      onLeafMouseOver = props.onLeafMouseOver,
      onLeafMouseOut = props.onLeafMouseOut,
      r = props.r,
      scales = props.scales,
      x0 = props.x0,
      x1 = props.x1,
      y0 = props.y0,
      y1 = props.y1,
      style = props.style;


  if (animation) {
    return react.createElement(
      Animation,
      _extends$T({}, props, { animatedProps: ANIMATED_PROPS }),
      react.createElement(TreemapLeaf, _extends$T({}, props, { animation: null }))
    );
  }
  var useCirclePacking = mode === 'circlePack';
  var background = scales.color(node);
  var opacity = scales.opacity(node);
  var color = getFontColorFromBackground(background);
  var data = node.data;

  var title = getLabel(data);
  var leafStyle = _extends$T({
    top: useCirclePacking ? y0 - r : y0,
    left: useCirclePacking ? x0 - r : x0,
    width: useCirclePacking ? r * 2 : x1 - x0,
    height: useCirclePacking ? r * 2 : y1 - y0,
    background: background,
    opacity: opacity,
    color: color
  }, style, node.data.style);

  return react.createElement(
    'div',
    {
      className: 'rv-treemap__leaf ' + (useCirclePacking ? 'rv-treemap__leaf--circle' : ''),
      onMouseEnter: function onMouseEnter(event) {
        return onLeafMouseOver(node, event);
      },
      onMouseLeave: function onMouseLeave(event) {
        return onLeafMouseOut(node, event);
      },
      onClick: function onClick(event) {
        return onLeafClick(node, event);
      },
      style: leafStyle
    },
    react.createElement(
      'div',
      { className: 'rv-treemap__leaf__content' },
      title
    )
  );
}

TreemapLeaf.propTypes = {
  animation: AnimationPropType,
  height: propTypes.number.isRequired,
  mode: propTypes.string,
  node: propTypes.object.isRequired,
  onLeafClick: propTypes.func,
  onLeafMouseOver: propTypes.func,
  onLeafMouseOut: propTypes.func,
  scales: propTypes.object.isRequired,
  width: propTypes.number.isRequired,
  r: propTypes.number.isRequired,
  x0: propTypes.number.isRequired,
  x1: propTypes.number.isRequired,
  y0: propTypes.number.isRequired,
  y1: propTypes.number.isRequired
};

var _extends$U = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function TreemapDOM(props) {
  var animation = props.animation,
      className = props.className,
      height = props.height,
      hideRootNode = props.hideRootNode,
      getLabel = props.getLabel,
      mode = props.mode,
      nodes = props.nodes,
      width = props.width,
      scales = props.scales,
      style = props.style;

  var useCirclePacking = mode === 'circlePack';
  return react.createElement(
    'div',
    {
      className: 'rv-treemap ' + (useCirclePacking ? 'rv-treemap-circle-packed' : '') + ' ' + className,
      style: { height: height, width: width }
    },
    nodes.map(function (node, index) {
      // throw out the rootest node
      if (hideRootNode && !index) {
        return null;
      }

      var nodeProps = _extends$U({
        animation: animation,
        node: node,
        getLabel: getLabel
      }, props, {
        x0: useCirclePacking ? node.x : node.x0,
        x1: useCirclePacking ? node.x : node.x1,
        y0: useCirclePacking ? node.y : node.y0,
        y1: useCirclePacking ? node.y : node.y1,
        r: useCirclePacking ? node.r : 1,
        scales: scales,
        style: style
      });
      return react.createElement(TreemapLeaf, _extends$U({}, nodeProps, { key: 'leaf-' + index }));
    })
  );
}

TreemapDOM.displayName = 'TreemapDOM';

var _extends$V = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$E = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$E(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$E(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$E(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MARGIN_ADJUST = 1.2;

var TreemapSVG = function (_React$Component) {
  _inherits$E(TreemapSVG, _React$Component);

  function TreemapSVG() {
    _classCallCheck$E(this, TreemapSVG);

    return _possibleConstructorReturn$E(this, (TreemapSVG.__proto__ || Object.getPrototypeOf(TreemapSVG)).apply(this, arguments));
  }

  _createClass$E(TreemapSVG, [{
    key: 'getCircularNodes',
    value: function getCircularNodes() {
      var _props = this.props,
          animation = _props.animation,
          hideRootNode = _props.hideRootNode,
          nodes = _props.nodes,
          onLeafMouseOver = _props.onLeafMouseOver,
          onLeafMouseOut = _props.onLeafMouseOut,
          onLeafClick = _props.onLeafClick,
          scales = _props.scales,
          style = _props.style;

      var _nodes$reduce = nodes.reduce(function (acc, node, index) {
        if (!index && hideRootNode) {
          return acc;
        }
        var x = node.x,
            y = node.y,
            r = node.r;

        return {
          maxY: Math.max(y + r, acc.maxY),
          minY: Math.min(y - r, acc.minY),
          maxX: Math.max(x + MARGIN_ADJUST * r, acc.maxX),
          minX: Math.min(x - MARGIN_ADJUST * r, acc.minX),
          rows: acc.rows.concat([{
            x: x,
            y: y,
            size: r,
            color: scales.color(node)
          }])
        };
      }, {
        rows: [],
        maxY: -Infinity,
        minY: Infinity,
        maxX: -Infinity,
        minX: Infinity
      }),
          rows = _nodes$reduce.rows,
          minY = _nodes$reduce.minY,
          maxY = _nodes$reduce.maxY,
          minX = _nodes$reduce.minX,
          maxX = _nodes$reduce.maxX;

      return {
        updatedNodes: react.createElement(MarkSeries, {
          animation: animation,
          className: 'rv-treemap__leaf rv-treemap__leaf--circle',
          onSeriesMouseEnter: onLeafMouseOver,
          onSeriesMouseLeave: onLeafMouseOut,
          onSeriesClick: onLeafClick,
          data: rows,
          colorType: 'literal',
          getColor: function getColor(d) {
            return d.color;
          },
          sizeType: 'literal',
          getSize: function getSize(d) {
            return d.size;
          },
          style: style
        }),
        minY: minY,
        maxY: maxY,
        minX: minX,
        maxX: maxX
      };
    }
  }, {
    key: 'getNonCircularNodes',
    value: function getNonCircularNodes() {
      var _props2 = this.props,
          animation = _props2.animation,
          hideRootNode = _props2.hideRootNode,
          nodes = _props2.nodes,
          onLeafMouseOver = _props2.onLeafMouseOver,
          onLeafMouseOut = _props2.onLeafMouseOut,
          onLeafClick = _props2.onLeafClick,
          scales = _props2.scales,
          style = _props2.style;
      var color = scales.color;

      return nodes.reduce(function (acc, node, index) {
        if (!index && hideRootNode) {
          return acc;
        }
        var x0 = node.x0,
            x1 = node.x1,
            y1 = node.y1,
            y0 = node.y0;

        var x = x0;
        var y = y0;
        var nodeHeight = y1 - y0;
        var nodeWidth = x1 - x0;

        acc.maxY = Math.max(y + nodeHeight, acc.maxY);
        acc.minY = Math.min(y, acc.minY);
        acc.maxX = Math.max(x + nodeWidth, acc.maxX);
        acc.minX = Math.min(x, acc.minX);

        var data = [{ x: x, y: y }, { x: x, y: y + nodeHeight }, { x: x + nodeWidth, y: y + nodeHeight }, { x: x + nodeWidth, y: y }];

        acc.updatedNodes = acc.updatedNodes.concat([react.createElement(PolygonSeries, {
          animation: animation,
          className: 'rv-treemap__leaf',
          key: index,
          color: color(node),
          type: 'literal',
          onSeriesMouseEnter: onLeafMouseOver,
          onSeriesMouseLeave: onLeafMouseOut,
          onSeriesClick: onLeafClick,
          data: data,
          style: _extends$V({}, style, node.style)
        })]);
        return acc;
      }, {
        updatedNodes: [],
        maxY: -Infinity,
        minY: Infinity,
        maxX: -Infinity,
        minX: Infinity
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          className = _props3.className,
          height = _props3.height,
          mode = _props3.mode,
          nodes = _props3.nodes,
          width = _props3.width;

      var useCirclePacking = mode === 'circlePack';

      var _ref = useCirclePacking ? this.getCircularNodes() : this.getNonCircularNodes(),
          minY = _ref.minY,
          maxY = _ref.maxY,
          minX = _ref.minX,
          maxX = _ref.maxX,
          updatedNodes = _ref.updatedNodes;

      var labels = nodes.reduce(function (acc, node) {
        if (!node.data.title) {
          return acc;
        }
        return acc.concat(_extends$V({}, node.data, {
          x: node.x0 || node.x,
          y: node.y0 || node.y,
          label: '' + node.data.title
        }));
      }, []);

      return react.createElement(
        XYPlot,
        _extends$V({
          className: 'rv-treemap ' + (useCirclePacking ? 'rv-treemap-circle-packed' : '') + ' ' + className,
          width: width,
          height: height,
          yDomain: [maxY, minY],
          xDomain: [minX, maxX],
          colorType: 'literal',
          hasTreeStructure: true
        }, this.props),
        updatedNodes,
        react.createElement(LabelSeries, { data: labels })
      );
    }
  }]);

  return TreemapSVG;
}(react.Component);

TreemapSVG.displayName = 'TreemapSVG';

var _createClass$F = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends$W = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck$F(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$F(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$F(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TREEMAP_TILE_MODES = {
  squarify: squarify,
  resquarify: treemapResquarify,
  slice: treemapSlice,
  dice: treemapDice,
  slicedice: treemapSliceDice,
  binary: treemapBinary
};

var TREEMAP_LAYOUT_MODES = ['circlePack', 'partition', 'partition-pivot'];

var NOOP$1 = function NOOP(d) {
  return d;
};

var ATTRIBUTES$2 = ['opacity', 'color'];

var DEFAULT_MARGINS$1 = {
  left: 40,
  right: 10,
  top: 10,
  bottom: 40
};

/**
 * Get the map of scale functions from the given props.
 * @param {Object} props Props for the component.
 * @returns {Object} Map of scale functions.
 * @private
 */
function _getScaleFns(props) {
  var data = props.data;

  var allData = data.children || [];

  // Adding _allData property to the object to reuse the existing
  // getAttributeFunctor function.
  var compatibleProps = _extends$W({}, props, getMissingScaleProps(props, allData, ATTRIBUTES$2), {
    _allData: allData
  });
  return {
    opacity: getAttributeFunctor(compatibleProps, 'opacity'),
    color: getAttributeFunctor(compatibleProps, 'color')
  };
}

var Treemap = function (_React$Component) {
  _inherits$F(Treemap, _React$Component);

  function Treemap(props) {
    _classCallCheck$F(this, Treemap);

    var _this = _possibleConstructorReturn$F(this, (Treemap.__proto__ || Object.getPrototypeOf(Treemap)).call(this, props));

    _this.state = _extends$W({
      scales: _getScaleFns(props)
    }, getInnerDimensions(props, props.margin));
    return _this;
  }

  _createClass$F(Treemap, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      this.setState(_extends$W({
        scales: _getScaleFns(props)
      }, getInnerDimensions(props, props.margin)));
    }

    /**
     * Create the list of nodes to render.
     * @returns {Array} Array of nodes.
     * @private
     */

  }, {
    key: '_getNodesToRender',
    value: function _getNodesToRender() {
      var _state = this.state,
          innerWidth = _state.innerWidth,
          innerHeight = _state.innerHeight;
      var _props = this.props,
          data = _props.data,
          mode = _props.mode,
          padding = _props.padding,
          sortFunction = _props.sortFunction,
          getSize = _props.getSize;

      if (!data) {
        return [];
      }

      if (mode === 'partition' || mode === 'partition-pivot') {
        var partitionFunction = partition().size(mode === 'partition-pivot' ? [innerHeight, innerWidth] : [innerWidth, innerHeight]).padding(padding);
        var _structuredInput = hierarchy(data).sum(getSize).sort(function (a, b) {
          return sortFunction(a, b, getSize);
        });
        var mappedNodes = partitionFunction(_structuredInput).descendants();
        if (mode === 'partition-pivot') {
          return mappedNodes.map(function (node) {
            return _extends$W({}, node, {
              x0: node.y0,
              x1: node.y1,
              y0: node.x0,
              y1: node.x1
            });
          });
        }
        return mappedNodes;
      }
      if (mode === 'circlePack') {
        var packingFunction = pack$1().size([innerWidth, innerHeight]).padding(padding);
        var _structuredInput2 = hierarchy(data).sum(getSize).sort(function (a, b) {
          return sortFunction(a, b, getSize);
        });
        return packingFunction(_structuredInput2).descendants();
      }

      var tileFn = TREEMAP_TILE_MODES[mode];
      var treemapingFunction = treemap(tileFn).tile(tileFn).size([innerWidth, innerHeight]).padding(padding);
      var structuredInput = hierarchy(data).sum(getSize).sort(function (a, b) {
        return sortFunction(a, b, getSize);
      });
      return treemapingFunction(structuredInput).descendants();
    }
  }, {
    key: 'render',
    value: function render() {
      var renderMode = this.props.renderMode;
      var scales = this.state.scales;

      var nodes = this._getNodesToRender();
      var TreemapElement = renderMode === 'SVG' ? TreemapSVG : TreemapDOM;
      return react.createElement(TreemapElement, _extends$W({}, this.props, { nodes: nodes, scales: scales }));
    }
  }]);

  return Treemap;
}(react.Component);

Treemap.displayName = 'Treemap';
Treemap.propTypes = {
  animation: AnimationPropType,
  className: propTypes.string,
  data: propTypes.object.isRequired,
  height: propTypes.number.isRequired,
  hideRootNode: propTypes.bool,
  margin: MarginPropType,
  mode: propTypes.oneOf(Object.keys(TREEMAP_TILE_MODES).concat(TREEMAP_LAYOUT_MODES)),
  onLeafClick: propTypes.func,
  onLeafMouseOver: propTypes.func,
  onLeafMouseOut: propTypes.func,
  useCirclePacking: propTypes.bool,
  padding: propTypes.number.isRequired,
  sortFunction: propTypes.func,
  width: propTypes.number.isRequired,
  getSize: propTypes.func,
  getColor: propTypes.func
};

Treemap.defaultProps = {
  className: '',
  colorRange: CONTINUOUS_COLOR_RANGE,
  _colorValue: DEFAULT_COLOR,
  data: {
    children: []
  },
  hideRootNode: false,
  margin: DEFAULT_MARGINS$1,
  mode: 'squarify',
  onLeafClick: NOOP$1,
  onLeafMouseOver: NOOP$1,
  onLeafMouseOut: NOOP$1,
  opacityType: OPACITY_TYPE,
  _opacityValue: DEFAULT_OPACITY,
  padding: 1,
  sortFunction: function sortFunction(a, b, accessor) {
    if (!accessor) {
      return 0;
    }
    return accessor(a) - accessor(b);
  },
  getSize: function getSize(d) {
    return d.size;
  },
  getColor: function getColor(d) {
    return d.color;
  },
  getLabel: function getLabel(d) {
    return d.title;
  }
};

var _extends$X = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var predefinedClassName$g = 'rv-radial-chart';

var DEFAULT_RADIUS_MARGIN = 15;

/**
 * Create the list of wedges to render.
 * @param {Object} props
   props.data {Object} - tree structured data (each node has a name anc an array of children)
 * @returns {Array} Array of nodes.
 */
function getWedgesToRender(_ref) {
  var data = _ref.data,
      getAngle = _ref.getAngle;

  var pie$$1 = pieBuilder().sort(null).value(getAngle);
  var pieData = pie$$1(data).reverse();
  return pieData.map(function (row, index) {
    return _extends$X({}, row.data, {
      angle0: row.startAngle,
      angle: row.endAngle,
      radius0: row.data.innerRadius || 0,
      radius: row.data.radius || 1,
      color: row.data.color || index
    });
  });
}

function generateLabels(mappedData, accessors) {
  var labelsRadiusMultiplier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.1;
  var getLabel = accessors.getLabel,
      getSubLabel = accessors.getSubLabel;

  return mappedData.reduce(function (res, row) {
    var angle = row.angle,
        angle0 = row.angle0,
        radius = row.radius;

    var centeredAngle = (angle + angle0) / 2;

    // unfortunate, but true fact: d3 starts its radians at 12 oclock rather than 3
    // and move clockwise rather than counter clockwise. why why why!
    var updatedAngle = -1 * centeredAngle + Math.PI / 2;
    var newLabels = [];
    if (getLabel(row)) {
      newLabels.push({
        angle: updatedAngle,
        radius: radius * labelsRadiusMultiplier,
        label: getLabel(row)
      });
    }

    if (getSubLabel(row)) {
      newLabels.push({
        angle: updatedAngle,
        radius: radius * labelsRadiusMultiplier,
        label: getSubLabel(row),
        style: { fontSize: 10 },
        yOffset: 12
      });
    }
    return res.concat(newLabels);
  }, []);
  // could add force direction here to make sure the labels dont overlap
}

/**
 * Get the max radius so the chart can extend to the margin.
 * @param  {Number} width - container width
 * @param  {Number} height - container height
 * @return {Number} radius
 */
function getMaxRadius(width, height) {
  return Math.min(width, height) / 2 - DEFAULT_RADIUS_MARGIN;
}

function RadialChart(props) {
  var animation = props.animation,
      className = props.className,
      children = props.children,
      colorType = props.colorType,
      data = props.data,
      getAngle = props.getAngle,
      getLabel = props.getLabel,
      getSubLabel = props.getSubLabel,
      height = props.height,
      hideRootNode = props.hideRootNode,
      innerRadius = props.innerRadius,
      labelsAboveChildren = props.labelsAboveChildren,
      labelsRadiusMultiplier = props.labelsRadiusMultiplier,
      labelsStyle = props.labelsStyle,
      margin = props.margin,
      onMouseLeave = props.onMouseLeave,
      onMouseEnter = props.onMouseEnter,
      radius = props.radius,
      showLabels = props.showLabels,
      style = props.style,
      width = props.width;

  var mappedData = getWedgesToRender({
    data: data,
    height: height,
    hideRootNode: hideRootNode,
    width: width,
    getAngle: getAngle
  });
  var radialDomain = getRadialDomain(mappedData);
  var arcProps = _extends$X({
    colorType: colorType
  }, props, {
    animation: animation,
    radiusDomain: [0, radialDomain],
    data: mappedData,
    radiusNoFallBack: true,
    style: style,
    arcClassName: 'rv-radial-chart__series--pie__slice'
  });
  if (radius) {
    arcProps.radiusDomain = [0, 1];
    arcProps.radiusRange = [innerRadius || 0, radius];
    arcProps.radiusType = 'linear';
  }
  var maxRadius = radius ? radius : getMaxRadius(width, height);
  var defaultMargin = getRadialLayoutMargin(width, height, maxRadius);

  var labels = generateLabels(mappedData, {
    getLabel: getLabel,
    getSubLabel: getSubLabel
  }, labelsRadiusMultiplier);
  return react.createElement(
    XYPlot,
    {
      height: height,
      width: width,
      margin: _extends$X({}, margin, defaultMargin),
      className: className + ' ' + predefinedClassName$g,
      onMouseLeave: onMouseLeave,
      onMouseEnter: onMouseEnter,
      xDomain: [-radialDomain, radialDomain],
      yDomain: [-radialDomain, radialDomain]
    },
    react.createElement(ArcSeries, _extends$X({}, arcProps, { getAngle: function getAngle(d) {
        return d.angle;
      } })),
    showLabels && !labelsAboveChildren && react.createElement(LabelSeries, { data: labels, style: labelsStyle }),
    children,
    showLabels && labelsAboveChildren && react.createElement(LabelSeries, { data: labels, style: labelsStyle })
  );
}

RadialChart.displayName = 'RadialChart';
RadialChart.propTypes = {
  animation: AnimationPropType,
  className: propTypes.string,
  colorType: propTypes.string,
  data: propTypes.arrayOf(propTypes.shape({
    angle: propTypes.number,
    className: propTypes.string,
    label: propTypes.string,
    radius: propTypes.number,
    style: propTypes.object
  })).isRequired,
  getAngle: propTypes.func,
  getAngle0: propTypes.func,
  padAngle: propTypes.oneOfType([propTypes.func, propTypes.number]),
  getRadius: propTypes.func,
  getRadius0: propTypes.func,
  getLabel: propTypes.func,
  height: propTypes.number.isRequired,
  labelsAboveChildren: propTypes.bool,
  labelsStyle: propTypes.object,
  margin: MarginPropType,
  onValueClick: propTypes.func,
  onValueMouseOver: propTypes.func,
  onValueMouseOut: propTypes.func,
  showLabels: propTypes.bool,
  style: propTypes.object,
  subLabel: propTypes.func,
  width: propTypes.number.isRequired
};
RadialChart.defaultProps = {
  className: '',
  colorType: 'category',
  colorRange: DISCRETE_COLOR_RANGE,
  padAngle: 0,
  getAngle: function getAngle(d) {
    return d.angle;
  },
  getAngle0: function getAngle0(d) {
    return d.angle0;
  },
  getRadius: function getRadius(d) {
    return d.radius;
  },
  getRadius0: function getRadius0(d) {
    return d.radius0;
  },
  getLabel: function getLabel(d) {
    return d.label;
  },
  getSubLabel: function getSubLabel(d) {
    return d.subLabel;
  }
};

var _extends$Y = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var predefinedClassName$h = 'rv-radar-chart';
var DEFAULT_FORMAT$1 = format('.2r');
/**
 * Generate axes for each of the domains
 * @param {Object} props
 - props.animation {Boolean}
 - props.domains {Array} array of object specifying the way each axis is to be plotted
 - props.style {object} style object for the whole chart
 - props.tickFormat {Function} formatting function for axes
 - props.startingAngle {number} the initial angle offset
 * @return {Array} the plotted axis components
 */
function getAxes(props) {
  var animation = props.animation,
      domains = props.domains,
      startingAngle = props.startingAngle,
      style = props.style,
      tickFormat = props.tickFormat,
      hideInnerMostValues = props.hideInnerMostValues;

  return domains.map(function (domain, index) {
    var angle = index / domains.length * Math.PI * 2 + startingAngle;
    var sortedDomain = domain.domain;

    var domainTickFormat = function domainTickFormat(t) {
      if (hideInnerMostValues && t === sortedDomain[0]) {
        return '';
      }
      return domain.tickFormat ? domain.tickFormat(t) : tickFormat(t);
    };

    return react.createElement(DecorativeAxis, {
      animation: animation,
      key: index + '-axis',
      axisStart: { x: 0, y: 0 },
      axisEnd: {
        x: getCoordinate(Math.cos(angle)),
        y: getCoordinate(Math.sin(angle))
      },
      axisDomain: sortedDomain,
      numberOfTicks: 5,
      tickValue: domainTickFormat,
      style: style.axes
    });
  });
}

/**
 * Generate x or y coordinate for axisEnd
 * @param {Number} axisEndPoint
 - epsilon is an arbitrarily chosen small number to approximate axisEndPoints
 - to true values resulting from trigonometry functions (sin, cos) on angles
 * @return {Number} the x or y coordinate accounting for exact trig values
 */
function getCoordinate(axisEndPoint) {
  var epsilon = 10e-13;
  if (Math.abs(axisEndPoint) <= epsilon) {
    axisEndPoint = 0;
  } else if (axisEndPoint > 0) {
    if (Math.abs(axisEndPoint - 0.5) <= epsilon) {
      axisEndPoint = 0.5;
    }
  } else if (axisEndPoint < 0) {
    if (Math.abs(axisEndPoint + 0.5) <= epsilon) {
      axisEndPoint = -0.5;
    }
  }
  return axisEndPoint;
}

/**
 * Generate labels for the ends of the axes
 * @param {Object} props
 - props.domains {Array} array of object specifying the way each axis is to be plotted
  - props.startingAngle {number} the initial angle offset
 - props.style {object} style object for just the labels
 * @return {Array} the prepped data for the labelSeries
 */
function getLabels(props) {
  var domains = props.domains,
      startingAngle = props.startingAngle,
      style = props.style;

  return domains.map(function (_ref, index) {
    var name = _ref.name;

    var angle = index / domains.length * Math.PI * 2 + startingAngle;
    var radius = 1.2;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      label: name,
      style: style
    };
  });
}

/**
 * Generate the actual polygons to be plotted
 * @param {Object} props
 - props.animation {Boolean}
 - props.data {Array} array of object specifying what values are to be plotted
 - props.domains {Array} array of object specifying the way each axis is to be plotted
 - props.startingAngle {number} the initial angle offset
 - props.style {object} style object for the whole chart
 * @return {Array} the plotted axis components
 */
function getPolygons(props) {
  var animation = props.animation,
      colorRange = props.colorRange,
      domains = props.domains,
      data = props.data,
      style = props.style,
      startingAngle = props.startingAngle,
      onSeriesMouseOver = props.onSeriesMouseOver,
      onSeriesMouseOut = props.onSeriesMouseOut;

  var scales = domains.reduce(function (acc, _ref2) {
    var domain = _ref2.domain,
        name = _ref2.name;

    acc[name] = linear$1().domain(domain).range([0, 1]);
    return acc;
  }, {});

  return data.map(function (row, rowIndex) {
    var mappedData = domains.map(function (_ref3, index) {
      var name = _ref3.name,
          getValue = _ref3.getValue;

      var dataPoint = getValue ? getValue(row) : row[name];
      // error handling if point doesn't exist
      var angle = index / domains.length * Math.PI * 2 + startingAngle;
      // dont let the radius become negative
      var radius = Math.max(scales[name](dataPoint), 0);
      return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), name: row.name };
    });

    return react.createElement(PolygonSeries, {
      animation: animation,
      className: predefinedClassName$h + '-polygon',
      key: rowIndex + '-polygon',
      data: mappedData,
      style: _extends$Y({
        stroke: row.color || row.stroke || colorRange[rowIndex % colorRange.length],
        fill: row.color || row.fill || colorRange[rowIndex % colorRange.length]
      }, style.polygons),
      onSeriesMouseOver: onSeriesMouseOver,
      onSeriesMouseOut: onSeriesMouseOut
    });
  });
}

/**
 * Generate circles at the polygon points for Hover functionality
 * @param {Object} props
 - props.animation {Boolean}
 - props.data {Array} array of object specifying what values are to be plotted
 - props.domains {Array} array of object specifying the way each axis is to be plotted
 - props.startingAngle {number} the initial angle offset
 - props.style {object} style object for the whole chart
 - props.onValueMouseOver {function} function to call on mouse over a polygon point
 - props.onValueMouseOver {function} function to call when mouse leaves a polygon point
 * @return {Array} the plotted axis components
 */
function getPolygonPoints(props) {
  var animation = props.animation,
      domains = props.domains,
      data = props.data,
      startingAngle = props.startingAngle,
      style = props.style,
      onValueMouseOver = props.onValueMouseOver,
      onValueMouseOut = props.onValueMouseOut;

  if (!onValueMouseOver) {
    return;
  }
  var scales = domains.reduce(function (acc, _ref4) {
    var domain = _ref4.domain,
        name = _ref4.name;

    acc[name] = linear$1().domain(domain).range([0, 1]);
    return acc;
  }, {});
  return data.map(function (row, rowIndex) {
    var mappedData = domains.map(function (_ref5, index) {
      var name = _ref5.name,
          getValue = _ref5.getValue;

      var dataPoint = getValue ? getValue(row) : row[name];
      // error handling if point doesn't exist
      var angle = index / domains.length * Math.PI * 2 + startingAngle;
      // dont let the radius become negative
      var radius = Math.max(scales[name](dataPoint), 0);
      return {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        domain: name,
        value: dataPoint,
        dataName: row.name
      };
    });

    return react.createElement(MarkSeries, {
      animation: animation,
      className: predefinedClassName$h + '-polygonPoint',
      key: rowIndex + '-polygonPoint',
      data: mappedData,
      size: 10,
      style: _extends$Y({}, style.polygons, {
        fill: 'transparent',
        stroke: 'transparent'
      }),
      onValueMouseOver: onValueMouseOver,
      onValueMouseOut: onValueMouseOut
    });
  });
}

function RadarChart(props) {
  var animation = props.animation,
      className = props.className,
      children = props.children,
      colorRange = props.colorRange,
      data = props.data,
      domains = props.domains,
      height = props.height,
      hideInnerMostValues = props.hideInnerMostValues,
      margin = props.margin,
      onMouseLeave = props.onMouseLeave,
      onMouseEnter = props.onMouseEnter,
      startingAngle = props.startingAngle,
      style = props.style,
      tickFormat = props.tickFormat,
      width = props.width,
      renderAxesOverPolygons = props.renderAxesOverPolygons,
      onValueMouseOver = props.onValueMouseOver,
      onValueMouseOut = props.onValueMouseOut,
      onSeriesMouseOver = props.onSeriesMouseOver,
      onSeriesMouseOut = props.onSeriesMouseOut;


  var axes = getAxes({
    domains: domains,
    animation: animation,
    hideInnerMostValues: hideInnerMostValues,
    startingAngle: startingAngle,
    style: style,
    tickFormat: tickFormat
  });

  var polygons = getPolygons({
    animation: animation,
    colorRange: colorRange,
    domains: domains,
    data: data,
    startingAngle: startingAngle,
    style: style,
    onSeriesMouseOver: onSeriesMouseOver,
    onSeriesMouseOut: onSeriesMouseOut
  });

  var polygonPoints = getPolygonPoints({
    animation: animation,
    colorRange: colorRange,
    domains: domains,
    data: data,
    startingAngle: startingAngle,
    style: style,
    onValueMouseOver: onValueMouseOver,
    onValueMouseOut: onValueMouseOut
  });

  var labelSeries = react.createElement(LabelSeries, {
    animation: animation,
    key: className,
    className: predefinedClassName$h + '-label',
    data: getLabels({ domains: domains, style: style.labels, startingAngle: startingAngle }) });
  return react.createElement(
    XYPlot,
    {
      height: height,
      width: width,
      margin: margin,
      dontCheckIfEmpty: true,
      className: className + ' ' + predefinedClassName$h,
      onMouseLeave: onMouseLeave,
      onMouseEnter: onMouseEnter,
      xDomain: [-1, 1],
      yDomain: [-1, 1] },
    children,
    !renderAxesOverPolygons && axes.concat(polygons).concat(labelSeries).concat(polygonPoints),
    renderAxesOverPolygons && polygons.concat(labelSeries).concat(axes).concat(polygonPoints)
  );
}

RadarChart.displayName = 'RadarChart';
RadarChart.propTypes = {
  animation: AnimationPropType,
  className: propTypes.string,
  colorType: propTypes.string,
  colorRange: propTypes.arrayOf(propTypes.string),
  data: propTypes.arrayOf(propTypes.object).isRequired,
  domains: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string.isRequired,
    domain: propTypes.arrayOf(propTypes.number).isRequired,
    tickFormat: propTypes.func
  })).isRequired,
  height: propTypes.number.isRequired,
  hideInnerMostValues: propTypes.bool,
  margin: MarginPropType,
  startingAngle: propTypes.number,
  style: propTypes.shape({
    axes: propTypes.object,
    labels: propTypes.object,
    polygons: propTypes.object
  }),
  tickFormat: propTypes.func,
  width: propTypes.number.isRequired,
  renderAxesOverPolygons: propTypes.bool,
  onValueMouseOver: propTypes.func,
  onValueMouseOut: propTypes.func,
  onSeriesMouseOver: propTypes.func,
  onSeriesMouseOut: propTypes.func
};
RadarChart.defaultProps = {
  className: '',
  colorType: 'category',
  colorRange: DISCRETE_COLOR_RANGE,
  hideInnerMostValues: true,
  startingAngle: Math.PI / 2,
  style: {
    axes: {
      line: {},
      ticks: {},
      text: {}
    },
    labels: {
      fontSize: 10,
      textAnchor: 'middle'
    },
    polygons: {
      strokeWidth: 0.5,
      strokeOpacity: 1,
      fillOpacity: 0.1
    }
  },
  tickFormat: DEFAULT_FORMAT$1,
  renderAxesOverPolygons: false
};

var _createClass$G = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends$Z = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty$8(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$G(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$G(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$G(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var predefinedClassName$i = 'rv-parallel-coordinates-chart';
var DEFAULT_FORMAT$2 = format('.2r');
/**
 * Generate axes for each of the domains
 * @param {Object} props
 - props.animation {Boolean}
 - props.domains {Array} array of object specifying the way each axis is to be plotted
 - props.style {object} style object for the whole chart
 - props.tickFormat {Function} formatting function for axes
 * @return {Array} the plotted axis components
 */
function getAxes$1(props) {
  var animation = props.animation,
      domains = props.domains,
      style = props.style,
      tickFormat = props.tickFormat;

  return domains.map(function (domain, index) {
    var sortedDomain = domain.domain;

    var domainTickFormat = function domainTickFormat(t) {
      return domain.tickFormat ? domain.tickFormat(t) : tickFormat(t);
    };

    return react.createElement(DecorativeAxis, {
      animation: animation,
      key: index + '-axis',
      axisStart: { x: domain.name, y: 0 },
      axisEnd: { x: domain.name, y: 1 },
      axisDomain: sortedDomain,
      numberOfTicks: 5,
      tickValue: domainTickFormat,
      style: style.axes
    });
  });
}

/**
 * Generate labels for the ends of the axes
 * @param {Object} props
 - props.domains {Array} array of object specifying the way each axis is to be plotted
 - props.style {object} style object for just the labels
 * @return {Array} the prepped data for the labelSeries
 */
function getLabels$1(props) {
  var domains = props.domains,
      style = props.style;

  return domains.map(function (domain, index) {
    return {
      x: domain.name,
      y: 1.1,
      label: domain.name,
      style: style
    };
  });
}

/**
 * Generate the actual lines to be plotted
 * @param {Object} props
 - props.animation {Boolean}
 - props.data {Array} array of object specifying what values are to be plotted
 - props.domains {Array} array of object specifying the way each axis is to be plotted
 - props.style {object} style object for the whole chart
 - props.showMarks {Bool} whether or not to use the line mark series
 * @return {Array} the plotted axis components
 */
function getLines(props) {
  var animation = props.animation,
      brushFilters = props.brushFilters,
      colorRange = props.colorRange,
      domains = props.domains,
      data = props.data,
      style = props.style,
      showMarks = props.showMarks;

  var scales = domains.reduce(function (acc, _ref) {
    var domain = _ref.domain,
        name = _ref.name;

    acc[name] = linear$1().domain(domain).range([0, 1]);
    return acc;
  }, {});
  // const

  return data.map(function (row, rowIndex) {
    var withinFilteredRange = true;
    var mappedData = domains.map(function (domain, index) {
      var getValue = domain.getValue,
          name = domain.name;

      // watch out! Gotcha afoot
      // yVal after being scale is in [0, 1] range

      var yVal = scales[name](getValue ? getValue(row) : row[name]);
      var filter = brushFilters[name];
      // filter value after being scale back from pixel space is also in [0, 1]
      if (filter && (yVal < filter.min || yVal > filter.max)) {
        withinFilteredRange = false;
      }
      return { x: name, y: yVal };
    });
    var selectedName = predefinedClassName$i + '-line';
    var unselectedName = selectedName + ' ' + predefinedClassName$i + '-line-unselected';
    var lineProps = {
      animation: animation,
      className: withinFilteredRange ? selectedName : unselectedName,
      key: rowIndex + '-polygon',
      data: mappedData,
      color: row.color || colorRange[rowIndex % colorRange.length],
      style: _extends$Z({}, style.lines, row.style || {})
    };
    if (!withinFilteredRange) {
      lineProps.style = _extends$Z({}, lineProps.style, style.deselectedLineStyle);
    }
    return showMarks ? react.createElement(LineMarkSeries, lineProps) : react.createElement(LineSeries, lineProps);
  });
}

var ParallelCoordinates = function (_Component) {
  _inherits$G(ParallelCoordinates, _Component);

  function ParallelCoordinates() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck$G(this, ParallelCoordinates);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn$G(this, (_ref2 = ParallelCoordinates.__proto__ || Object.getPrototypeOf(ParallelCoordinates)).call.apply(_ref2, [this].concat(args))), _this), _this.state = {
      brushFilters: {}
    }, _temp), _possibleConstructorReturn$G(_this, _ret);
  }

  _createClass$G(ParallelCoordinates, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var brushFilters = this.state.brushFilters;
      var _props = this.props,
          animation = _props.animation,
          brushing = _props.brushing,
          className = _props.className,
          children = _props.children,
          colorRange = _props.colorRange,
          data = _props.data,
          domains = _props.domains,
          height = _props.height,
          hideInnerMostValues = _props.hideInnerMostValues,
          margin = _props.margin,
          onMouseLeave = _props.onMouseLeave,
          onMouseEnter = _props.onMouseEnter,
          showMarks = _props.showMarks,
          style = _props.style,
          tickFormat = _props.tickFormat,
          width = _props.width;


      var axes = getAxes$1({
        domains: domains,
        animation: animation,
        hideInnerMostValues: hideInnerMostValues,
        style: style,
        tickFormat: tickFormat
      });

      var lines = getLines({
        animation: animation,
        brushFilters: brushFilters,
        colorRange: colorRange,
        domains: domains,
        data: data,
        showMarks: showMarks,
        style: style
      });
      var labelSeries = react.createElement(LabelSeries, {
        animation: true,
        key: className,
        className: predefinedClassName$i + '-label',
        data: getLabels$1({ domains: domains, style: style.labels })
      });

      var _getInnerDimensions = getInnerDimensions(this.props, DEFAULT_MARGINS),
          marginLeft = _getInnerDimensions.marginLeft,
          marginRight = _getInnerDimensions.marginRight;

      return react.createElement(
        XYPlot,
        {
          height: height,
          width: width,
          margin: margin,
          dontCheckIfEmpty: true,
          className: className + ' ' + predefinedClassName$i,
          onMouseLeave: onMouseLeave,
          onMouseEnter: onMouseEnter,
          xType: 'ordinal',
          yDomain: [0, 1]
        },
        children,
        axes.concat(lines).concat(labelSeries),
        brushing && domains.map(function (d) {
          var trigger = function trigger(row) {
            _this2.setState({
              brushFilters: _extends$Z({}, brushFilters, _defineProperty$8({}, d.name, row ? { min: row.bottom, max: row.top } : null))
            });
          };
          return react.createElement(Highlight, {
            key: d.name,
            drag: true,
            highlightX: d.name,
            onBrushEnd: trigger,
            onDragEnd: trigger,
            highlightWidth: (width - marginLeft - marginRight) / domains.length,
            enableX: false
          });
        })
      );
    }
  }]);

  return ParallelCoordinates;
}(react_2);

ParallelCoordinates.displayName = 'ParallelCoordinates';
ParallelCoordinates.propTypes = {
  animation: AnimationPropType,
  brushing: propTypes.bool,
  className: propTypes.string,
  colorType: propTypes.string,
  colorRange: propTypes.arrayOf(propTypes.string),
  data: propTypes.arrayOf(propTypes.object).isRequired,
  domains: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string.isRequired,
    domain: propTypes.arrayOf(propTypes.number).isRequired,
    tickFormat: propTypes.func
  })).isRequired,
  height: propTypes.number.isRequired,
  margin: MarginPropType,
  style: propTypes.shape({
    axes: propTypes.object,
    labels: propTypes.object,
    lines: propTypes.object
  }),
  showMarks: propTypes.bool,
  tickFormat: propTypes.func,
  width: propTypes.number.isRequired
};
ParallelCoordinates.defaultProps = {
  className: '',
  colorType: 'category',
  colorRange: DISCRETE_COLOR_RANGE,
  style: {
    axes: {
      line: {},
      ticks: {},
      text: {}
    },
    labels: {
      fontSize: 10,
      textAnchor: 'middle'
    },
    lines: {
      strokeWidth: 1,
      strokeOpacity: 1
    },
    deselectedLineStyle: {
      strokeOpacity: 0.1
    }
  },
  tickFormat: DEFAULT_FORMAT$2
};

function targetDepth(d) {
  return d.target.depth;
}

function left(node) {
  return node.depth;
}

function right(node, n) {
  return n - 1 - node.height;
}

function justify(node, n) {
  return node.sourceLinks.length ? node.depth : n - 1;
}

function center(node) {
  return node.targetLinks.length ? node.depth
      : node.sourceLinks.length ? min(node.sourceLinks, targetDepth) - 1
      : 0;
}

function constant$8(x) {
  return function() {
    return x;
  };
}

function ascendingSourceBreadth(a, b) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}

function ascendingTargetBreadth(a, b) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

function ascendingBreadth(a, b) {
  return a.y0 - b.y0;
}

function value(d) {
  return d.value;
}

function nodeCenter(node) {
  return (node.y0 + node.y1) / 2;
}

function weightedSource(link) {
  return nodeCenter(link.source) * link.value;
}

function weightedTarget(link) {
  return nodeCenter(link.target) * link.value;
}

function defaultId$1(d) {
  return d.index;
}

function defaultNodes(graph) {
  return graph.nodes;
}

function defaultLinks(graph) {
  return graph.links;
}

function find(nodeById, id) {
  var node = nodeById.get(id);
  if (!node) throw new Error("missing: " + id);
  return node;
}

function sankey() {
  var x0 = 0, y0 = 0, x1 = 1, y1 = 1, // extent
      dx = 24, // nodeWidth
      py = 8, // nodePadding
      id = defaultId$1,
      align = justify,
      nodes = defaultNodes,
      links = defaultLinks,
      iterations = 32;

  function sankey() {
    var graph = {nodes: nodes.apply(null, arguments), links: links.apply(null, arguments)};
    computeNodeLinks(graph);
    computeNodeValues(graph);
    computeNodeDepths(graph);
    computeNodeBreadths(graph, iterations);
    computeLinkBreadths(graph);
    return graph;
  }

  sankey.update = function(graph) {
    computeLinkBreadths(graph);
    return graph;
  };

  sankey.nodeId = function(_) {
    return arguments.length ? (id = typeof _ === "function" ? _ : constant$8(_), sankey) : id;
  };

  sankey.nodeAlign = function(_) {
    return arguments.length ? (align = typeof _ === "function" ? _ : constant$8(_), sankey) : align;
  };

  sankey.nodeWidth = function(_) {
    return arguments.length ? (dx = +_, sankey) : dx;
  };

  sankey.nodePadding = function(_) {
    return arguments.length ? (py = +_, sankey) : py;
  };

  sankey.nodes = function(_) {
    return arguments.length ? (nodes = typeof _ === "function" ? _ : constant$8(_), sankey) : nodes;
  };

  sankey.links = function(_) {
    return arguments.length ? (links = typeof _ === "function" ? _ : constant$8(_), sankey) : links;
  };

  sankey.size = function(_) {
    return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], sankey) : [x1 - x0, y1 - y0];
  };

  sankey.extent = function(_) {
    return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], sankey) : [[x0, y0], [x1, y1]];
  };

  sankey.iterations = function(_) {
    return arguments.length ? (iterations = +_, sankey) : iterations;
  };

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks(graph) {
    graph.nodes.forEach(function(node, i) {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    var nodeById = map$1(graph.nodes, id);
    graph.links.forEach(function(link, i) {
      link.index = i;
      var source = link.source, target = link.target;
      if (typeof source !== "object") source = link.source = find(nodeById, source);
      if (typeof target !== "object") target = link.target = find(nodeById, target);
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues(graph) {
    graph.nodes.forEach(function(node) {
      node.value = Math.max(
        sum(node.sourceLinks, value),
        sum(node.targetLinks, value)
      );
    });
  }

  // Iteratively assign the depth (x-position) for each node.
  // Nodes are assigned the maximum depth of incoming neighbors plus one;
  // nodes with no incoming links are assigned depth zero, while
  // nodes with no outgoing links are assigned the maximum depth.
  function computeNodeDepths(graph) {
    var nodes, next, x;

    for (nodes = graph.nodes, next = [], x = 0; nodes.length; ++x, nodes = next, next = []) {
      nodes.forEach(function(node) {
        node.depth = x;
        node.sourceLinks.forEach(function(link) {
          if (next.indexOf(link.target) < 0) {
            next.push(link.target);
          }
        });
      });
    }

    for (nodes = graph.nodes, next = [], x = 0; nodes.length; ++x, nodes = next, next = []) {
      nodes.forEach(function(node) {
        node.height = x;
        node.targetLinks.forEach(function(link) {
          if (next.indexOf(link.source) < 0) {
            next.push(link.source);
          }
        });
      });
    }

    var kx = (x1 - x0 - dx) / (x - 1);
    graph.nodes.forEach(function(node) {
      node.x1 = (node.x0 = x0 + Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x)))) * kx) + dx;
    });
  }

  function computeNodeBreadths(graph) {
    var columns = nest()
        .key(function(d) { return d.x0; })
        .sortKeys(ascending)
        .entries(graph.nodes)
        .map(function(d) { return d.values; });

    //
    initializeNodeBreadth();
    resolveCollisions();
    for (var alpha = 1, n = iterations; n > 0; --n) {
      relaxRightToLeft(alpha *= 0.99);
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }

    function initializeNodeBreadth() {
      var ky = min(columns, function(nodes) {
        return (y1 - y0 - (nodes.length - 1) * py) / sum(nodes, value);
      });

      columns.forEach(function(nodes) {
        nodes.forEach(function(node, i) {
          node.y1 = (node.y0 = i) + node.value * ky;
        });
      });

      graph.links.forEach(function(link) {
        link.width = link.value * ky;
      });
    }

    function relaxLeftToRight(alpha) {
      columns.forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            var dy = (sum(node.targetLinks, weightedSource) / sum(node.targetLinks, value) - nodeCenter(node)) * alpha;
            node.y0 += dy, node.y1 += dy;
          }
        });
      });
    }

    function relaxRightToLeft(alpha) {
      columns.slice().reverse().forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            var dy = (sum(node.sourceLinks, weightedTarget) / sum(node.sourceLinks, value) - nodeCenter(node)) * alpha;
            node.y0 += dy, node.y1 += dy;
          }
        });
      });
    }

    function resolveCollisions() {
      columns.forEach(function(nodes) {
        var node,
            dy,
            y = y0,
            n = nodes.length,
            i;

        // Push any overlapping nodes down.
        nodes.sort(ascendingBreadth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y - node.y0;
          if (dy > 0) node.y0 += dy, node.y1 += dy;
          y = node.y1 + py;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y - py - y1;
        if (dy > 0) {
          y = (node.y0 -= dy), node.y1 -= dy;

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y1 + py - y;
            if (dy > 0) node.y0 -= dy, node.y1 -= dy;
            y = node.y0;
          }
        }
      });
    }
  }

  function computeLinkBreadths(graph) {
    graph.nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetBreadth);
      node.targetLinks.sort(ascendingSourceBreadth);
    });
    graph.nodes.forEach(function(node) {
      var y0 = node.y0, y1 = y0;
      node.sourceLinks.forEach(function(link) {
        link.y0 = y0 + link.width / 2, y0 += link.width;
      });
      node.targetLinks.forEach(function(link) {
        link.y1 = y1 + link.width / 2, y1 += link.width;
      });
    });
  }

  return sankey;
}

function horizontalSource(d) {
  return [d.source.x1, d.y0];
}

function horizontalTarget(d) {
  return [d.target.x0, d.y1];
}

function sankeyLinkHorizontal() {
  return linkHorizontal()
      .source(horizontalSource)
      .target(horizontalTarget);
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var DEFAULT_LINK_COLOR = DISCRETE_COLOR_RANGE[1];
var DEFAULT_LINK_OPACITY = 0.7;

function SankeyLink(props) {
  var animation = props.animation,
      data = props.data,
      node = props.node,
      opacity = props.opacity,
      color = props.color,
      strokeWidth = props.strokeWidth,
      style = props.style,
      onLinkClick = props.onLinkClick,
      onLinkMouseOver = props.onLinkMouseOver,
      onLinkMouseOut = props.onLinkMouseOut;

  if (animation) {
    return react.createElement(
      Animation,
      _extends({}, props, { animatedProps: ANIMATED_SERIES_PROPS }),
      react.createElement(SankeyLink, _extends({}, props, { animation: null }))
    );
  }
  return react.createElement('path', _extends({
    d: data
  }, style, {
    className: 'rv-sankey__link',
    opacity: Number.isFinite(opacity) ? opacity : DEFAULT_LINK_OPACITY,
    stroke: color || DEFAULT_LINK_COLOR,
    onClick: function onClick(e) {
      return onLinkClick(node, e);
    },
    onMouseOver: function onMouseOver(e) {
      return onLinkMouseOver(node, e);
    },
    onMouseOut: function onMouseOut(e) {
      return onLinkMouseOut(node, e);
    },
    strokeWidth: strokeWidth,
    fill: 'none'
  }));
}

SankeyLink.displayName = 'SankeyLink';
SankeyLink.requiresSVG = true;

var _extends$_ = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray$4(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
var NOOP$2 = function NOOP(f) {
  return f;
};

var ALIGNMENTS = {
  justify: justify,
  center: center,
  left: left,
  right: right
};

var DEFAULT_MARGINS$2 = {
  top: 20,
  left: 20,
  right: 20,
  bottom: 20
};

function Sankey(props) {
  var align = props.align,
      animation = props.animation,
      children = props.children,
      className = props.className,
      hasVoronoi = props.hasVoronoi,
      height = props.height,
      hideLabels = props.hideLabels,
      labelRotation = props.labelRotation,
      layout = props.layout,
      links = props.links,
      linkOpacity = props.linkOpacity,
      margin = props.margin,
      nodePadding = props.nodePadding,
      nodes = props.nodes,
      nodeWidth = props.nodeWidth,
      onValueClick = props.onValueClick,
      onValueMouseOver = props.onValueMouseOver,
      onValueMouseOut = props.onValueMouseOut,
      onLinkClick = props.onLinkClick,
      onLinkMouseOver = props.onLinkMouseOver,
      onLinkMouseOut = props.onLinkMouseOut,
      style = props.style,
      width = props.width;

  var nodesCopy = [].concat(_toConsumableArray$4(new Array(nodes.length))).map(function (e, i) {
    return _extends$_({}, nodes[i]);
  });
  var linksCopy = [].concat(_toConsumableArray$4(new Array(links.length))).map(function (e, i) {
    return _extends$_({}, links[i]);
  });

  var _getInnerDimensions = getInnerDimensions({
    margin: margin,
    height: height,
    width: width
  }, DEFAULT_MARGINS$2),
      marginLeft = _getInnerDimensions.marginLeft,
      marginTop = _getInnerDimensions.marginTop,
      marginRight = _getInnerDimensions.marginRight,
      marginBottom = _getInnerDimensions.marginBottom;

  var sankeyInstance = sankey().extent([[marginLeft, marginTop], [width - marginRight, height - marginBottom - marginTop]]).nodeWidth(nodeWidth).nodePadding(nodePadding).nodes(nodesCopy).links(linksCopy).nodeAlign(ALIGNMENTS[align]).iterations(layout);
  sankeyInstance(nodesCopy);

  var nWidth = sankeyInstance.nodeWidth();
  var path = sankeyLinkHorizontal();

  return react.createElement(
    XYPlot,
    _extends$_({}, props, { yType: 'literal', className: 'rv-sankey ' + className }),
    linksCopy.map(function (link, i) {
      return react.createElement(SankeyLink, {
        style: style.links,
        data: path(link),
        opacity: link.opacity || linkOpacity,
        color: link.color,
        onLinkClick: onLinkClick,
        onLinkMouseOver: onLinkMouseOver,
        onLinkMouseOut: onLinkMouseOut,
        strokeWidth: Math.max(link.width, 1),
        node: link,
        nWidth: nWidth,
        key: 'link-' + i
      });
    }),
    react.createElement(VerticalRectSeries, {
      animation: animation,
      className: className + ' rv-sankey__node',
      data: nodesCopy.map(function (node) {
        return _extends$_({}, node, {
          y: node.y1 - marginTop,
          y0: node.y0 - marginTop,
          x: node.x1,
          x0: node.x0,
          color: node.color || DISCRETE_COLOR_RANGE[0],
          sourceLinks: null,
          targetLinks: null
        });
      }),
      style: style.rects,
      onValueClick: onValueClick,
      onValueMouseOver: onValueMouseOver,
      onValueMouseOut: onValueMouseOut,
      colorType: 'literal'
    }),
    !hideLabels && react.createElement(LabelSeries, {
      animation: animation,
      className: className,
      rotation: labelRotation,
      labelAnchorY: 'text-before-edge',
      data: nodesCopy.map(function (node, i) {
        return _extends$_({
          x: node.x0 + (node.x0 < width / 2 ? nWidth + 10 : -10),
          y: (node.y0 + node.y1) / 2 - marginTop,
          label: node.name,
          style: _extends$_({
            textAnchor: node.x0 < width / 2 ? 'start' : 'end',
            dy: '-.5em'
          }, style.labels)
        }, nodes[i]);
      })
    }),
    hasVoronoi && react.createElement(Voronoi, {
      className: 'rv-sankey__voronoi',
      extent: [[-marginLeft, -marginTop], [width + marginRight, height + marginBottom]],
      nodes: nodesCopy,
      onClick: onValueClick,
      onHover: onValueMouseOver,
      onBlur: onValueMouseOut,
      x: function x(d) {
        return d.x0 + (d.x1 - d.x0) / 2;
      },
      y: function y(d) {
        return d.y0 + (d.y1 - d.y0) / 2;
      }
    }),
    children
  );
}

Sankey.defaultProps = {
  align: 'justify',
  className: '',
  hasVoronoi: false,
  hideLabels: false,
  labelRotation: 0,
  layout: 50,
  margin: DEFAULT_MARGINS$2,
  nodePadding: 10,
  nodeWidth: 10,
  onValueMouseOver: NOOP$2,
  onValueClick: NOOP$2,
  onValueMouseOut: NOOP$2,
  onLinkClick: NOOP$2,
  onLinkMouseOver: NOOP$2,
  onLinkMouseOut: NOOP$2,
  style: {
    links: {},
    rects: {},
    labels: {}
  }
};

Sankey.propTypes = {
  align: propTypes.oneOf(['justify', 'left', 'right', 'center']),
  className: propTypes.string,
  hasVoronoi: propTypes.bool,
  height: propTypes.number.isRequired,
  hideLabels: propTypes.bool,
  labelRotation: propTypes.number,
  layout: propTypes.number,
  links: propTypes.arrayOf(propTypes.shape({
    source: propTypes.oneOfType([propTypes.number, propTypes.object]).isRequired,
    target: propTypes.oneOfType([propTypes.number, propTypes.object]).isRequired
  })).isRequired,
  margin: MarginPropType,
  nodePadding: propTypes.number,
  nodes: propTypes.arrayOf(propTypes.object).isRequired,
  nodeWidth: propTypes.number,
  onValueMouseOver: propTypes.func,
  onValueClick: propTypes.func,
  onValueMouseOut: propTypes.func,
  onLinkClick: propTypes.func,
  onLinkMouseOver: propTypes.func,
  onLinkMouseOut: propTypes.func,
  style: propTypes.shape({
    links: propTypes.object,
    rects: propTypes.object,
    labels: propTypes.object
  }),
  width: propTypes.number.isRequired
};

var _extends$10 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var predefinedClassName$j = 'rv-sunburst';

var LISTENERS_TO_OVERWRITE = ['onValueMouseOver', 'onValueMouseOut', 'onValueClick', 'onValueRightClick', 'onSeriesMouseOver', 'onSeriesMouseOut', 'onSeriesClick', 'onSeriesRightClick'];

/**
 * Create the list of nodes to render.
 * @param {Object} props
   props.data {Object} - tree structured data (each node has a name anc an array of children)
   props.height {number} - the height of the graphic to be rendered
   props.hideRootNode {boolean} - whether or not to hide the root node
   props.width {number} - the width of the graphic to be rendered
   props.getSize {function} - accessor for the size
 * @returns {Array} Array of nodes.
 */
function getNodesToRender(_ref) {
  var data = _ref.data,
      height = _ref.height,
      hideRootNode = _ref.hideRootNode,
      width = _ref.width,
      getSize = _ref.getSize;

  var partitionFunction = partition();
  var structuredInput = hierarchy(data).sum(getSize);
  var radius = Math.min(width, height) / 2 - 10;
  var x = linear$1().range([0, 2 * Math.PI]);
  var y = sqrt().range([0, radius]);

  return partitionFunction(structuredInput).descendants().reduce(function (res, cell, index) {
    if (hideRootNode && index === 0) {
      return res;
    }

    return res.concat([_extends$10({
      angle0: Math.max(0, Math.min(2 * Math.PI, x(cell.x0))),
      angle: Math.max(0, Math.min(2 * Math.PI, x(cell.x1))),
      radius0: Math.max(0, y(cell.y0)),
      radius: Math.max(0, y(cell.y1)),
      depth: cell.depth,
      parent: cell.parent
    }, cell.data)]);
  }, []);
}

/**
 * Convert arc nodes into label rows.
 * Important to use mappedData rather than regular data, bc it is already unrolled
 * @param {Array} mappedData - Array of nodes.
 * @param {Object} accessors - object of accessors
 * @returns {Array} array of node for rendering as labels
 */
function buildLabels(mappedData, accessors) {
  var getAngle = accessors.getAngle,
      getAngle0 = accessors.getAngle0,
      getLabel = accessors.getLabel,
      getRadius0 = accessors.getRadius0;


  return mappedData.filter(getLabel).map(function (row) {
    var truedAngle = -1 * getAngle(row) + Math.PI / 2;
    var truedAngle0 = -1 * getAngle0(row) + Math.PI / 2;
    var angle = (truedAngle0 + truedAngle) / 2;
    var rotateLabels = !row.dontRotateLabel;
    var rotAngle = -angle / (2 * Math.PI) * 360;

    return _extends$10({}, row, {
      children: null,
      angle: null,
      radius: null,
      x: getRadius0(row) * Math.cos(angle),
      y: getRadius0(row) * Math.sin(angle),
      style: _extends$10({
        textAnchor: rotAngle > 90 ? 'end' : 'start'
      }, row.labelStyle),
      rotation: rotateLabels ? rotAngle > 90 ? rotAngle + 180 : rotAngle === 90 ? 90 : rotAngle : null
    });
  });
}

var NOOP$3 = function NOOP() {};

function Sunburst(props) {
  var getAngle = props.getAngle,
      getAngle0 = props.getAngle0,
      animation = props.animation,
      className = props.className,
      children = props.children,
      data = props.data,
      height = props.height,
      hideRootNode = props.hideRootNode,
      getLabel = props.getLabel,
      width = props.width,
      getSize = props.getSize,
      colorType = props.colorType;

  var mappedData = getNodesToRender({
    data: data,
    height: height,
    hideRootNode: hideRootNode,
    width: width,
    getSize: getSize
  });
  var radialDomain = getRadialDomain(mappedData);
  var margin = getRadialLayoutMargin(width, height, radialDomain);

  var labelData = buildLabels(mappedData, {
    getAngle: getAngle,
    getAngle0: getAngle0,
    getLabel: getLabel,
    getRadius0: function getRadius0(d) {
      return d.radius0;
    }
  });

  var hofBuilder = function hofBuilder(f) {
    return function (e, i) {
      return f ? f(mappedData[e.index], i) : NOOP$3;
    };
  };
  return react.createElement(
    XYPlot,
    {
      height: height,
      hasTreeStructure: true,
      width: width,
      className: predefinedClassName$j + ' ' + className,
      margin: margin,
      xDomain: [-radialDomain, radialDomain],
      yDomain: [-radialDomain, radialDomain]
    },
    react.createElement(ArcSeries, _extends$10({
      colorType: colorType
    }, props, {
      animation: animation,
      radiusDomain: [0, radialDomain],
      // need to present a stripped down version for interpolation
      data: animation ? mappedData.map(function (row, index) {
        return _extends$10({}, row, {
          parent: null,
          children: null,
          index: index
        });
      }) : mappedData,
      _data: animation ? mappedData : null,
      arcClassName: predefinedClassName$j + '__series--radial__arc'
    }, LISTENERS_TO_OVERWRITE.reduce(function (acc, propName) {
      var prop = props[propName];
      acc[propName] = animation ? hofBuilder(prop) : prop;
      return acc;
    }, {}))),
    labelData.length > 0 && react.createElement(LabelSeries, { data: labelData, getLabel: getLabel }),
    children
  );
}

Sunburst.displayName = 'Sunburst';
Sunburst.propTypes = {
  animation: AnimationPropType,
  getAngle: propTypes.func,
  getAngle0: propTypes.func,
  className: propTypes.string,
  colorType: propTypes.string,
  data: propTypes.object.isRequired,
  height: propTypes.number.isRequired,
  hideRootNode: propTypes.bool,
  getLabel: propTypes.func,
  onValueClick: propTypes.func,
  onValueMouseOver: propTypes.func,
  onValueMouseOut: propTypes.func,
  getSize: propTypes.func,
  width: propTypes.number.isRequired,
  padAngle: propTypes.oneOfType([propTypes.func, propTypes.number])
};
Sunburst.defaultProps = {
  getAngle: function getAngle(d) {
    return d.angle;
  },
  getAngle0: function getAngle0(d) {
    return d.angle0;
  },
  className: '',
  colorType: 'literal',
  getColor: function getColor(d) {
    return d.color;
  },
  hideRootNode: false,
  getLabel: function getLabel(d) {
    return d.label;
  },
  getSize: function getSize(d) {
    return d.size;
  },
  padAngle: 0
};

var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof commonjsGlobal !== "undefined") {
    win = commonjsGlobal;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

var window_1 = win;

var _extends$11 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$H = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties$1(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck$H(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$H(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$H(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CONTAINER_REF = 'container';

// As a performance enhancement, we want to only listen once
var resizeSubscribers = [];
var DEBOUNCE_DURATION = 100;
var timeoutId = null;

/**
 * Calls each subscriber, debounced to the
 */
function debounceEmitResize() {
  window_1.clearTimeout(timeoutId);
  timeoutId = window_1.setTimeout(emitResize, DEBOUNCE_DURATION);
}

/**
 * Calls each subscriber once syncronously.
 */
function emitResize() {
  resizeSubscribers.forEach(function (cb) {
    return cb();
  });
}

/**
 * Add the given callback to the list of subscribers to be caled when the
 * window resizes. Returns a function that, when called, removes the given
 * callback from the list of subscribers. This function is also resposible for
 * adding and removing the resize listener on `window`.
 *
 * @param {Function} cb - Subscriber callback function
 * @returns {Function} Unsubscribe function
 */
function subscribeToDebouncedResize(cb) {
  resizeSubscribers.push(cb);

  // if we go from zero to one Flexible components instances, add the listener
  if (resizeSubscribers.length === 1) {
    window_1.addEventListener('resize', debounceEmitResize);
  }
  return function unsubscribe() {
    removeSubscriber(cb);

    // if we have no Flexible components, remove the listener
    if (resizeSubscribers.length === 0) {
      window_1.clearTimeout(timeoutId);
      window_1.removeEventListener('resize', debounceEmitResize);
    }
  };
}

/**
 * Helper for removing the given callback from the list of subscribers.
 *
 * @param {Function} cb - Subscriber callback function
 */
function removeSubscriber(cb) {
  var index = resizeSubscribers.indexOf(cb);
  if (index > -1) {
    resizeSubscribers.splice(index, 1);
  }
}

/**
 * Helper for getting a display name for the child component
 * @param {*} Component React class for the child component.
 * @returns {String} The child components name
 */
function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

/**
 * Add the ability to stretch the visualization on window resize.
 * @param {*} Component React class for the child component.
 * @returns {*} Flexible component.
 */

function makeFlexible(Component, isWidthFlexible, isHeightFlexible) {
  var ResultClass = function (_React$Component) {
    _inherits$H(ResultClass, _React$Component);

    _createClass$H(ResultClass, null, [{
      key: 'propTypes',
      get: function get() {
        var _Component$propTypes = Component.propTypes,
            height = _Component$propTypes.height,
            width = _Component$propTypes.width,
            otherPropTypes = _objectWithoutProperties$1(_Component$propTypes, ['height', 'width']); // eslint-disable-line no-unused-vars


        return otherPropTypes;
      }
    }]);

    function ResultClass(props) {
      _classCallCheck$H(this, ResultClass);

      var _this = _possibleConstructorReturn$H(this, (ResultClass.__proto__ || Object.getPrototypeOf(ResultClass)).call(this, props));

      _this._onResize = function () {
        var containerElement = getDOMNode(_this[CONTAINER_REF]);
        var offsetHeight = containerElement.offsetHeight,
            offsetWidth = containerElement.offsetWidth;


        var newHeight = _this.state.height === offsetHeight ? {} : { height: offsetHeight };

        var newWidth = _this.state.width === offsetWidth ? {} : { width: offsetWidth };

        _this.setState(_extends$11({}, newHeight, newWidth));
      };

      _this.state = {
        height: 0,
        width: 0
      };
      return _this;
    }

    /**
     * Get the width of the container and assign the width.
     * @private
     */


    _createClass$H(ResultClass, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this._onResize();
        this.cancelSubscription = subscribeToDebouncedResize(this._onResize);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps() {
        this._onResize();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.cancelSubscription();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _state = this.state,
            height = _state.height,
            width = _state.width;

        var props = _extends$11({}, this.props, {
          animation: height === 0 && width === 0 ? null : this.props.animation
        });

        var updatedDimensions = _extends$11({}, isHeightFlexible ? { height: height } : {}, isWidthFlexible ? { width: width } : {});

        return react.createElement(
          'div',
          {
            ref: function ref(_ref) {
              return _this2[CONTAINER_REF] = _ref;
            },
            style: { width: '100%', height: '100%' }
          },
          react.createElement(Component, _extends$11({}, updatedDimensions, props))
        );
      }
    }]);

    return ResultClass;
  }(react.Component);

  ResultClass.displayName = 'Flexible' + getDisplayName(Component);

  return ResultClass;
}

function makeHeightFlexible(component) {
  return makeFlexible(component, false, true);
}

function makeVisFlexible(component) {
  return makeFlexible(component, true, true);
}

function makeWidthFlexible(component) {
  return makeFlexible(component, true, false);
}

var FlexibleWidthXYPlot = makeWidthFlexible(XYPlot);
var FlexibleHeightXYPlot = makeHeightFlexible(XYPlot);
var FlexibleXYPlot = makeVisFlexible(XYPlot);

// Copyright (c) 2016 - 2017 Uber Technologies, Inc.

var css$2 = ".react-vis-magic-css-import-rule{display:inherit}.rv-treemap{font-size:12px;position:relative}.rv-treemap__leaf{overflow:hidden;position:absolute}.rv-treemap__leaf--circle{align-items:center;border-radius:100%;display:flex;justify-content:center}.rv-treemap__leaf__content{overflow:hidden;padding:10px;text-overflow:ellipsis}.rv-xy-plot{color:#c3c3c3;position:relative}.rv-xy-plot canvas{pointer-events:none}.rv-xy-plot .rv-xy-canvas{pointer-events:none;position:absolute}.rv-xy-plot__inner{display:block}.rv-xy-plot__axis__line{fill:none;stroke-width:2px;stroke:#e6e6e9}.rv-xy-plot__axis__tick__line{stroke:#e6e6e9}.rv-xy-plot__axis__tick__text{fill:#6b6b76;font-size:11px}.rv-xy-plot__axis__title text{fill:#6b6b76;font-size:11px}.rv-xy-plot__grid-lines__line{stroke:#e6e6e9}.rv-xy-plot__circular-grid-lines__line{fill-opacity:0;stroke:#e6e6e9}.rv-xy-plot__series,.rv-xy-plot__series path{pointer-events:all}.rv-xy-plot__series--line{fill:none;stroke:#000;stroke-width:2px}.rv-crosshair{position:absolute;font-size:11px;pointer-events:none}.rv-crosshair__line{background:#47d3d9;width:1px}.rv-crosshair__inner{position:absolute;text-align:left;top:0}.rv-crosshair__inner__content{border-radius:4px;background:#3a3a48;color:#fff;font-size:12px;padding:7px 10px;box-shadow:0 2px 4px rgba(0,0,0,0.5)}.rv-crosshair__inner--left{right:4px}.rv-crosshair__inner--right{left:4px}.rv-crosshair__title{font-weight:bold;white-space:nowrap}.rv-crosshair__item{white-space:nowrap}.rv-hint{position:absolute;pointer-events:none}.rv-hint__content{border-radius:4px;padding:7px 10px;font-size:12px;background:#3a3a48;box-shadow:0 2px 4px rgba(0,0,0,0.5);color:#fff;text-align:left;white-space:nowrap}.rv-discrete-color-legend{box-sizing:border-box;overflow-y:auto;font-size:12px}.rv-discrete-color-legend.horizontal{white-space:nowrap}.rv-discrete-color-legend-item{color:#3a3a48;border-radius:1px;padding:9px 10px}.rv-discrete-color-legend-item.horizontal{display:inline-block}.rv-discrete-color-legend-item.horizontal .rv-discrete-color-legend-item__title{margin-left:0;display:block}.rv-discrete-color-legend-item__color{display:inline-block;vertical-align:middle;overflow:visible}.rv-discrete-color-legend-item__color__path{stroke:#dcdcdc;stroke-width:2px}.rv-discrete-color-legend-item__title{margin-left:10px}.rv-discrete-color-legend-item.disabled{color:#b8b8b8}.rv-discrete-color-legend-item.clickable{cursor:pointer}.rv-discrete-color-legend-item.clickable:hover{background:#f9f9f9}.rv-search-wrapper{display:flex;flex-direction:column}.rv-search-wrapper__form{flex:0}.rv-search-wrapper__form__input{width:100%;color:#a6a6a5;border:1px solid #e5e5e4;padding:7px 10px;font-size:12px;box-sizing:border-box;border-radius:2px;margin:0 0 9px;outline:0}.rv-search-wrapper__contents{flex:1;overflow:auto}.rv-continuous-color-legend{font-size:12px}.rv-continuous-color-legend .rv-gradient{height:4px;border-radius:2px;margin-bottom:5px}.rv-continuous-size-legend{font-size:12px}.rv-continuous-size-legend .rv-bubbles{text-align:justify;overflow:hidden;margin-bottom:5px;width:100%}.rv-continuous-size-legend .rv-bubble{background:#d8d9dc;display:inline-block;vertical-align:bottom}.rv-continuous-size-legend .rv-spacer{display:inline-block;font-size:0;line-height:0;width:100%}.rv-legend-titles{height:16px;position:relative}.rv-legend-titles__left,.rv-legend-titles__right,.rv-legend-titles__center{position:absolute;white-space:nowrap;overflow:hidden}.rv-legend-titles__center{display:block;text-align:center;width:100%}.rv-legend-titles__right{right:0}.rv-radial-chart .rv-xy-plot__series--label{pointer-events:none}\n";
styleInject(css$2);

/**
 * Display a d3 Sunburst diagram
 *
 * @class D3Sunburst
 * @extends {React.Component}
 */

var tipStyle = {
  display: 'flex',
  color: '#fff',
  background: '#000',
  alignItems: 'center',
  padding: '5px'
};

var boxStyle = { height: '10px', width: '10px' };

var D3Sunburst = function (_React$Component) {
  inherits(D3Sunburst, _React$Component);

  function D3Sunburst() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, D3Sunburst);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = D3Sunburst.__proto__ || Object.getPrototypeOf(D3Sunburst)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      hoveredCell: false
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(D3Sunburst, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var hoveredCell = this.state.hoveredCell;


      return react.createElement(
        Sunburst,
        {
          style: { stroke: '#fff' },
          onValueMouseOver: function onValueMouseOver(v) {
            return _this2.setState({ hoveredCell: v.x && v.y ? v : false });
          },
          onValueMouseOut: function onValueMouseOut() {
            return _this2.setState({ hoveredCell: false });
          },
          onValueClick: function onValueClick(node) {
            var url = _this2.props.urlPrefix + node.name + '/' + _this2.props.simhashData.name + '/' + _this2.props.url;
            window.open(url, '_blank');
          },
          data: this.props.simhashData,
          padAngle: function padAngle() {
            return 0.02;
          },
          width: this._getSize(),
          height: this._getSize(),
          getSize: function getSize(d) {
            return d.bigness;
          },
          getColor: function getColor(d) {
            return d.clr;
          } },
        hoveredCell ? react.createElement(
          Hint,
          { value: this._buildValue(hoveredCell) },
          react.createElement(
            'div',
            { style: tipStyle },
            react.createElement('div', { style: _extends({}, boxStyle, { background: hoveredCell.clr }) }),
            this.getDistance(hoveredCell),
            ' Timestamp: ' + hoveredCell.name
          )
        ) : null
      );
    }
  }, {
    key: '_buildValue',
    value: function _buildValue(hoveredCell) {
      var radius = hoveredCell.radius,
          angle = hoveredCell.angle,
          angle0 = hoveredCell.angle0;

      var truedAngle = (angle + angle0) / 2;
      var temp = {
        x: radius * Math.cos(truedAngle),
        y: radius * Math.sin(truedAngle)
      };

      return temp;
    }
  }, {
    key: '_getSize',
    value: function _getSize() {
      var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

      var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

      if (h < w) {
        return h * 0.45;
      }
      return w * 0.45;
    }
  }, {
    key: 'getDistance',
    value: function getDistance(hoveredCell) {
      if (hoveredCell.similarity !== -1) {
        return 'Differences: ' + Math.round(hoveredCell.similarity * 100) + '%';
      }
    }
  }]);
  return D3Sunburst;
}(react.Component);

var css$3 = ".heat-map-legend-bar {\n    width: 10px;\n    margin: 0 1px;\n    transition: height .2s;\n}\n\n.heat-map-legend-summary {\n    display: flex;\n    align-items: center;\n    height: 20px\n}\n\n.heat-map-legend {\n    align-self: flex-end;\n    display: flex;\n    align-items: baseline;\n    font-size: 12px;\n    float: right;\n}\n\n.heat-map-legend-summary-min-caption {\n    width: 32px;\n    text-align: right;\n}\n\n.heat-map-legend-caption {\n    margin: 0 8px;\n}\n\n.heat-map-legend-summary-graphics {\n    display: flex;\n    margin: 0 8px;\n    height: 20px;\n}\n\n.sunburst-container{\n    margin: auto;\n    width: 50%;\n}\n\n.rv-sunburst {\n    margin: 0 auto;\n}\n";
styleInject(css$3);

/**
 * Container of d3 Sunburst diagram
 *
 * @class SunburstContainer
 * @extends {React.Component}
 */

var SunburstContainer = function (_React$Component) {
  inherits(SunburstContainer, _React$Component);

  function SunburstContainer(props) {
    classCallCheck(this, SunburstContainer);

    var _this = possibleConstructorReturn(this, (SunburstContainer.__proto__ || Object.getPrototypeOf(SunburstContainer)).call(this, props));

    _this.state = {
      simhashData: null,
      timestamp: _this.props.timestamp
    };
    return _this;
  }

  createClass(SunburstContainer, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.state.showError) {
        return react.createElement(ErrorMessage, { url: this.props.url, code: this._errorCode });
      }
      if (this.state.simhashData) {
        return react.createElement(
          'div',
          { className: 'sunburst-container' },
          react.createElement(D3Sunburst, { urlPrefix: this.props.conf.urlPrefix, url: this.props.url, simhashData: this.state.simhashData }),
          react.createElement(
            'div',
            { className: 'heat-map-legend' },
            react.createElement(
              'div',
              { className: 'heat-map-legend-caption' },
              'Variation'
            ),
            react.createElement(
              'div',
              { className: 'heat-map-legend-summary' },
              react.createElement(
                'div',
                { className: 'heat-map-legend-summary-min-caption' },
                'Low'
              ),
              react.createElement(
                'div',
                { className: 'heat-map-legend-summary-graphics' },
                react.createElement('div', { className: 'heat-map-legend-bar', style: { backgroundColor: 'rgb(241, 231, 119)', height: '4px' } }),
                react.createElement('div', { className: 'heat-map-legend-bar', style: { backgroundColor: 'rgb(197, 213, 108)', height: '5px' } }),
                react.createElement('div', { className: 'heat-map-legend-bar', style: { backgroundColor: 'rgb(159, 197, 99)', height: '6px' } }),
                react.createElement('div', { className: 'heat-map-legend-bar', style: { backgroundColor: 'rgb(141, 184, 101)', height: '7px' } }),
                react.createElement('div', { className: 'heat-map-legend-bar', style: { backgroundColor: 'rgb(107, 151, 117)', height: '8px' } })
              ),
              react.createElement(
                'div',
                { className: 'heat-map-legend-summary-max-caption' },
                'High'
              )
            )
          )
        );
      }
      var Loader = function Loader() {
        return _this2.props.loader;
      };
      this._fetchTimestampSimhashData(this.state.timestamp);
      this._validateTimestamp();
      return react.createElement(Loader, null);
    }
  }, {
    key: '_validateTimestamp',
    value: function _validateTimestamp() {
      var _this3 = this;

      var promise = void 0;
      if (this.props.fetchSnapshotCallback) {
        promise = this.props.fetchSnapshotCallback(this.state.timestamp);
      } else {
        var url = handleRelativeURL(this.props.conf.snapshotsPrefix) + this.state.timestamp + '/' + encodeURIComponent(this.props.url);
        promise = fetch_with_timeout(fetch(url, { redirect: 'follow' }));
      }
      promise.then(function (response) {
        return checkResponse(response);
      }).then(function (response) {
        var url = response.url;
        var fetchedTimestamp = url.split('/')[4];
        if (_this3.state.timestamp !== fetchedTimestamp) {

          window.history.pushState({}, '', _this3.props.conf.diffgraphPrefix + fetchedTimestamp + '/' + _this3.props.url);
          _this3.setState({ timestamp: fetchedTimestamp });
        }
      }).catch(function (error) {
        _this3.errorHandled(error.message);
      });
    }
  }, {
    key: 'errorHandled',
    value: function errorHandled(errorCode) {
      this._errorCode = errorCode;
      this.setState({ showError: true });
    }
  }, {
    key: '_fetchTimestampSimhashData',
    value: function _fetchTimestampSimhashData(timestamp) {
      var _this4 = this;

      var url = this.props.conf.waybackDiscoverDiff + '/simhash?url=' + encodeURIComponent(this.props.url) + '&timestamp=' + timestamp;
      fetch_with_timeout(fetch(url)).then(function (response) {
        return checkResponse(response);
      }).then(function (response) {
        return response.json();
      }).then(function (jsonResponse) {
        var json = _this4._decodeJson(jsonResponse);
        _this4._fetchSimhashData(json);
      }).catch(function (error) {
        _this4.errorHandled(error.message);
      });
    }
  }, {
    key: '_fetchSimhashData',
    value: function _fetchSimhashData(timestampJson) {
      var _this5 = this;

      var url = this.props.conf.waybackDiscoverDiff + '/simhash?url=' + encodeURIComponent(this.props.url) + '&year=' + this.state.timestamp.substring(0, 4);
      fetch_with_timeout(fetch(url)).then(function (response) {
        return checkResponse(response);
      }).then(function (response) {
        return response.json();
      }).then(function (jsonResponse) {
        var json = _this5._decodeJson(jsonResponse);
        var data = _this5._calcDistance(json, timestampJson);
        _this5._createLevels(data, timestampJson);
      }).catch(function (error) {
        _this5.errorHandled(error.message);
      });
    }
  }, {
    key: '_decodeJson',
    value: function _decodeJson(json) {
      var Base64 = function () {

        var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        var Base64 = function Base64() {};

        var _decode = function _decode(value) {

          var result = 0;
          for (var i = 0, len = value.length; i < len; i++) {
            result *= 64;
            result += ALPHA.indexOf(value[i]);
          }

          return result;
        };

        Base64.prototype = {
          constructor: Base64,
          decode: _decode
        };

        return Base64;
      }();
      var base64 = new Base64();
      if (json.length) {
        for (var i = 0; i < json.length; i++) {
          json[i][1] = json[i][1].toString().replace(/=/, '');
          json[i][1] = base64.decode(json[i][1]);
        }
        return json;
      }

      json.simhash = json.simhash.toString().replace(/=/, '');
      json.simhash = base64.decode(json.simhash);

      return [this.state.timestamp, json.simhash];
    }
  }, {
    key: '_calcDistance',
    value: function _calcDistance(json, timestamp) {
      this._mostSimilar = 0;
      this._lessSimilar = 1;
      for (var i = 0; i < json.length; i++) {
        json[i][1] = similarity(timestamp[1], json[i][1]);
        if (this._lessSimilar > json[i][1]) {
          this._lessSimilar = json[i][1];
        }
        if (this._mostSimilar < json[i][1]) {
          this._mostSimilar = json[i][1];
        }
      }
      return json;
    }
  }, {
    key: '_createLevels',
    value: function _createLevels(json, timestamp) {
      var firstLevel = [];
      var secondLevel = [];
      var thirdLevel = [];
      var fourthLevel = [];
      var fifthLevel = [];
      var step = 0.1;

      var colors = ['#dddddd', '#f1e777', '#c5d56c', '#8db865', '#6b9775', '#4d7a83'];

      var diffLevels = this._mostSimilar - this._lessSimilar;

      if (diffLevels > 0.2) {
        step = diffLevels / 5;
      }

      for (var i = 0; i < json.length; i++) {
        if (json[i][1] !== 0) {
          if (json[i][1] <= this._lessSimilar + step) {
            fifthLevel.push({ name: json[i][0], bigness: 10, similarity: 1 - json[i][1], clr: colors[5], children: [] });
          } else if (json[i][1] <= this._lessSimilar + 2 * step) {
            fourthLevel.push({ name: json[i][0], bigness: 10, similarity: 1 - json[i][1], clr: colors[4], children: [] });
          } else if (json[i][1] <= this._lessSimilar + 3 * step) {
            thirdLevel.push({ name: json[i][0], bigness: 10, similarity: 1 - json[i][1], clr: colors[3], children: [] });
          } else if (json[i][1] <= this._lessSimilar + 4 * step) {
            secondLevel.push({ name: json[i][0], bigness: 10, similarity: 1 - json[i][1], clr: colors[2], children: [] });
          } else {
            firstLevel.push({ name: json[i][0], bigness: 10, similarity: 1 - json[i][1], clr: colors[1], children: [] });
          }
        }
      }

      if (firstLevel.length > this.props.conf.maxSunburstLevelLength) {
        firstLevel.length = this.props.conf.maxSunburstLevelLength;
      }
      if (secondLevel.length > this.props.conf.maxSunburstLevelLength) {
        secondLevel.length = this.props.conf.maxSunburstLevelLength;
      }
      if (thirdLevel.length > this.props.conf.maxSunburstLevelLength) {
        thirdLevel.length = this.props.conf.maxSunburstLevelLength;
      }
      if (fourthLevel.length > this.props.conf.maxSunburstLevelLength) {
        fourthLevel.length = this.props.conf.maxSunburstLevelLength;
      }
      if (fifthLevel.length > this.props.conf.maxSunburstLevelLength) {
        fifthLevel.length = this.props.conf.maxSunburstLevelLength;
      }

      if (firstLevel.length === 0) {
        firstLevel = secondLevel;
        secondLevel = thirdLevel;
        thirdLevel = fourthLevel;
        fourthLevel = fifthLevel;
        fifthLevel = [];
      }
      if (secondLevel.length === 0) {
        secondLevel = thirdLevel;
        thirdLevel = fourthLevel;
        fourthLevel = fifthLevel;
        fifthLevel = [];
      }
      if (thirdLevel.length === 0) {
        thirdLevel = fourthLevel;
        fourthLevel = fifthLevel;
        fifthLevel = [];
      }
      if (fourthLevel.length === 0) {
        fourthLevel = fifthLevel;
        fifthLevel = [];
      }

      for (i = 0; i < fifthLevel.length; i++) {
        var mod = i % fourthLevel.length;
        fourthLevel[mod].children.push(fifthLevel[i]);
        fourthLevel[mod].bigness = '';
      }
      for (i = 0; i < fourthLevel.length; i++) {
        var _mod = i % thirdLevel.length;
        thirdLevel[_mod].children.push(fourthLevel[i]);
        thirdLevel[_mod].bigness = '';
      }
      for (i = 0; i < thirdLevel.length; i++) {
        var _mod2 = i % secondLevel.length;
        secondLevel[_mod2].children.push(thirdLevel[i]);
        secondLevel[_mod2].bigness = '';
      }
      for (i = 0; i < secondLevel.length; i++) {
        var _mod3 = i % firstLevel.length;
        firstLevel[_mod3].children.push(secondLevel[i]);
        firstLevel[_mod3].bigness = '';
      }

      var data = { name: timestamp[0], clr: colors[0], children: firstLevel, similarity: -1 };
      this.setState({ simhashData: data });
    }
  }]);
  return SunburstContainer;
}(react.Component);


SunburstContainer.propTypes = {

  timestamp: propTypes.string.isRequired,
  url: propTypes.string.isRequired,
  conf: propTypes.object.isRequired,
  fetchSnapshotCallback: propTypes.func,
  loader: propTypes.element
};

/* eslint-disable no-unused-vars */

export { DiffContainer, SunburstContainer };
//# sourceMappingURL=app.js.map
