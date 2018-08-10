var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

if (typeof global$1.setTimeout === 'function') ;
if (typeof global$1.clearTimeout === 'function') ;

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

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

var validateFormat = function validateFormat(format) {};

{
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
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

var invariant_1 = invariant;

var emptyObject = {};

{
  Object.freeze(emptyObject);
}

var emptyObject_1 = emptyObject;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

function D(a){for(var b=arguments.length-1,e="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=0;c<b;c++)e+="&args[]="+encodeURIComponent(arguments[c+1]);invariant_1(!1,"Minified React error #"+a+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",e);}
var E={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};function F(a,b,e){this.props=a;this.context=b;this.refs=emptyObject_1;this.updater=e||E;}F.prototype.isReactComponent={};F.prototype.setState=function(a,b){"object"!==typeof a&&"function"!==typeof a&&null!=a?D("85"):void 0;this.updater.enqueueSetState(this,a,b,"setState");};F.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function G(){}
G.prototype=F.prototype;function H(a,b,e){this.props=a;this.context=b;this.refs=emptyObject_1;this.updater=e||E;}var I=H.prototype=new G;I.constructor=H;objectAssign(I,F.prototype);I.isPureReactComponent=!0;

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction_1;

{
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
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

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var warning_1 = warning;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning$1 = function() {};

{
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};

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
          printWarning$1(
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

          printWarning$1(
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
var invariant = invariant_1;
var emptyObject = emptyObject_1;
var warning = warning_1;
var emptyFunction = emptyFunction_1;
var checkPropTypes = checkPropTypes_1;

// TODO: this is special because it gets imported during build.

var ReactVersion = '16.4.1';

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
var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_TIMEOUT_TYPE = hasSymbol ? Symbol.for('react.timeout') : 0xead1;

var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';

function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable === 'undefined') {
    return null;
  }
  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}
// Helps identify side effects in begin-phase lifecycle hooks and setState reducers:


// In some cases, StrictMode should also double-render lifecycles.
// This can be confusing for tests though,
// And it can be bad for performance in production.
// This feature flag can be used to control the behavior:


// To preserve the "Pause on caught exceptions" behavior of the debugger, we
// replay the begin phase of a failed component inside invokeGuardedCallback.


// Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:


// Warn about legacy context API


// Gather advanced timing metrics for Profiler subtrees.


// Only used in www builds.

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
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
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

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    var warningKey = componentName + '.' + callerName;
    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }
    warning(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
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

/**
 * Base class helpers for the updating state of a component.
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
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
  current: null
};

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
      warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
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
      warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
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
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
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
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var ReactDebugCurrentFrame = {};

{
  // Component that is being worked on
  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var impl = ReactDebugCurrentFrame.getCurrentStack;
    if (impl) {
      return impl();
    }
    return null;
  };
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
          !didWarnAboutMaps ? warning(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.%s', ReactDebugCurrentFrame.getStackAddendum()) : void 0;
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
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
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
  return traverseAllChildren(children, emptyFunction.thatReturnsNull, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
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
      !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warning(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
    }
  }

  var context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    _defaultValue: defaultValue,
    _currentValue: defaultValue,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue2: defaultValue,
    _changedBits: 0,
    _changedBits2: 0,
    // These are circular
    Provider: null,
    Consumer: null
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };
  context.Consumer = context;

  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

function forwardRef(render) {
  {
    !(typeof render === 'function') ? warning(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render) : void 0;

    if (render != null) {
      !(render.defaultProps == null && render.propTypes == null) ? warning(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
    }
  }

  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };
}

var describeComponentFrame = function (name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
};

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' ||
  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_ASYNC_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_TIMEOUT_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
}

function getComponentName(fiber) {
  var type = fiber.type;

  if (typeof type === 'function') {
    return type.displayName || type.name;
  }
  if (typeof type === 'string') {
    return type;
  }
  switch (type) {
    case REACT_ASYNC_MODE_TYPE:
      return 'AsyncMode';
    case REACT_CONTEXT_TYPE:
      return 'Context.Consumer';
    case REACT_FRAGMENT_TYPE:
      return 'ReactFragment';
    case REACT_PORTAL_TYPE:
      return 'ReactPortal';
    case REACT_PROFILER_TYPE:
      return 'Profiler(' + fiber.pendingProps.id + ')';
    case REACT_PROVIDER_TYPE:
      return 'Context.Provider';
    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';
    case REACT_TIMEOUT_TYPE:
      return 'Timeout';
  }
  if (typeof type === 'object' && type !== null) {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        var functionName = type.render.displayName || type.render.name || '';
        return functionName !== '' ? 'ForwardRef(' + functionName + ')' : 'ForwardRef';
    }
  }
  return null;
}

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

var currentlyValidatingElement = void 0;
var propTypesMisspellWarningShown = void 0;

var getDisplayName = function () {};
var getStackAddendum = function () {};

{
  currentlyValidatingElement = null;

  propTypesMisspellWarningShown = false;

  getDisplayName = function (element) {
    if (element == null) {
      return '#empty';
    } else if (typeof element === 'string' || typeof element === 'number') {
      return '#text';
    } else if (typeof element.type === 'string') {
      return element.type;
    }

    var type = element.type;
    if (type === REACT_FRAGMENT_TYPE) {
      return 'React.Fragment';
    } else if (typeof type === 'object' && type !== null && type.$$typeof === REACT_FORWARD_REF_TYPE) {
      var functionName = type.render.displayName || type.render.name || '';
      return functionName !== '' ? 'ForwardRef(' + functionName + ')' : 'ForwardRef';
    } else {
      return type.displayName || type.name || 'Unknown';
    }
  };

  getStackAddendum = function () {
    var stack = '';
    if (currentlyValidatingElement) {
      var name = getDisplayName(currentlyValidatingElement);
      var owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner));
    }
    stack += ReactDebugCurrentFrame.getStackAddendum() || '';
    return stack;
  };
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
    childOwner = ' It was passed a child from ' + getComponentName(element._owner) + '.';
  }

  currentlyValidatingElement = element;
  {
    warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, getStackAddendum());
  }
  currentlyValidatingElement = null;
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
    // Class or functional component
    name = type.displayName || type.name;
    propTypes = type.propTypes;
  } else if (typeof type === 'object' && type !== null && type.$$typeof === REACT_FORWARD_REF_TYPE) {
    // ForwardRef
    var functionName = type.render.displayName || type.render.name || '';
    name = functionName !== '' ? 'ForwardRef(' + functionName + ')' : 'ForwardRef';
    propTypes = type.propTypes;
  } else {
    return;
  }
  if (propTypes) {
    currentlyValidatingElement = element;
    checkPropTypes(propTypes, element.props, 'prop', name, getStackAddendum);
    currentlyValidatingElement = null;
  } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
    propTypesMisspellWarningShown = true;
    warning(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
  }
  if (typeof type.getDefaultProps === 'function') {
    !type.getDefaultProps.isReactClassApproved ? warning(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */
function validateFragmentProps(fragment) {
  currentlyValidatingElement = fragment;

  var keys = Object.keys(fragment.props);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (key !== 'children' && key !== 'key') {
      warning(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.%s', key, getStackAddendum());
      break;
    }
  }

  if (fragment.ref !== null) {
    warning(false, 'Invalid attribute `ref` supplied to `React.Fragment`.%s', getStackAddendum());
  }

  currentlyValidatingElement = null;
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

    info += getStackAddendum() || '';

    var typeString = void 0;
    if (type === null) {
      typeString = 'null';
    } else if (Array.isArray(type)) {
      typeString = 'array';
    } else {
      typeString = typeof type;
    }

    warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
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

  Fragment: REACT_FRAGMENT_TYPE,
  StrictMode: REACT_STRICT_MODE_TYPE,
  unstable_AsyncMode: REACT_ASYNC_MODE_TYPE,
  unstable_Profiler: REACT_PROFILER_TYPE,

  createElement: createElementWithValidation,
  cloneElement: cloneElementWithValidation,
  createFactory: createFactoryWithValidation,
  isValidElement: isValidElement,

  version: ReactVersion,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentOwner: ReactCurrentOwner,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: _assign
  }
};

{
  _assign(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
    // These should not be included in production.
    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
    // TODO: remove in React 17.0.
    ReactComponentTreeHook: {}
  });
}



var React$2 = Object.freeze({
	default: React
});

var React$3 = ( React$2 && React ) || React$2;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
var react = React$3.default ? React$3.default : React$3;

module.exports = react;
  })();
}
});

var react = createCommonjsModule(function (module) {

{
  module.exports = react_development;
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

var css = ".side-by-side-render,\n.inline-render {\n    display: flex;\n    flex: 1 0 auto;\n    height: 94vh;\n}\n\n.side-by-side-render > iframe,\n.inline-render > iframe {\n    border: 1px solid #ccc;\n    border-radius: 2px;\n    width: 100%;\n}\n\n.side-by-side-render > iframe:first-of-type {\n    margin-right: 0.5em;\n}\n\n.diff-view__alert.alert.alert-warning{\n    text-align: center;\n}\n\n.loading {\n    align-items: center;\n    background: transparent;\n    display: flex;\n    justify-content: center;\n}";
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

var Loading = function (_React$Component) {
  inherits(Loading, _React$Component);

  function Loading() {
    classCallCheck(this, Loading);
    return possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).apply(this, arguments));
  }

  createClass(Loading, [{
    key: "render",
    value: function render() {
      return react.createElement(
        "div",
        { className: "loading" },
        react.createElement("img", { src: this.props.waybackLoaderPath })
      );
    }
  }]);
  return Loading;
}(react.Component);

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
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._updateContent();
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

      return react.createElement('iframe', {
        sandbox: 'allow-forms allow-scripts',
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
          html: this.props.diffData.deletions || this.props.diffData.diff,
          baseUrl: this.props.page.url,
          transform: transformDeletions
        }),
        react.createElement(SandboxedHtml, {
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
      if (!this.state.diffData) {
        return react.createElement(Loading, { waybackLoaderPath: this.props.waybackLoaderPath });
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
          return react.createElement(SideBySideRenderedDiff, { diffData: this.state.diffData, page: this.props.page });
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
      return props.a.uuid === newProps.a.uuid && props.b.uuid === newProps.b.uuid && props.diffType === newProps.diffType;
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
      var _this2 = this;

      // TODO - this seems to be some sort of caching mechanism, would be smart to have this for diffs
      // const fromList = this.props.pages && this.props.pages.find(
      //     (page: Page) => page.uuid === pageId);
      // Promise.resolve(fromList || this.context.api.getDiff(pageId, aId, bId, changeDiffTypes[diffType]))
      this.setState({ diffData: null });
      if (!diffTypes[diffType].diffService) {
        return Promise.all([fetch(a.uri, { mode: 'cors' }), fetch(b.uri, { mode: 'cors' })]).then(function (_ref) {
          var _ref2 = slicedToArray(_ref, 2),
              rawA = _ref2[0],
              rawB = _ref2[1];

          return { raw: true, rawA: rawA, rawB: rawB };
        }).catch(function (error) {
          return error;
        }).then(function (data) {
          return _this2.setState({ diffData: data });
        });
      }
      var url = void 0;
      if (this.props.webMonitoringProcessingURL && this.props.webMonitoringProcessingPort) {
        url = this.props.webMonitoringProcessingURL + ':' + this.props.webMonitoringProcessingPort + '/';
      } else {
        url = 'http://localhost:8888/';
      }
      url += diffTypes[diffType].diffService + '?format=json&include=all&a=' + a + '&b=' + b;
      fetch(url).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this2.setState({
          diffData: data
        });
      });
    }
  }]);
  return DiffView;
}(react.Component);

var css$1 = "#diff-select{\n    margin-bottom: 0.7em;\n}\n\n.timestamp-container-view{\n    display: flex;\n    justify-content: space-between;\n}\n\n#diff-footer{\n    text-align: center;\n}\n\nred-diff-footer{\n    background-color: #fbb6c2;\n}\n\ngreen-diff-footer{\n    background-color: #d4fcbc;\n}";
styleInject(css$1);

var supportedDiffTypes = [['RAW_SIDE_BY_SIDE', 'Side-by-side Content'], ['HIGHLIGHTED_TEXT', 'Highlighted Text'], ['HIGHLIGHTED_SOURCE', 'Highlighted Source'], ['HIGHLIGHTED_RENDERED', 'Highlighted Rendered'], ['SIDE_BY_SIDE_RENDERED', 'Side-by-Side Rendered'], ['OUTGOING_LINKS', 'Outgoing Links'], ['CHANGES_ONLY_TEXT', 'Changes Only Text'], ['CHANGES_ONLY_SOURCE', 'Changes Only Source']];

/**
 * Display a diffing method selector
 *
 * @class TimestampHeader
 * @extends {React.Component}
 */

var DiffingMethodSelector = function (_React$Component) {
  inherits(DiffingMethodSelector, _React$Component);

  function DiffingMethodSelector(props) {
    classCallCheck(this, DiffingMethodSelector);

    var _this = possibleConstructorReturn(this, (DiffingMethodSelector.__proto__ || Object.getPrototypeOf(DiffingMethodSelector)).call(this, props));

    _this.state = { diffMethods: supportedDiffTypes,
      selectedMethod: supportedDiffTypes[0] };
    _this.props.diffMethodSelectorCallback(supportedDiffTypes[0]);
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  createClass(DiffingMethodSelector, [{
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({ selectedMethod: event.target.value.split(',') });
      this.props.diffMethodSelectorCallback(event.target.value.split(','));
    }
  }, {
    key: 'render',
    value: function render() {
      return react.createElement(
        'select',
        { id: 'diff-select', onChange: this.handleChange },
        this.state.diffMethods.map(function (val, index) {
          return react.createElement(
            'option',
            { key: index, value: val },
            val[1]
          );
        })
      );
    }
  }]);
  return DiffingMethodSelector;
}(react.Component);

/**
 * Display a timestamp selector
 *
 * @class TimestampHeader
 * @extends {React.Component}
 */

var TimestampHeader = function (_React$Component) {
  inherits(TimestampHeader, _React$Component);

  function TimestampHeader(props) {
    classCallCheck(this, TimestampHeader);

    var _this = possibleConstructorReturn(this, (TimestampHeader.__proto__ || Object.getPrototypeOf(TimestampHeader)).call(this, props));

    _this.state = {
      cdxData: false,
      showDiff: false
    };

    _this.handleLeftTimestampChange = _this.handleLeftTimestampChange.bind(_this);

    _this.handleRightTimestampChange = _this.handleRightTimestampChange.bind(_this);

    _this.restartPressed = _this.restartPressed.bind(_this);

    _this.showDiffs = _this.showDiffs.bind(_this);

    return _this;
  }

  createClass(TimestampHeader, [{
    key: 'handleRightTimestampChange',
    value: function handleRightTimestampChange() {
      var selectedDigest = this.state.cdxData[document.getElementById('timestamp-select-right').selectedIndex][1];
      var allowedSnapshots = this.state.cdxData;
      allowedSnapshots = allowedSnapshots.filter(function (hash) {
        return hash[1] !== selectedDigest;
      });
      this.setState({
        leftSnaps: allowedSnapshots,
        leftSnapElements: this.prepareOptionElements(allowedSnapshots)
      });
    }
  }, {
    key: 'handleLeftTimestampChange',
    value: function handleLeftTimestampChange() {
      var selectedDigest = this.state.cdxData[document.getElementById('timestamp-select-left').selectedIndex][1];
      var allowedSnapshots = this.state.cdxData;
      allowedSnapshots = allowedSnapshots.filter(function (hash) {
        return hash[1] !== selectedDigest;
      });
      this.setState({
        rightSnaps: allowedSnapshots,
        rightSnapElements: this.prepareOptionElements(allowedSnapshots)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.showDiff) {
        return react.createElement(
          'div',
          { className: 'timestamp-header-view' },
          this.showTimestampSelector(),
          this.exportParams()
        );
      }
      if (this.state.cdxData) {
        return react.createElement(
          'div',
          { className: 'timestamp-header-view' },
          this.showTimestampSelector()
        );
      }
      return react.createElement(
        'div',
        null,
        react.createElement(Loading, { waybackLoaderPath: this.props.waybackLoaderPath }),
        this.widgetRender()
      );
    }
  }, {
    key: 'exportParams',
    value: function exportParams() {
      var timestampA = document.getElementById('timestamp-select-left').value;
      var timestampB = document.getElementById('timestamp-select-right').value;
      window.location.href = '/diff/' + timestampA + '/' + timestampB + '/' + this.props.site;
    }
  }, {
    key: 'widgetRender',
    value: function widgetRender() {
      var _this2 = this;

      if (this.props.fetchCallback) {
        this.props.fetchCallback().then(function (data) {
          _this2.prepareData(data);
          if (!_this2.props.isInitial) {
            _this2.selectValues();
          }
        });
      } else {
        var url;
        if (this.props.limit) {
          url = 'http://web.archive.org/cdx/search?url=' + this.props.site + '/&status=200&limit=' + this.props.limit + '&fl=timestamp,digest&output=json';
        } else {
          url = 'http://web.archive.org/cdx/search?url=' + this.props.site + '/&status=200&fl=timestamp,digest&output=json';
        }
        fetch(url).then(function (response) {
          return response.json();
        }).then(function (data) {
          _this2.prepareData(data);
          if (!_this2.props.isInitial) {
            _this2.selectValues();
          }
        });
      }
    }
  }, {
    key: 'prepareData',
    value: function prepareData(data) {
      data.shift();
      this.setState({
        cdxData: data,
        leftSnaps: data,
        rightSnaps: data,
        leftSnapElements: this.prepareOptionElements(data),
        rightSnapElements: this.prepareOptionElements(data)
      });
    }
  }, {
    key: 'prepareOptionElements',
    value: function prepareOptionElements(data) {
      var initialSnapshots = [];
      if (data.length > 0) {
        var yearGroup = this.getYear(data[0][0]);
        initialSnapshots.push(react.createElement('optgroup', { key: -1, label: yearGroup }));
      }

      for (var i = 0; i < data.length; i++) {
        var utcTime = this.getUTCDateFormat(data[i][0]);
        var year = this.getYear(data[i][0]);
        if (year > yearGroup) {
          yearGroup = year;
          initialSnapshots.push(react.createElement('optgroup', { key: -i + 2, label: yearGroup }));
        }
        initialSnapshots.push(react.createElement(
          'option',
          { key: i, value: data[i][0] },
          utcTime
        ));
      }
      return initialSnapshots;
    }
  }, {
    key: 'getUTCDateFormat',
    value: function getUTCDateFormat(date) {
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
    key: 'getYear',
    value: function getYear(date) {
      return parseInt(date.substring(0, 4), 10);
    }
  }, {
    key: 'restartPressed',
    value: function restartPressed() {
      var initialData = this.state.cdxData;
      this.setState({
        leftSnaps: initialData,
        rightSnaps: initialData,
        leftSnapElements: this.prepareOptionElements(initialData),
        rightSnapElements: this.prepareOptionElements(initialData)
      });
    }
  }, {
    key: 'showTimestampSelector',
    value: function showTimestampSelector() {
      return react.createElement(
        'div',
        { className: 'timestamp-container-view' },
        react.createElement(
          'select',
          { id: 'timestamp-select-left', onChange: this.handleLeftTimestampChange },
          this.state.leftSnapElements
        ),
        react.createElement(
          'button',
          { id: 'show-diff-btn', onClick: this.showDiffs },
          'Show differences'
        ),
        react.createElement(
          'button',
          { id: 'restart-btn', onClick: this.restartPressed },
          'Restart'
        ),
        react.createElement(
          'select',
          { id: 'timestamp-select-right', onChange: this.handleRightTimestampChange },
          this.state.rightSnapElements
        )
      );
    }
  }, {
    key: 'showDiffs',
    value: function showDiffs() {
      this.setState({ showDiff: true });
    }
  }, {
    key: 'selectValues',
    value: function selectValues() {
      document.getElementById('timestamp-select-left').value = this.props.timestampA;
      document.getElementById('timestamp-select-right').value = this.props.timestampB;
    }
  }]);
  return TimestampHeader;
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
      return react.createElement(
        'div',
        null,
        react.createElement(
          'p',
          { id: 'diff-footer' },
          react.createElement(
            'red-diff-footer',
            null,
            'Red'
          ),
          ' indicates content deletion. ',
          react.createElement(
            'green-diff-footer',
            null,
            'Green'
          ),
          ' indicates content addition'
        )
      );
    }
  }]);
  return DiffFooter;
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

    _this.state = { timestampsValidated: false };

    _this.prepareDiffView = _this.prepareDiffView.bind(_this);

    return _this;
  }

  createClass(DiffContainer, [{
    key: 'render',
    value: function render() {

      if (this.props.timestampA && this.props.timestampB) {
        return react.createElement(
          'div',
          { className: 'diffcontainer-view' },
          react.createElement(TimestampHeader, { site: this.props.site, timestampA: this.props.timestampA, limit: this.props.limit,
            timestampB: this.props.timestampB, isInitial: false, waybackLoaderPath: this.props.waybackLoaderPath,
            fetchCallback: this.props.fetchCallback }),
          this.prepareDiffView(),
          react.createElement(DiffFooter, null)
        );
      }
      return react.createElement(
        'div',
        { className: 'diffcontainer-view' },
        react.createElement(TimestampHeader, { isInitial: true, timestampA: this.props.timestampA, limit: this.props.limit,
          timestampB: this.props.timestampB, site: this.props.site, waybackLoaderPath: this.props.waybackLoaderPath,
          fetchCallback: this.props.fetchCallback })
      );
    }
  }, {
    key: 'prepareDiffView',
    value: function prepareDiffView() {
      var urlA = 'http://web.archive.org/web/' + this.props.timestampA + '/' + this.props.site;
      var urlB = 'http://web.archive.org/web/' + this.props.timestampB + '/' + this.props.site;

      if (this.state.timestampsValidated) {
        return react.createElement(DiffView, { webMonitoringProcessingURL: this.props.webMonitoringProcessingURL,
          webMonitoringProcessingPort: this.props.webMonitoringProcessingPort, page: { url: this.props.site },
          diffType: 'SIDE_BY_SIDE_RENDERED', a: urlA, b: urlB, waybackLoaderPath: this.props.waybackLoaderPath });
      } else {
        this.checkTimestamps(urlA, urlB);
      }
    }
  }, {
    key: 'checkTimestamps',
    value: function checkTimestamps(urlA, urlB) {
      var _this2 = this;

      fetch(urlA, { redirect: 'follow' }).then(function (response) {
        urlA = response.url;
        var fetchedTimestampA = urlA.split('/')[4];
        fetch(urlB, { redirect: 'follow' }).then(function (response) {
          urlB = response.url;
          var fetchedTimestampB = urlB.split('/')[4];

          if (_this2.props.timestampA !== fetchedTimestampA || _this2.props.timestampB !== fetchedTimestampB) {
            var tempURL = urlA.split('/');
            var url = '';
            for (var i = 7; i <= tempURL.length - 1; i++) {
              url = url + tempURL[i];
            }
            window.location.href = '/diff/' + fetchedTimestampA + '/' + fetchedTimestampB + '/' + url;
          } else {
            _this2.setState({ timestampsValidated: true });
          }
        });
      });
    }
  }]);
  return DiffContainer;
}(react.Component);

/*eslint-disable no-unused-vars*/

export { DiffContainer };
//# sourceMappingURL=app.js.map
