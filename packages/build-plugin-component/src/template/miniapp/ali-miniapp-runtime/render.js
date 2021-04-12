/*!
 * miniapp-render v2.0.0
 * (c) 2019-2020 Rax Team
 * Released under the BSD-3-Clause License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = global || self, global['miniapp-render'] = factory());
}(this, (function () {
  'use strict';

  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var setPrototypeOf = createCommonjsModule(function (module) {
    function _setPrototypeOf(o, p) {
      module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    module.exports = _setPrototypeOf;
  });

  function _isNativeReflectConstruct() {
    if ( typeof Reflect === "undefined" || !Reflect.construct ) return false;
    if ( Reflect.construct.sham ) return false;
    if ( typeof Proxy === "function" ) return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }

  var isNativeReflectConstruct = _isNativeReflectConstruct;

  var construct = createCommonjsModule(function (module) {
    function _construct(Parent, args, Class) {
      if ( isNativeReflectConstruct() ) {
        module.exports = _construct = Reflect.construct;
      } else {
        module.exports = _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if ( Class ) setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }

      return _construct.apply(null, arguments);
    }

    module.exports = _construct;
  });

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ( "value" in descriptor ) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if ( protoProps ) _defineProperties(Constructor.prototype, protoProps);
    if ( staticProps ) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var inheritsLoose = _inheritsLoose;

  var _extends_1 = createCommonjsModule(function (module) {
    function _extends() {
      module.exports = _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if ( Object.prototype.hasOwnProperty.call(source, key) ) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      return _extends.apply(this, arguments);
    }

    module.exports = _extends;
  });

  /**
   * Check the relationships between nodes
   */
  function checkRelation(node1, node2) {
    if ( node1 === node2 ) return true;

    while (node1) {
      if ( node1 === node2 ) return true;
      node1 = node1.parentNode;
    }

    return false;
  }

  var Event = /*#__PURE__*/function () {
    function Event(options) {
      var _this = this;

      this.$_name = options.name.toLowerCase();
      this.$_target = options.target;
      this.$_timeStamp = options.timeStamp || Date.now();
      this.$_currentTarget = options.currentTarget || options.target;
      this.$_eventPhase = options.eventPhase || Event.NONE;
      this.$_detail = options.detail || null;
      this.$_immediateStop = false;
      this.$_canBubble = true;
      this.$_bubbles = options.bubbles || false;
      this.$_touches = null;
      this.$_targetTouches = null;
      this.$_changedTouches = null;
      this.$_cancelable = false; // Add fields

      var extra = options.$$extra;

      if ( extra ) {
        Object.keys(extra)
          .forEach(function (key) {
            _this[key] = extra[key];
          });
      } // Handle touches


      if ( options.touches && options.touches.length ) {
        this.$_touches = options.touches.map(function (touch) {
          return _extends_1({}, touch, {
            target: options.target,
          });
        });
        this.$$checkTargetTouches();
      } // Handle changedTouches


      if ( options.changedTouches && options.changedTouches.length ) {
        this.$_changedTouches = options.changedTouches.map(function (touch) {
          return _extends_1({}, touch, {
            target: options.target,
          });
        });
      }
    } // Whether the event is stopped immediately


    var _proto = Event.prototype;

    // Set target
    _proto.$$setTarget = function $$setTarget(target) {
      this.$_target = target;
    } // Set currentTarget
    ;

    _proto.$$setCurrentTarget = function $$setCurrentTarget(currentTarget) {
      this.$_currentTarget = currentTarget;
      this.$$checkTargetTouches();
    } // Set the stage of the event
    ;

    _proto.$$setEventPhase = function $$setEventPhase(eventPhase) {
      this.$_eventPhase = eventPhase;
    } // Check targetTouches
    ;

    _proto.$$checkTargetTouches = function $$checkTargetTouches() {
      var _this2 = this;

      if ( this.$_touches && this.$_touches.length ) {
        this.$_targetTouches = this.$_touches.filter(function (touch) {
          return checkRelation(touch.target, _this2.$_currentTarget);
        });
      }
    };

    _proto.preventDefault = function preventDefault() {
      this.$_cancelable = true;
    };

    _proto.stopPropagation = function stopPropagation() {
      if ( this.eventPhase === Event.NONE ) return;
      this.$_canBubble = false;
    };

    _proto.stopImmediatePropagation = function stopImmediatePropagation() {
      if ( this.eventPhase === Event.NONE ) return;
      this.$_immediateStop = true;
      this.$_canBubble = false;
    };

    _proto.initEvent = function initEvent(name, bubbles) {
      if ( name === void 0 ) {
        name = '';
      }

      if ( typeof name !== 'string' ) return;
      this.$_name = name.toLowerCase();
      this.$_bubbles = bubbles === undefined ? this.$_bubbles : !!bubbles;
    };

    createClass(Event, [{
      key: "$$immediateStop",
      get: function get() {
        return this.$_immediateStop;
      }, // Whether can bubble

    }, {
      key: "$$canBubble",
      get: function get() {
        return this.$_canBubble;
      },
    }, {
      key: "bubbles",
      get: function get() {
        return this.$_bubbles;
      },
    }, {
      key: "cancelable",
      get: function get() {
        return this.$_cancelable;
      },
    }, {
      key: "target",
      get: function get() {
        return this.$_target;
      },
    }, {
      key: "currentTarget",
      get: function get() {
        return this.$_currentTarget;
      },
    }, {
      key: "eventPhase",
      get: function get() {
        return this.$_eventPhase;
      },
    }, {
      key: "type",
      get: function get() {
        return this.$_name;
      },
    }, {
      key: "timeStamp",
      get: function get() {
        return this.$_timeStamp;
      },
    }, {
      key: "touches",
      get: function get() {
        return this.$_touches;
      },
    }, {
      key: "targetTouches",
      get: function get() {
        return this.$_targetTouches;
      },
    }, {
      key: "changedTouches",
      get: function get() {
        return this.$_changedTouches;
      },
    }, {
      key: "detail",
      set: function set(value) {
        this.$_detail = value;
      },
      get: function get() {
        return this.$_detail;
      },
    }]);

    return Event;
  }(); // Static props


  Event.NONE = 0;
  Event.CAPTURING_PHASE = 1;
  Event.AT_TARGET = 2;
  Event.BUBBLING_PHASE = 3;

  var CustomEvent = /*#__PURE__*/function (_Event) {
    inheritsLoose(CustomEvent, _Event);

    function CustomEvent(name, options) {
      if ( name === void 0 ) {
        name = '';
      }

      if ( options === void 0 ) {
        options = {};
      }

      return _Event.call(this, _extends_1({
        name: name,
      }, options)) || this;
    }

    return CustomEvent;
  }(Event);

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it;
    if ( typeof Symbol === "undefined" || o[Symbol.iterator] == null ) {
      if ( Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number" ) {
        if ( it ) o = it;
        var i = 0;
        return function () {
          if ( i >= o.length ) return { done: true };
          return {
            done: false,
            value: o[i++],
          };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    it = o[Symbol.iterator]();
    return it.next.bind(it);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if ( !o ) return;
    if ( typeof o === "string" ) return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o)
      .slice(8, -1);
    if ( n === "Object" && o.constructor ) n = o.constructor.name;
    if ( n === "Map" || n === "Set" ) return Array.from(o);
    if ( n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if ( len == null || len > arr.length ) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }

  /**
   * Compare touch list
   */

  function compareTouchList(a, b) {
    if ( a.length !== b.length ) return false;

    for (var i, len = a.length; i < len; i++) {
      var aItem = a[i];
      var bItem = b[i];
      if ( aItem.identifier !== bItem.identifier ) return false;
      if ( aItem.pageX !== bItem.pageX || aItem.pageY !== bItem.pageY || aItem.clientX !== bItem.clientX || aItem.clientY !== bItem.clientY ) return false;
    }

    return true;
  }

  /**
   * Compare event detail
   * @param {object} a
   * @param {object} b
   */


  function compareDetail(a, b) {
    if ( a.pageX === b.pageX && a.pageY === b.pageY && a.clientX === b.clientX && a.clientY === b.clientY ) {
      return true;
    }

    return false;
  }

  /**
   *
   * @param {string} property 'touches' or 'changedTouches' or 'detail'
   * @param {object} last last event
   * @param {object} now current event
   */


  function compareEventProperty(property, last, now) {
    var compareFn = property === 'detail' ? compareDetail : compareTouchList;

    if ( last[property] && now[property] && !compareFn(last[property], now[property]) ) {
      // property are different
      return true;
    }

    if ( !last[property] && now[property] || last[property] && !now[property] ) {
      // One of them  doesn't have property
      return true;
    }

    return false;
  }

  function compareEventInAlipay(last, now) {
    // In Alipay, timestamps of the same event may have slight differences when bubbling
    // Set the D-value threshold to 10
    if ( !last || now.timeStamp - last.timeStamp > 10 ) {
      return true;
    } // Tap event has no touches or changedTouches in Alipay, so use detail property to check


    return compareEventProperty('detail', last, now) || compareEventProperty('touches', last, now) || compareEventProperty('changedTouches', last, now);
  }

  var EventTarget = /*#__PURE__*/function () {
    function EventTarget() {
      // Supplement the instance's properties for the 'XXX' in XXX judgment
      this.ontouchstart = null;
      this.ontouchmove = null;
      this.ontouchend = null;
      this.ontouchcancel = null;
      this.oninput = null;
      this.onfocus = null;
      this.onblur = null;
      this.onchange = null; // Logs the triggered miniapp events

      this.$_miniappEvent = null;
      this.__eventHandlerMap = new Map();
    } // Destroy instance


    var _proto = EventTarget.prototype;

    _proto.$$destroy = function $$destroy() {
      var _this = this;

      Object.keys(this)
        .forEach(function (key) {
          // Handles properties beginning with on
          if ( key.indexOf('on') === 0 ) _this[key] = null; // Handles private properties that are hung externally

          if ( key[0] === '_' ) _this[key] = null;
          if ( key[0] === '$' && key[1] !== '_' && key[1] !== '$' ) _this[key] = null;
        });
      this.$_miniappEvent = null;
      this.__eventHandlerMap = null;
    } // Trigger event capture, bubble flow
    ;

    EventTarget.$$process = function $$process(target, eventName, miniprogramEvent, extra, callback) {
      var event;

      if ( eventName instanceof CustomEvent || eventName instanceof Event ) {
        // The event object is passed in
        event = eventName;
        eventName = event.type;
      }

      eventName = eventName.toLowerCase();
      var path = [target];
      var parentNode = target.parentNode;

      while (parentNode && parentNode.ownerDocument) {
        path.push(parentNode);
        parentNode = parentNode.parentNode;
      }

      if ( !event ) {
        // Special handling here, not directly return the applet's event object
        event = new Event({
          name: eventName,
          target: target,
          detail: miniprogramEvent.detail,
          timeStamp: miniprogramEvent.timeStamp,
          touches: miniprogramEvent.touches,
          changedTouches: miniprogramEvent.changedTouches,
          bubbles: true,
          $$extra: extra,
        });
      } // Capture


      for (var i = path.length - 1; i >= 0; i--) {
        var currentTarget = path[i]; // Determine if the bubble is over

        if ( !event.$$canBubble ) break;
        if ( currentTarget === target ) continue;
        event.$$setCurrentTarget(currentTarget);
        event.$$setEventPhase(Event.CAPTURING_PHASE);
        currentTarget.$$trigger(eventName, {
          event: event,
          isCapture: true,
        });
        if ( callback ) callback(currentTarget, event, true);
      }

      if ( event.$$canBubble ) {
        event.$$setCurrentTarget(target);
        event.$$setEventPhase(Event.AT_TARGET); // Both capture and bubble phase listening events are triggered

        target.$$trigger(eventName, {
          event: event,
          isCapture: true,
          isTarget: true,
        });
        if ( callback ) callback(target, event, true);
        target.$$trigger(eventName, {
          event: event,
          isCapture: false,
          isTarget: true,
        });
        if ( callback ) callback(target, event, false);
      }

      if ( event.bubbles ) {
        for (var _iterator = _createForOfIteratorHelperLoose(path), _step; !(_step = _iterator()).done;) {
          var _currentTarget = _step.value;
          // Determine if the bubble is over
          if ( !event.$$canBubble ) break;
          if ( _currentTarget === target ) continue;
          event.$$setCurrentTarget(_currentTarget);
          event.$$setEventPhase(Event.BUBBLING_PHASE);

          _currentTarget.$$trigger(eventName, {
            event: event,
            isCapture: false,
          });

          if ( callback ) callback(_currentTarget, event, false);
        }
      } // Reset event


      event.$$setCurrentTarget(null);
      event.$$setEventPhase(Event.NONE);
      return event;
    } // Get handlers
    ;

    _proto.__getHandles = function __getHandles(eventName, isCapture, isInit) {
      if ( isInit ) {
        var handlerObj = this.__eventHandlerMap.get(eventName);

        if ( !handlerObj ) {
          this.__eventHandlerMap.set(eventName, handlerObj = {});
        }

        handlerObj.capture = handlerObj.capture || [];
        handlerObj.bubble = handlerObj.bubble || [];
        return isCapture ? handlerObj.capture : handlerObj.bubble;
      } else {
        var _handlerObj = this.__eventHandlerMap.get(eventName);

        if ( !_handlerObj ) return null;
        return isCapture ? _handlerObj.capture : _handlerObj.bubble;
      }
    } // Trigger node event
    ;

    _proto.$$trigger = function $$trigger(eventName, _temp) {
      var _this2 = this;

      var _ref = _temp === void 0 ? {} : _temp,
        event = _ref.event,
        _ref$args = _ref.args,
        args = _ref$args === void 0 ? [] : _ref$args,
        isCapture = _ref.isCapture,
        isTarget = _ref.isTarget;

      eventName = eventName.toLowerCase();
      var handlers = this.__getHandles(eventName, isCapture) || [];

      if ( eventName === 'onshareappmessage' ) {
        if ( handlers.length > 1 ) {
          console.warn('onShareAppMessage can only be listened with one callback function.');
        }

        return handlers[0] && handlers[0].call(this || null, event);
      }

      var onEventName = "on" + eventName;

      if ( (!isCapture || !isTarget) && typeof this[onEventName] === 'function' ) {
        // The event that triggers the onXXX binding
        if ( event && event.$$immediateStop ) return;

        try {
          var _this$onEventName;

          (_this$onEventName = this[onEventName]).call.apply(_this$onEventName, [this || null, event].concat(args));
        } catch (err) {
          console.error(err);
        }
      }

      if ( handlers && handlers.length ) {
        // Trigger addEventListener binded events
        handlers.forEach(function (handler) {
          if ( event && event.$$immediateStop ) return;

          try {
            var processedArgs = event ? [event].concat(args) : [].concat(args);
            handler.call.apply(handler, [_this2 || null].concat(processedArgs));
          } catch (err) {
            console.error(err);
          }
        });
      }
    } // Check if the event can be triggered
    ;

    _proto.__checkEvent = function __checkEvent(miniprogramEvent) {
      var last = this.$_miniappEvent;
      var now = miniprogramEvent;
      var flag = false;

      {
        flag = compareEventInAlipay(last, now);
      }

      if ( flag ) this.$_miniappEvent = now;
      return flag;
    } // Empty all handles to an event
    ;

    _proto.$$clearEvent = function $$clearEvent(eventName, isCapture) {
      if ( isCapture === void 0 ) {
        isCapture = false;
      }

      if ( typeof eventName !== 'string' ) return;
      eventName = eventName.toLowerCase();

      var handlers = this.__getHandles(eventName, isCapture);

      if ( handlers && handlers.length ) handlers.length = 0;
    };

    _proto.addEventListener = function addEventListener(eventName, handler, options) {
      if ( typeof eventName !== 'string' || typeof handler !== 'function' ) return;
      var isCapture = false;
      if ( typeof options === 'boolean' ) isCapture = options; else if ( typeof options === 'object' ) isCapture = options.capture;
      eventName = eventName.toLowerCase();

      var handlers = this.__getHandles(eventName, isCapture, true);

      handlers.push(handler);
    };

    _proto.removeEventListener = function removeEventListener(eventName, handler, isCapture) {
      if ( isCapture === void 0 ) {
        isCapture = false;
      }

      if ( typeof eventName !== 'string' || typeof handler !== 'function' ) return;
      eventName = eventName.toLowerCase();

      var handlers = this.__getHandles(eventName, isCapture);

      if ( handlers && handlers.length ) handlers.splice(handlers.indexOf(handler), 1);
    };

    _proto.dispatchEvent = function dispatchEvent(evt) {
      if ( evt instanceof CustomEvent ) {
        EventTarget.$$process(this, evt);
      } // preventDefault is not supported, so it always returns true


      return true;
    };

    return EventTarget;
  }();

  /**
   * Hump to hyphen
   */
  function toDash(str) {
    return str.replace(/[A-Z]/g, function (all) {
      return "-" + all.toLowerCase();
    });
  }

  /**
   * Hyphen to hump
   */


  function toCamel(str) {
    return str.replace(/-([a-zA-Z])/g, function (all, $1) {
      return $1.toUpperCase();
    });
  }

  /**
   * Get unique id
   */


  var seed = 0;

  function getId() {
    return seed++;
  }

  /**
   * Throttling, which is called only once in a synchronous flow
   */


  var waitFuncSet = new Set();

  function throttle(func) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if ( waitFuncSet.has(func) ) return;
      waitFuncSet.add(func);
      Promise.resolve()
        .then(function () {
          if ( waitFuncSet.has(func) ) {
            waitFuncSet.delete(func);
            func.apply(void 0, args);
          }
        })
        .catch(function () {// ignore
        });
    };
  }

  /**
   * Clear throttling cache
   */


  function flushThrottleCache() {
    waitFuncSet.forEach(function (waitFunc) {
      return waitFunc && waitFunc();
    });
    waitFuncSet.clear();
  }

  var tool = {
    toDash: toDash,
    toCamel: toCamel,
    getId: getId,
    throttle: throttle,
    flushThrottleCache: flushThrottleCache,
  };

  var pageMap = {};
  var routeMap = new Map();
  var nodeIdMap = new Map();
  var config = {};
  var windowMap = new Map();
  var elementsCache = [];
  var elementMethodsCache = new Map(); // Init

  function init(pageId, options) {
    pageMap[pageId] = options.document;
  } // Destroy


  function destroy(pageId) {
    delete pageMap[pageId];
  }

  /**
   * Get document by pageId
   */


  function getDocument(pageId) {
    return pageMap[pageId];
  } // Set window


  function setWindow(packageName, value) {
    if ( packageName === void 0 ) {
      packageName = 'main';
    }

    windowMap.set(packageName, value);
  }

  /**
   * Get window
   */


  function getWindow(packageName) {
    if ( packageName === void 0 ) {
      packageName = 'main';
    }

    return windowMap.get(packageName);
  }

  function hasWindow(packageName) {
    if ( packageName === void 0 ) {
      packageName = 'main';
    }

    return windowMap.has(packageName);
  }

  /**
   * Save domNode map
   */


  function setNode(nodeId, domNode) {
    if ( domNode === void 0 ) {
      domNode = null;
    }

    nodeIdMap.set(nodeId, domNode);
  } // Get the domNode by nodeId


  function getNode(nodeId) {
    return nodeIdMap.get(nodeId);
  }

  /**
   * Get all nodes
   */


  function getAllNodes() {
    return nodeIdMap;
  } // Store global config


  function setConfig(value) {
    config = value;
  } // Get global config


  function getConfig() {
    return config;
  }

  function getRouteId(route) {
    var routeId = routeMap.get(route) || 0;
    routeMap.set(route, routeId + 1);
    return routeId + 1;
  }

  function setElementInstance(instance) {
    elementsCache.push(instance);

    if ( elementMethodsCache.size > 0 ) {
      elementMethodsCache.forEach(function (methodFn, methodName) {
        if ( !instance[methodName] ) {
          instance[methodName] = methodFn;
        }
      });
    }
  }

  function getElementInstance() {
    return elementsCache;
  }

  function setElementMethods(methodName, methodFn) {
    if ( elementsCache.length > 0 ) {
      elementsCache.forEach(function (element) {
        element[methodName] = methodFn;
      });
    }

    elementMethodsCache.set(methodName, methodFn);
  }

  var cache = {
    init: init,
    destroy: destroy,
    getDocument: getDocument,
    setWindow: setWindow,
    getWindow: getWindow,
    hasWindow: hasWindow,
    setNode: setNode,
    getNode: getNode,
    getAllNodes: getAllNodes,
    setConfig: setConfig,
    getConfig: getConfig,
    getRouteId: getRouteId,
    setElementInstance: setElementInstance,
    getElementInstance: getElementInstance,
    setElementMethods: setElementMethods,
  };

  var NATIVE_EVENTS_LIST = ['onBack', 'onKeyboardHeight', 'onOptionMenuClick', 'onPopMenuClick', 'onPullDownRefresh', 'onPullIntercept', 'onTitleClick', 'onTabItemTap', 'beforeTabItemTap', 'onResize'];
  var BUILTIN_COMPONENT_LIST = new Set(['movable-view', 'cover-image', 'cover-view', 'movable-area', 'scroll-view', 'swiper', 'swiper-item', 'view', 'icon', 'progress', 'rich-text', 'text', 'button', 'checkbox', 'checkbox-group', 'editor', 'form', 'input', 'label', 'picker', 'picker-view', 'picker-view-column', 'radio', 'radio-group', 'slider', 'switch', 'textarea', 'functional-page-navigator', 'navigator', 'audio', 'camera', 'image', 'live-player', 'live-pusher', 'video', 'map', 'canvas', 'ad', 'official-account', 'open-data', 'web-view', 'open-avatar', 'lottie']);
  var BODY_NODE_ID = 'e-body';

  var Node = /*#__PURE__*/function (_EventTarget) {
    inheritsLoose(Node, _EventTarget);

    function Node(options) {
      var _this;

      _this = _EventTarget.call(this) || this; // unique node id

      _this.__nodeId = "n_" + tool.getId();
      _this.$_type = options.type;
      _this.parentNode = null;
      _this.__ownerDocument = options.document;
      return _this;
    }

    var _proto = Node.prototype;

    /**
     * Override parent class $$destroy method
     */
    _proto.$$destroy = function $$destroy() {
      _EventTarget.prototype.$$destroy.call(this);

      this.__nodeId = null;
      this.$_type = null;
      this.parentNode = null;
      this.__rendered = false;
      this.__ownerDocument = null;
    };

    _proto._isRendered = function _isRendered() {
      if ( this.__rendered ) return true;

      if ( this.parentNode ) {
        this.__rendered = this.parentNode._isRendered();
      }

      return this.__rendered;
    };

    _proto.hasChildNodes = function hasChildNodes() {
      return false;
    };

    _proto.remove = function remove() {
      if ( !this.parentNode || !this.parentNode.removeChild ) return this;
      return this.parentNode.removeChild(this);
    };

    createClass(Node, [{
      key: "__pageId",
      get: function get() {
        return this.__ownerDocument.__pageId;
      },
    }, {
      key: "ownerDocument",
      get: function get() {
        return this.__ownerDocument;
      },
    }, {
      key: "_path",
      get: function get() {
        if ( this.parentNode !== null ) {
          var index = '[' + this.parentNode.childNodes.indexOf(this) + ']';
          return this.parentNode._path + ".children." + index;
        }

        return '';
      },
    }, {
      key: "_root",
      get: function get() {
        return cache.getNode(BODY_NODE_ID + "-" + this.__pageId);
      },
    }, {
      key: "nodeValue",
      get: function get() {
        return null;
      },
    }, {
      key: "previousSibling",
      get: function get() {
        var childNodes = this.parentNode && this.parentNode.childNodes || [];
        var index = childNodes.indexOf(this);

        if ( index > 0 ) {
          return childNodes[index - 1];
        }

        return null;
      },
    }, {
      key: "previousElementSibling",
      get: function get() {
        var childNodes = this.parentNode && this.parentNode.childNodes || [];
        var index = childNodes.indexOf(this);

        if ( index > 0 ) {
          for (var i = index - 1; i >= 0; i--) {
            if ( childNodes[i].nodeType === Node.ELEMENT_NODE ) {
              return childNodes[i];
            }
          }
        }

        return null;
      },
    }, {
      key: "nextSibling",
      get: function get() {
        var childNodes = this.parentNode && this.parentNode.childNodes || [];
        var index = childNodes.indexOf(this);
        return childNodes[index + 1] || null;
      },
    }, {
      key: "nextElementSibling",
      get: function get() {
        var childNodes = this.parentNode && this.parentNode.childNodes || [];
        var index = childNodes.indexOf(this);

        if ( index < childNodes.length - 1 ) {
          for (var i = index + 1, len = childNodes.length; i < len; i++) {
            if ( childNodes[i].nodeType === Node.ELEMENT_NODE ) {
              return childNodes[i];
            }
          }
        }

        return null;
      },
    }]);

    return Node;
  }(EventTarget); // static props


  Node.ELEMENT_NODE = 1;
  Node.TEXT_NODE = 3;
  Node.CDATA_SECTION_NODE = 4;
  Node.PROCESSING_INSTRUCTION_NODE = 7;
  Node.COMMENT_NODE = 8;
  Node.DOCUMENT_NODE = 9;
  Node.DOCUMENT_TYPE_NODE = 10;
  Node.DOCUMENT_FRAGMENT_NODE = 11;

  function _assertThisInitialized(self) {
    if ( self === void 0 ) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var assertThisInitialized = _assertThisInitialized;

  var getPrototypeOf = createCommonjsModule(function (module) {
    function _getPrototypeOf(o) {
      module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    module.exports = _getPrototypeOf;
  });

  function _isNativeFunction(fn) {
    return Function.toString.call(fn)
      .indexOf("[native code]") !== -1;
  }

  var isNativeFunction = _isNativeFunction;

  var wrapNativeSuper = createCommonjsModule(function (module) {
    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? new Map() : undefined;

      module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if ( Class === null || !isNativeFunction(Class) ) return Class;

        if ( typeof Class !== "function" ) {
          throw new TypeError("Super expression must either be null or a function");
        }

        if ( typeof _cache !== "undefined" ) {
          if ( _cache.has(Class) ) return _cache.get(Class);

          _cache.set(Class, Wrapper);
        }

        function Wrapper() {
          return construct(Class, arguments, getPrototypeOf(this).constructor);
        }

        Wrapper.prototype = Object.create(Class.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true,
          },
        });
        return setPrototypeOf(Wrapper, Class);
      };

      return _wrapNativeSuper(Class);
    }

    module.exports = _wrapNativeSuper;
  });

  function _createForOfIteratorHelperLoose$1(o, allowArrayLike) {
    var it;
    if ( typeof Symbol === "undefined" || o[Symbol.iterator] == null ) {
      if ( Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number" ) {
        if ( it ) o = it;
        var i = 0;
        return function () {
          if ( i >= o.length ) return { done: true };
          return {
            done: false,
            value: o[i++],
          };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    it = o[Symbol.iterator]();
    return it.next.bind(it);
  }

  function _unsupportedIterableToArray$1(o, minLen) {
    if ( !o ) return;
    if ( typeof o === "string" ) return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o)
      .slice(8, -1);
    if ( n === "Object" && o.constructor ) n = o.constructor.name;
    if ( n === "Map" || n === "Set" ) return Array.from(o);
    if ( n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ) return _arrayLikeToArray$1(o, minLen);
  }

  function _arrayLikeToArray$1(arr, len) {
    if ( len == null || len > arr.length ) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }

  var ClassList = /*#__PURE__*/function (_Set) {
    inheritsLoose(ClassList, _Set);

    function ClassList() {
      return _Set.apply(this, arguments) || this;
    }

    ClassList._create = function _create(className, element) {
      var instance = new Set();
      instance.__proto__ = ClassList.prototype;
      instance.__element = element;
      className.trim()
        .split(/\s+/)
        .forEach(function (s) {
          return s !== '' && instance.add(s);
        });
      return instance;
    };

    var _proto = ClassList.prototype;

    _proto.add = function add(s) {
      if ( typeof s === 'string' && s !== '' ) {
        _Set.prototype.add.call(this, s);

        this._update();
      }

      return this;
    };

    _proto.remove = function remove(s) {
      _Set.prototype.delete.call(this, s);

      this._update();
    };

    _proto.replace = function replace(s1, s2) {
      _Set.prototype.delete.call(this, s1);

      _Set.prototype.add.call(this, s2);

      this._update();
    };

    _proto.contains = function contains(s) {
      return this.has(s);
    };

    _proto.item = function item(index) {
      var count = 0;

      for (var _iterator = _createForOfIteratorHelperLoose$1(this), _step; !(_step = _iterator()).done;) {
        var i = _step.value;

        if ( count === index ) {
          return i;
        }

        count++;
      }

      return undefined;
    };

    _proto.toggle = function toggle(token, force) {
      if ( force !== undefined ) {
        force === true ? this.add(token) : this.remove(token);
        return force;
      }

      if ( this.has(token) ) {
        this.remove(token);
        return false;
      } else {
        this.add(token);
        return true;
      }
    };

    _proto.toString = function toString() {
      return this.value;
    };

    _proto._update = function _update() {
      this.__element.className = this.value;
    };

    createClass(ClassList, [{
      key: "value",
      get: function get() {
        var classArray = [];
        this.forEach(function (item) {
          return classArray.push(item);
        });
        return classArray.join(' ');
      },
    }]);

    return ClassList;
  }( /*#__PURE__*/wrapNativeSuper(Set));

  /**
   * A list of supported style properties that by default contain only commonly used style properties
   */
  var styleList = {
    position: 'position',
    top: 'top',
    bottom: 'bottom',
    right: 'right',
    left: 'left',
    float: 'float',
    clear: 'clear',
    display: 'display',
    width: 'width',
    height: 'height',
    maxHeight: 'max-height',
    maxWidth: 'max-width',
    minHeight: 'min-height',
    minWidth: 'min-width',
    flex: 'flex',
    flexBasis: 'flex-basis',
    flexGrow: 'flex-grow',
    flexShrink: 'flex-shrink',
    flexDirection: 'flex-direction',
    flexWrap: 'flex-wrap',
    justifyContent: 'justify-content',
    justifySelf: 'justify-self',
    alignItems: 'align-items',
    alignSelf: 'align-self',
    padding: 'padding',
    paddingBottom: 'padding-bottom',
    paddingLeft: 'padding-left',
    paddingRight: 'padding-right',
    paddingTop: 'padding-top',
    margin: 'margin',
    marginBottom: 'margin-bottom',
    marginLeft: 'margin-left',
    marginRight: 'margin-right',
    marginTop: 'margin-top',
    background: 'background',
    backgroundClip: 'background-clip',
    backgroundColor: 'background-color',
    backgroundImage: 'background-image',
    backgroundOrigin: 'background-origin',
    backgroundPosition: 'background-position',
    backgroundRepeat: 'background-repeat',
    backgroundSize: 'background-size',
    border: 'border',
    borderRadius: 'border-radius',
    borderBottomColor: 'border-bottom-color',
    borderBottomLeftRadius: 'border-bottom-left-radius',
    borderBottomRightRadius: 'border-bottom-right-radius',
    borderBottomStyle: 'border-bottom-style',
    borderBottomWidth: 'border-bottom-width',
    borderCollapse: 'border-collapse',
    borderImageOutset: 'border-image-outset',
    borderImageRepeat: 'border-image-repeat',
    borderImageSlice: 'border-image-slice',
    borderImageSource: 'border-image-source',
    borderImageWidth: 'border-image-width',
    borderLeftColor: 'border-left-color',
    borderLeftStyle: 'border-left-style',
    borderLeftWidth: 'border-left-width',
    borderRightColor: 'border-right-color',
    borderRightStyle: 'border-right-style',
    borderRightWidth: 'border-right-width',
    borderTopColor: 'border-top-color',
    borderTopLeftRadius: 'border-top-left-radius',
    borderTopRightRadius: 'border-top-right-radius',
    borderTopStyle: 'border-top-style',
    borderTopWidth: 'border-top-width',
    outline: 'outline',
    borderWidth: 'border-width',
    borderStyle: 'border-style',
    borderColor: 'border-color',
    animation: 'animation',
    animationDelay: 'animation-delay',
    animationDirection: 'animation-direction',
    animationDuration: 'animation-duration',
    animationFillMode: 'animation-fill-mode',
    animationIterationCount: 'animation-iteration-count',
    animationName: 'animation-name',
    animationPlayState: 'animation-play-state',
    animationTimingFunction: 'animation-timing-function',
    transition: 'transition',
    transitionDelay: 'transition-delay',
    transitionDuration: 'transition-duration',
    transitionProperty: 'transition-property',
    transitionTimingFunction: 'transition-timing-function',
    transform: 'transform',
    transformOrigin: 'transform-origin',
    perspective: 'perspective',
    perspectiveOrigin: 'perspective-origin',
    backfaceVisibility: 'backface-visibility',
    font: 'font',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontStyle: 'font-style',
    fontWeight: 'font-weight',
    color: 'color',
    textAlign: 'text-align',
    textDecoration: 'text-decoration',
    textIndent: 'text-indent',
    textRendering: 'text-rendering',
    textShadow: 'text-shadow',
    textOverflow: 'text-overflow',
    textTransform: 'text-transform',
    wordBreak: 'word-break',
    wordSpacing: 'word-spacing',
    wordWrap: 'word-wrap',
    lineHeight: 'line-height',
    letterSpacing: 'letter-spacing',
    whiteSpace: 'white-space',
    userSelect: 'user-select',
    visibility: 'visibility',
    opacity: 'opacity',
    zIndex: 'z-index',
    zoom: 'zoom',
    overflow: 'overflow',
    overflowX: 'overflow-x',
    overflowY: 'overflow-y',
    boxShadow: 'box-shadow',
    boxSizing: 'box-sizing',
    content: 'content',
    cursor: 'cursor',
    direction: 'direction',
    listStyle: 'list-style',
    objectFit: 'object-fit',
    pointerEvents: 'pointer-events',
    resize: 'resize',
    verticalAlign: 'vertical-align',
    willChange: 'will-change',
    clip: 'clip',
    clipPath: 'clip-path',
    fill: 'fill',
    touchAction: 'touch-action',
    gridArea: 'grid-area',
    gridAutoColumns: 'grid-auto-columns',
    gridAutoFlow: 'grid-auto-flow',
    gridAutoRows: 'grid-auto-rows',
    gridColumn: 'grid-column',
    gridColumnEnd: 'grid-column-end',
    gridColumnGap: 'grid-column-gap',
    gridColumnStart: 'grid-column-start',
    gridGap: 'grid-gap',
    gridRow: 'grid-row',
    gridRowEnd: 'grid-row-end',
    gridRowGap: 'grid-row-gap',
    gridRowStart: 'grid-row-start',
    gridTemplate: 'grid-template',
    gridTemplateAreas: 'grid-template-areas',
    gridTemplateColumns: 'grid-template-columns',
    gridTemplateRows: 'grid-template-rows',
  };

  var Style = /*#__PURE__*/function () {
    function Style(element) {
      this.__settedStyle = new Set();
      this.__value = new Map();
      this.__element = element;
    }

    var _proto = Style.prototype;

    _proto.setStyle = function setStyle(val, styleKey) {
      var old = this[styleKey];

      if ( val ) {
        this.__settedStyle.add(styleKey);
      }

      this.__value.set(styleKey, val);

      if ( old !== val && this.__element._isRendered() ) {
        var payload = {
          path: this.__element._path + ".style",
          value: this.cssText,
        };

        this.__element._triggerUpdate(payload);
      }
    };

    _proto.setCssVariables = function setCssVariables(styleKey) {
      var _this = this;

      this.hasOwnProperty(styleKey) || Object.defineProperty(this, styleKey, {
        enumerable: true,
        configurable: true,
        get: function get() {
          return _this.__value.get(styleKey) || '';
        },
        set: function set(val) {
          _this.setStyle(val, styleKey);
        },
      });
    };

    _proto.setProperty = function setProperty(name, value) {
      if ( name[0] === '-' ) {
        this.setCssVariables(name);
      } else {
        name = styleMap.get(name);
      }

      if ( typeof value === undefined ) {
        return;
      }

      if ( !value ) {
        this.removeProperty(name);
      } else {
        this[name] = value;
      }
    };

    _proto.removeProperty = function removeProperty(name) {
      name = styleMap.get(name);

      if ( !this.__settedStyle.has(name) ) {
        return '';
      }

      var value = this[name];
      this[name] = '';

      this.__settedStyle.delete(name);

      return value;
    };

    _proto.getPropertyValue = function getPropertyValue(name) {
      if ( typeof name !== 'string' ) return '';
      name = styleMap.get(name);
      return this[name] || '';
    };

    createClass(Style, [{
      key: "cssText",
      get: function get() {
        var _this2 = this;

        var cssText = '';

        this.__settedStyle.forEach(function (key) {
          var val = _this2[key];
          if ( !val ) return;
          cssText += styleMap.get(key) + ": " + val + ";";
        });

        return cssText;
      },
      set: function set(styleText) {
        var _this3 = this;

        if ( styleText === void 0 ) {
          styleText = '';
        }

        this.__settedStyle.forEach(function (prop) {
          _this3.removeProperty(prop);
        });

        if ( styleText === '' ) {
          return;
        }

        var rules = styleText.split(';');

        for (var i = 0; i < rules.length; i++) {
          var rule = rules[i].trim();

          if ( rule === '' ) {
            continue;
          }

          var _rule$split = rule.split(':'),
            propName = _rule$split[0],
            val = _rule$split[1];

          if ( typeof val === undefined ) {
            continue;
          }

          this.setProperty(propName.trim(), val.trim());
        }
      },
    }]);

    return Style;
  }();
  /**
   * Set the getters and setters for each property
   */


  var properties = {};
  var styleMap = new Map();
  Object.keys(styleList)
    .forEach(function (name) {
      styleMap.set(name, styleList[name]);
      styleMap.set(styleList[name], name);
      properties[name] = {
        get: function get() {
          return this.__value.get(name) || '';
        },
        set: function set(value) {
          this.setStyle(value, name);
        },
      };
    });
  Object.defineProperties(Style.prototype, properties);

  var Attribute = /*#__PURE__*/function () {
    function Attribute(element) {
      this.__element = element;
      this.__value = {};
    }

    var _proto = Attribute.prototype;

    _proto.set = function set(name, value, immediate) {
      if ( immediate === void 0 ) {
        immediate = true;
      }

      var element = this.__element;
      this.__value[name] = value;

      if ( name === 'style' ) {
        element.style.cssText = value;
      } else if ( name.indexOf('data-') === 0 ) {
        var datasetName = tool.toCamel(name.substr(5));
        element.dataset[datasetName] = value;
      } else {
        var payload = {
          path: element._path + "." + name,
          value: value,
        };

        element._triggerUpdate(payload, immediate);
      }
    };

    _proto.get = function get(name) {
      var element = this.__element;

      if ( name === 'style' ) {
        return element.style.cssText || null;
      } else if ( name.indexOf('data-') === 0 ) {
        var datasetName = tool.toCamel(name.substr(5));
        return element.dataset[datasetName];
      }

      return this.__value[name] || null;
    };

    _proto.has = function has(name) {
      return Object.prototype.hasOwnProperty.call(this.__value, name);
    };

    _proto.remove = function remove(name) {
      var element = this.__element;
      delete this.__value[name];
      delete this[name];

      if ( name === 'style' ) {
        element.style.cssText = '';
      } else if ( name === 'id' ) {
        element.id = '';
      } else {
        if ( name.indexOf('data-') === 0 ) {
          var datasetName = tool.toCamel(name.substr(5));
          delete element.dataset[datasetName];
        } else {
          var payload = {
            path: element._path + "." + name,
            value: '',
          };

          element._triggerUpdate(payload);
        }
      }
    };

    createClass(Attribute, [{
      key: "style",
      get: function get() {
        return this.__element.style.cssText || undefined;
      },
    }, {
      key: "class",
      get: function get() {
        return this.__value.class || undefined;
      },
    }, {
      key: "id",
      get: function get() {
        return this.__value.id || undefined;
      },
    }, {
      key: "src",
      get: function get() {
        return this.__value.src || undefined;
      },
    }]);

    return Attribute;
  }();

  function simplify(node) {
    return node._renderInfo;
  }

  function traverse(node, action) {
    if ( !node ) {
      return;
    }

    var copiedNode;
    var queue = [];
    queue.push(node);

    var _loop = function _loop() {
      var curNode = queue.shift();
      var result = action(curNode);

      if ( !copiedNode ) {
        copiedNode = result;
        copiedNode.children = [];
      } else {
        curNode.__parent.children = curNode.__parent.children || [];

        curNode.__parent.children.push(result);
      }

      if ( curNode.childNodes && curNode.childNodes.length ) {
        curNode.childNodes.forEach(function (n) {
          return n.__parent = result;
        });
        queue = queue.concat(curNode.childNodes);
      }

      if ( !result.children ) {
        result.children = [];
      }
    };

    while (queue.length) {
      _loop();
    }

    return copiedNode;
  }

  function simplifyDomTree(node) {
    return traverse(node, simplify);
  }

  function _createForOfIteratorHelperLoose$2(o, allowArrayLike) {
    var it;
    if ( typeof Symbol === "undefined" || o[Symbol.iterator] == null ) {
      if ( Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number" ) {
        if ( it ) o = it;
        var i = 0;
        return function () {
          if ( i >= o.length ) return { done: true };
          return {
            done: false,
            value: o[i++],
          };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    it = o[Symbol.iterator]();
    return it.next.bind(it);
  }

  function _unsupportedIterableToArray$2(o, minLen) {
    if ( !o ) return;
    if ( typeof o === "string" ) return _arrayLikeToArray$2(o, minLen);
    var n = Object.prototype.toString.call(o)
      .slice(8, -1);
    if ( n === "Object" && o.constructor ) n = o.constructor.name;
    if ( n === "Map" || n === "Set" ) return Array.from(o);
    if ( n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ) return _arrayLikeToArray$2(o, minLen);
  }

  function _arrayLikeToArray$2(arr, len) {
    if ( len == null || len > arr.length ) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }

  var Element = /*#__PURE__*/function (_Node) {
    inheritsLoose(Element, _Node);

    function Element(options) {
      var _this;

      options.type = 'element';
      _this = _Node.call(this, options) || this;
      _this.__tagName = options.tagName || '';
      _this.__isBuiltinComponent = BUILTIN_COMPONENT_LIST.has(_this.__tagName);
      _this.__tmplName = _this.__isBuiltinComponent ? _this.__tagName : 'h-element';
      _this.childNodes = [];
      _this.__nodeType = options.nodeType || Node.ELEMENT_NODE;
      _this.style = new Style(assertThisInitialized(_this));
      _this.__attrs = new Attribute(assertThisInitialized(_this));
      cache.setNode(_this.__nodeId, assertThisInitialized(_this));
      _this.dataset = {};

      _this._initAttributes(options.attrs);

      if ( _this.id && !_this.ownerDocument.__idMap.has(_this.id) ) {
        _this.ownerDocument.__idMap.set(_this.id, assertThisInitialized(_this));
      }

      return _this;
    } // Override the $$destroy method of the parent class


    var _proto = Element.prototype;

    _proto.$$destroy = function $$destroy() {
      this.childNodes.forEach(function (child) {
        return child.$$destroy();
      });
      cache.setNode(this.__nodeId, null);

      this.ownerDocument.__idMap.set(this.id, null);

      _Node.prototype.$$destroy.call(this);

      this.__tagName = '';
      this.childNodes.length = 0;
      this.__nodeType = Node.ELEMENT_NODE;
      this.__attrs = null;
    } // Init attribute
    ;

    _proto._initAttributes = function _initAttributes(attrs) {
      var _this2 = this;

      if ( attrs === void 0 ) {
        attrs = {};
      }

      Object.keys(attrs)
        .forEach(function (name) {
          _this2._setAttributeWithOutUpdate(name, attrs[name]);
        });
    };

    _proto._triggerUpdate = function _triggerUpdate(payload, immediate) {
      if ( immediate === void 0 ) {
        immediate = true;
      }

      if ( immediate ) {
        this.enqueueRender(payload);
      } else {
        this._root.renderStacks.push(payload);
      }
    } // Child ownerDocument may be incorrect if the node created during the page hide period
    // Here we should adjust its ownerDocument when the node mounted
    ;

    _proto._adjustDocument = function _adjustDocument(child) {
      var _this3 = this;

      if ( this.__ownerDocument.__pageId !== child.__ownerDocument.__pageId ) {
        this._root.__renderCallbacks.push(function () {
          traverse(child, function (node) {
            // Adjust node's ownerDocument's idMap
            if ( node.id ) {
              node.__ownerDocument.__idMap.delete(node.id);

              _this3.__ownerDocument.__idMap.set(node.id, node);
            }

            node.__ownerDocument = _this3.__ownerDocument;
            return {};
          });
        });
      }
    };

    // The cloneNode interface is called to process additional properties
    _proto._dealWithAttrsForCloneNode = function _dealWithAttrsForCloneNode() {
      return {};
    } // Sets properties, but does not trigger updates
    ;

    _proto._setAttributeWithOutUpdate = function _setAttributeWithOutUpdate(name, value) {
      this.__attrs.set(name, value, false);
    };

    _proto.cloneNode = function cloneNode(deep) {
      var _this4 = this;

      var dataset = {};
      Object.keys(this.dataset)
        .forEach(function (name) {
          dataset["data-" + tool.toDash(name)] = _this4.dataset[name];
        });

      var newNode = this.ownerDocument._createElement({
        tagName: this.__tagName,
        attrs: _extends_1({
          id: this.id,
          class: this.className,
          style: this.style.cssText,
          src: this.src,
        }, dataset, this._dealWithAttrsForCloneNode()),
        document: this.ownerDocument,
        nodeType: this.__nodeType,
      });

      if ( deep ) {
        // Deep clone
        for (var _iterator = _createForOfIteratorHelperLoose$2(this.childNodes), _step; !(_step = _iterator()).done;) {
          var child = _step.value;
          newNode.appendChild(child.cloneNode(deep));
        }
      }

      return newNode;
    };

    _proto.appendChild = function appendChild(node) {
      if ( node === this ) return;
      if ( node.parentNode ) node.parentNode.removeChild(node);
      this.childNodes.push(node); // Set parentNode

      node.parentNode = this;

      if ( this._isRendered() ) {
        node.__rendered = true; // Trigger update

        var payload = {
          type: 'children',
          path: this._path + ".children",
          start: this.childNodes.length - 1,
          deleteCount: 0,
          item: simplifyDomTree(node),
        };

        this._triggerUpdate(payload);

        this._adjustDocument(node);
      }

      return this;
    };

    _proto.removeChild = function removeChild(node) {
      if ( !(node instanceof Node) ) return;
      var index = this.childNodes.indexOf(node);

      if ( index >= 0 ) {
        // Inserted, need to delete
        this.childNodes.splice(index, 1);
        node.parentNode = null;
        node.__rendered = false;

        if ( this._isRendered() ) {
          node.__rendered = false; // Trigger update

          var payload = {
            type: 'children',
            path: this._path + ".children",
            start: index,
            deleteCount: 1,
          };

          this._triggerUpdate(payload);
        }
      }

      return node;
    };

    _proto.insertBefore = function insertBefore(node, ref) {
      if ( !(node instanceof Node) ) return;
      if ( ref && !(ref instanceof Node) ) return;
      if ( node === this ) return;
      if ( node.parentNode ) node.parentNode.removeChild(node); // Set parentNode

      node.parentNode = this;
      var insertIndex = ref ? this.childNodes.indexOf(ref) : -1;

      if ( insertIndex === -1 ) {
        // Insert to the end
        this.childNodes.push(node);
      } else {
        // Inserted before ref
        this.childNodes.splice(insertIndex, 0, node);
      }

      if ( this._isRendered() ) {
        node.__rendered = true;
        var payload = {
          type: 'children',
          path: this._path + ".children",
          deleteCount: 0,
          item: simplifyDomTree(node),
          start: insertIndex === -1 ? this.childNodes.length - 1 : insertIndex,
        }; // Trigger update

        this._triggerUpdate(payload);

        this._adjustDocument(node);
      }

      return node;
    };

    _proto.replaceChild = function replaceChild(node, old) {
      if ( !(node instanceof Node) || !(old instanceof Node) ) return;
      var replaceIndex = this.childNodes.indexOf(old);
      if ( replaceIndex !== -1 ) this.childNodes.splice(replaceIndex, 1);
      if ( node === this ) return;
      if ( node.parentNode ) node.parentNode.removeChild(node);

      if ( replaceIndex === -1 ) {
        // Insert to the end
        this.childNodes.push(node);
      } else {
        // Replace to old
        this.childNodes.splice(replaceIndex, 0, node);
      } // Set parentNode


      node.parentNode = this;

      if ( this._isRendered() ) {
        node.__rendered = true; // Trigger update

        var payload = {
          type: 'children',
          path: this._path + ".children",
          start: replaceIndex === -1 ? this.childNodes.length - 1 : replaceIndex,
          deleteCount: replaceIndex === -1 ? 0 : 1,
          item: simplifyDomTree(node),
        };

        this._triggerUpdate(payload);

        this._adjustDocument(node);
      }

      return old;
    };

    _proto.hasChildNodes = function hasChildNodes() {
      return this.childNodes.length > 0;
    };

    _proto.getElementsByTagName = function getElementsByTagName(tagName) {
      var _this5 = this;

      if ( typeof tagName !== 'string' ) return [];
      var elements = [];
      traverse(this, function (element) {
        if ( element !== _this5 && element && element.__tagName === tagName ) {
          elements.push(element);
        }

        return {};
      });
      return elements;
    };

    _proto.getElementsByClassName = function getElementsByClassName(className) {
      var _this6 = this;

      if ( typeof className !== 'string' ) return [];
      var elements = [];
      traverse(this, function (element) {
        var classNames = className.trim()
          .split(/\s+/);

        if ( element !== _this6 && element && classNames.every(function (c) {
          return element.classList && element.classList.contains(c);
        }) ) {
          elements.push(element);
        }

        return {};
      });
      return elements;
    };

    _proto.querySelector = function querySelector(selector) {
      if ( selector[0] === '.' ) {
        var elements = this.getElementsByClassName(selector.slice(1));
        return elements.length > 0 ? elements[0] : null;
      } else if ( selector[0] === '#' ) {
        return this.ownerDocument.getElementById(selector.slice(1));
      } else if ( /^[a-zA-Z]/.test(selector) ) {
        var _elements = this.getElementsByTagName(selector);

        return _elements.length > 0 ? _elements[0] : null;
      }

      return null;
    };

    _proto.querySelectorAll = function querySelectorAll(selector) {
      if ( typeof selector !== 'string' ) return [];

      if ( selector[0] === '.' ) {
        return this.getElementsByClassName(selector.slice(1));
      } else if ( selector[0] === '#' ) {
        var element = this.ownerDocument.getElementById(selector.slice(1));
        return element ? [element] : [];
      } else if ( /^[a-zA-Z]/.test(selector) ) {
        return this.getElementsByTagName(selector);
      }

      return null;
    };

    _proto.setAttribute = function setAttribute(name, value, immediate) {
      if ( immediate === void 0 ) {
        immediate = true;
      }

      if ( name === 'id' && value !== this.id ) {
        this.ownerDocument.__idMap.delete(this.id);

        this.ownerDocument.__idMap.set(value, this);
      }

      this.__attrs.set(name, value, immediate);
    };

    _proto.getAttribute = function getAttribute(name) {
      return this.__attrs.get(name);
    };

    _proto.hasAttribute = function hasAttribute(name) {
      if ( name === 'style' || name === 'id' ) {
        return !!this.getAttribute(name);
      }

      return this.__attrs.has(name);
    };

    _proto.removeAttribute = function removeAttribute(name) {
      return this.__attrs.remove(name);
    };

    _proto.contains = function contains(otherElement) {
      var stack = [];
      var checkElement = this;

      while (checkElement) {
        if ( checkElement === otherElement ) return true;
        var childNodes = checkElement.childNodes;
        if ( childNodes && childNodes.length ) {
          childNodes.forEach(function (child) {
            return stack.push(child);
          });
        }
        checkElement = stack.pop();
      }

      return false;
    };

    _proto.enqueueRender = function enqueueRender(payload) {
      this._root.enqueueRender(payload);
    };

    _proto.getBoundingClientRect = function getBoundingClientRect() {
      // Do not make any implementation, only for compatible use
      console.warn('getBoundingClientRect is not supported, please use npm package universal-element to get DOM info in miniapp');
      return {};
    };

    createClass(Element, [{
      key: "_renderInfo",
      get: function get() {
        return _extends_1({
          nodeId: this.__nodeId,
          pageId: this.__pageId,
          nodeType: this.__tmplName,
        }, this.__attrs.__value, {
          style: this.style.cssText,
          class: this.__isBuiltinComponent ? this.className : "h5-" + this.__tagName + " " + this.className,
        });
      },
    }, {
      key: "id",
      get: function get() {
        return this.__attrs.get('id') || '';
      },
      set: function set(id) {
        this.setAttribute('id', id);
      },
    }, {
      key: "tagName",
      get: function get() {
        return this.__tagName.toUpperCase();
      },
    }, {
      key: "className",
      get: function get() {
        return this.getAttribute('class') || '';
      },
      set: function set(className) {
        this.setAttribute('class', className);
      },
    }, {
      key: "classList",
      get: function get() {
        return ClassList._create(this.className, this);
      },
    }, {
      key: "nodeName",
      get: function get() {
        return this.tagName;
      },
    }, {
      key: "nodeType",
      get: function get() {
        return this.__nodeType;
      },
    }, {
      key: "children",
      get: function get() {
        return this.childNodes.filter(function (child) {
          return child.nodeType === Node.ELEMENT_NODE;
        });
      },
    }, {
      key: "firstChild",
      get: function get() {
        return this.childNodes[0];
      },
    }, {
      key: "lastChild",
      get: function get() {
        return this.childNodes[this.childNodes.length - 1];
      },
    }, {
      key: "innerText",
      get: function get() {
        // WARN: this is handled in accordance with the textContent, not to determine whether it will be rendered or not
        return this.textContent;
      },
      set: function set(text) {
        this.textContent = text;
      },
    }, {
      key: "textContent",
      get: function get() {
        return this.childNodes.map(function (child) {
          return child.textContent;
        })
          .join('');
      },
      set: function set(text) {
        text = '' + text; // An empty string does not add a textNode node

        if ( !text ) {
          var payload = {
            type: 'children',
            path: this._path + ".children",
            start: 0,
            deleteCount: this.childNodes.length,
          };
          this.childNodes.length = 0;

          this._triggerUpdate(payload);
        } else {
          this.childNodes.length = 0;
          var child = this.ownerDocument.createTextNode(text);
          this.appendChild(child);
        }
      },
    }, {
      key: "attributes",
      get: function get() {
        return this.__attrs;
      },
    }, {
      key: "src",
      get: function get() {
        if ( !this.__attrs ) return '';
        return this.__attrs.get('src') || undefined;
      },
      set: function set(value) {
        value = '' + value;

        this.__attrs.set('src', value);
      },
    }]);

    return Element;
  }(Node);

  var Window = /*#__PURE__*/function (_EventTarget) {
    inheritsLoose(Window, _EventTarget);

    function Window() {
      var _this;

      _this = _EventTarget.call(this) || this;
      _this.lastRafTime = 0;
      var timeOrigin = +new Date();

      _this.$_customEventConstructor = /*#__PURE__*/function (_OriginalCustomEvent) {
        inheritsLoose(CustomEvent, _OriginalCustomEvent);

        function CustomEvent(name, options) {
          if ( name === void 0 ) {
            name = '';
          }

          if ( options === void 0 ) {
            options = {};
          }

          options.timeStamp = +new Date() - timeOrigin;
          return _OriginalCustomEvent.call(this, name, options) || this;
        }

        return CustomEvent;
      }(CustomEvent); // Collect event handlers which undifferentiated pages


      _this.__sharedHandlers = []; // Simulate for react

      _this.HTMLIFrameElement = function () {
      };

      return _this;
    } // Forces the setData cache to be emptied


    var _proto = Window.prototype;

    _proto.$$forceRender = function $$forceRender() {
      tool.flushThrottleCache();
    } // Trigger node event
    ;

    _proto.$$trigger = function $$trigger(eventName, options) {
      var _this2 = this;

      if ( options === void 0 ) {
        options = {};
      }

      if ( eventName === 'error' && typeof options.event === 'string' ) {
        var errStack = options.event;
        var errLines = errStack.split('\n');
        var message = '';

        for (var i = 0, len = errLines.length; i < len; i++) {
          var line = errLines[i];

          if ( line.trim()
            .indexOf('at') !== 0 ) {
            message += line + '\n';
          } else {
            break;
          }
        }

        var error = new Error(message);
        error.stack = errStack;
        options.event = new this.$_customEventConstructor('error', {
          target: this,
          $$extra: {
            message: message,
            filename: '',
            lineno: 0,
            colno: 0,
            error: error,
          },
        });
        options.args = [message, error];

        if ( typeof this.onerror === 'function' && !this.onerror.$$isOfficial ) {
          var oldOnError = this.onerror;

          this.onerror = function (event, message, error) {
            oldOnError.call(_this2, message, '', 0, 0, error);
          };

          this.onerror.$$isOfficial = true;
        }
      }

      return _EventTarget.prototype.$$trigger.call(this, eventName, options);
    }
    /**
     * External properties and methods
     */
    ;

    _proto.getComputedStyle = function getComputedStyle() {
      // Only for compatible use
      console.warn('window.getComputedStyle is not supported.');
    };

    _proto.requestAnimationFrame = function requestAnimationFrame(callback) {
      var _this3 = this;

      if ( typeof callback !== 'function' ) return;
      var now = new Date();
      var nextRafTime = Math.max(this.lastRafTime + 16, now);
      return setTimeout(function () {
        callback(nextRafTime);
        _this3.lastRafTime = nextRafTime;
      }, nextRafTime - now);
    };

    _proto.cancelAnimationFrame = function cancelAnimationFrame(timeId) {
      return clearTimeout(timeId);
    };

    createClass(Window, [{
      key: "document",
      get: function get() {
        return cache.getDocument(this.__pageId);
      },
    }, {
      key: "CustomEvent",
      get: function get() {
        return this.$_customEventConstructor;
      },
    }, {
      key: "self",
      get: function get() {
        return this;
      },
    }, {
      key: "Image",
      get: function get() {
        return this.document.$$imageConstructor;
      },
    }, {
      key: "setTimeout",
      get: function get() {
        return setTimeout.bind(null);
      },
    }, {
      key: "clearTimeout",
      get: function get() {
        return clearTimeout.bind(null);
      },
    }, {
      key: "setInterval",
      get: function get() {
        return setInterval.bind(null);
      },
    }, {
      key: "clearInterval",
      get: function get() {
        return clearInterval.bind(null);
      },
    }, {
      key: "HTMLElement",
      get: function get() {
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return construct(Element, args);
        };
      },
    }, {
      key: "Element",
      get: function get() {
        return Element;
      },
    }, {
      key: "Node",
      get: function get() {
        return Node;
      },
    }, {
      key: "RegExp",
      get: function get() {
        return RegExp;
      },
    }, {
      key: "Math",
      get: function get() {
        return Math;
      },
    }, {
      key: "Number",
      get: function get() {
        return Number;
      },
    }, {
      key: "Boolean",
      get: function get() {
        return Boolean;
      },
    }, {
      key: "String",
      get: function get() {
        return String;
      },
    }, {
      key: "Date",
      get: function get() {
        return Date;
      },
    }, {
      key: "Symbol",
      get: function get() {
        return Symbol;
      },
    }]);

    return Window;
  }(EventTarget);

  function createWindow() {
    return new Window();
  }

  var TextNode = /*#__PURE__*/function (_Node) {
    inheritsLoose(TextNode, _Node);

    function TextNode(options) {
      var _this;

      options.type = 'text';
      _this = _Node.call(this, options) || this;
      _this.$_content = options.content || '';
      return _this;
    }

    var _proto = TextNode.prototype;

    _proto.$$destroy = function $$destroy() {
      _Node.prototype.$$destroy.call(this);

      this.$_content = '';
    };

    _proto._triggerUpdate = function _triggerUpdate(payload) {
      this._root.enqueueRender(payload);
    };

    _proto.cloneNode = function cloneNode() {
      return this.ownerDocument.createTextNode(this.$_content);
    };

    createClass(TextNode, [{
      key: "_renderInfo",
      get: function get() {
        return {
          nodeType: "h-" + this.$_type,
          content: this.$_content,
        };
      },
    }, {
      key: "nodeName",
      get: function get() {
        return '#text';
      },
    }, {
      key: "nodeType",
      get: function get() {
        return Node.TEXT_NODE;
      },
    }, {
      key: "nodeValue",
      get: function get() {
        return this.textContent;
      },
      set: function set(value) {
        this.textContent = value;
      },
    }, {
      key: "textContent",
      get: function get() {
        return this.$_content;
      },
      set: function set(value) {
        value += '';
        this.$_content = value;

        if ( this._isRendered() ) {
          var payload = {
            path: this._path + ".content",
            value: value,
          };

          this._triggerUpdate(payload);
        }
      },
    }, {
      key: "data",
      get: function get() {
        return this.textContent;
      },
      set: function set(value) {
        this.textContent = value;
      },
    }]);

    return TextNode;
  }(Node);

  var Comment = /*#__PURE__*/function (_Node) {
    inheritsLoose(Comment, _Node);

    function Comment(options) {
      var _this;

      options.type = 'comment';
      _this = _Node.call(this, options) || this;
      _this.data = options.data;
      return _this;
    }

    var _proto = Comment.prototype;

    _proto.cloneNode = function cloneNode() {
      return this.ownerDocument.createComment({
        data: this.data,
      });
    };

    createClass(Comment, [{
      key: "_renderInfo",
      get: function get() {
        return {
          nodeType: 'h-' + this.$_type,
        };
      },
    }, {
      key: "nodeName",
      get: function get() {
        return '#comment';
      },
    }, {
      key: "nodeType",
      get: function get() {
        return Node.COMMENT_NODE;
      },
    }]);

    return Comment;
  }(Node);

  var Image = /*#__PURE__*/function (_Element) {
    inheritsLoose(Image, _Element);

    function Image(options) {
      var _this;

      var width = options.width;
      var height = options.height;
      if ( typeof width === 'number' && width >= 0 ) options.attrs.width = width;
      if ( typeof height === 'number' && height >= 0 ) options.attrs.height = height;
      _this = _Element.call(this, options) || this;
      _this.$_naturalWidth = 0;
      _this.$_naturalHeight = 0;

      _this.$_initRect();

      return _this;
    } // Override the parent class's destroy instance method


    var _proto = Image.prototype;

    _proto.$$destroy = function $$destroy() {
      _Element.prototype.$$destroy.call(this);

      this.$_naturalWidth = null;
      this.$_naturalHeight = null;
    } // Init length
    ;

    _proto.$_initRect = function $_initRect() {
      var width = parseInt(this.__attrs.get('width'), 10);
      var height = parseInt(this.__attrs.get('height'), 10);
      if ( typeof width === 'number' && width >= 0 ) this.style.width = width + "px";
      if ( typeof height === 'number' && height >= 0 ) this.style.height = height + "px";
    } // Reset width & height
    ;

    _proto.$_resetRect = function $_resetRect(rect) {
      if ( rect === void 0 ) {
        rect = {};
      }

      this.$_naturalWidth = rect.width || 0;
      this.$_naturalHeight = rect.height || 0;
      this.$_initRect();
    };

    createClass(Image, [{
      key: "_renderInfo",
      get: function get() {
        return _extends_1({
          nodeId: this.__nodeId,
          pageId: this.__pageId,
          nodeType: 'image',
        }, this.__attrs.__value, {
          style: this.style.cssText,
          class: 'h5-img ' + this.className,
        });
      },
    }, {
      key: "src",
      get: function get() {
        return this.__attrs.get('src') || '';
      },
      set: function set(value) {
        var _this2 = this;

        if ( !value || typeof value !== 'string' ) return;

        this.__attrs.set('src', value);

        setTimeout(function () {
          if ( _this2.src.indexOf('data:image') !== 0 ) {
            my.getImageInfo({
              src: _this2.src,
              success: function success(res) {
                // Load successfully, adjust the width and height of the picture
                _this2.$_resetRect(res); // Load event


                _this2.$$trigger('load', {
                  event: new Event({
                    name: 'load',
                    target: _this2,
                    eventPhase: Event.AT_TARGET,
                  }),
                  currentTarget: _this2,
                });
              },
              fail: function fail() {
                // Load failed, adjust the width and height of the image
                _this2.$_resetRect({
                  width: 0,
                  height: 0,
                }); // Trigger error event


                _this2.$$trigger('error', {
                  event: new Event({
                    name: 'error',
                    target: _this2,
                    eventPhase: Event.AT_TARGET,
                  }),
                  currentTarget: _this2,
                });
              },
            });
          }
        }, 0);
      },
    }, {
      key: "width",
      get: function get() {
        return +this.__attrs.get('width') || 0;
      },
      set: function set(value) {
        if ( typeof value !== 'number' || !isFinite(value) || value < 0 ) return;

        this.__attrs.set('width', value);

        this.$_initRect();
      },
    }, {
      key: "height",
      get: function get() {
        return +this.__attrs.get('height') || 0;
      },
      set: function set(value) {
        if ( typeof value !== 'number' || !isFinite(value) || value < 0 ) return;

        this.__attrs.set('height', value);

        this.$_initRect();
      },
    }, {
      key: "naturalWidth",
      get: function get() {
        return this.$_naturalWidth;
      },
    }, {
      key: "naturalHeight",
      get: function get() {
        return this.$_naturalHeight;
      },
    }]);

    return Image;
  }(Element);

  var HTMLInputElement = /*#__PURE__*/function (_Element) {
    inheritsLoose(HTMLInputElement, _Element);

    function HTMLInputElement(options) {
      var _this;

      _this = _Element.call(this, options) || this;
      _this.__changed = false;
      return _this;
    }

    /**
     * The cloneNode interface is invoked to handle additional properties
     */


    var _proto = HTMLInputElement.prototype;

    _proto._dealWithAttrsForCloneNode = function _dealWithAttrsForCloneNode() {
      return {
        type: this.type,
        value: this.value,
        disabled: this.disabled,
        maxlength: this.maxlength,
        placeholder: this.placeholder,
        // Special field
        mpplaceholderclass: this.mpplaceholderclass,
      };
    };

    _proto.setAttribute = function setAttribute(name, value, immediate) {
      if ( immediate === void 0 ) {
        immediate = true;
      }

      if ( name === 'focus' || name === 'autofocus' || name === 'autoFocus' ) {
        // autoFocus is passed by rax-textinput
        name = 'focus-state';
      }

      if ( name === 'value' ) {
        this.__changed = true;
      }

      _Element.prototype.setAttribute.call(this, name, value, immediate);
    } // Sets properties, but does not trigger updates
    ;

    _proto._setAttributeWithOutUpdate = function _setAttributeWithOutUpdate(name, value) {
      if ( name === 'focus' || name === 'autofocus' || name === 'autoFocus' ) {
        // autoFocus is passed by rax-textinput
        name = 'focus-state';
      }

      if ( name === 'value' ) {
        this.__changed = true;
      }

      _Element.prototype._setAttributeWithOutUpdate.call(this, name, value);
    };

    _proto.getAttribute = function getAttribute(name) {
      if ( name === 'focus' || name === 'autofocus' || name === 'autoFocus' ) {
        // autoFocus is passed by rax-textinput
        name = 'focus-state';
      }

      return this.__attrs.get(name);
    };

    _proto.blur = function blur() {
      this.setAttribute('focus', false);
    };

    _proto.focus = function focus() {
      this.setAttribute('focus', true);
    };

    createClass(HTMLInputElement, [{
      key: "_renderInfo",
      get: function get() {
        return _extends_1({
          nodeId: this.__nodeId,
          pageId: this.__pageId,
          nodeType: 'input',
        }, this.__attrs.__value, {
          style: this.style.cssText,
          class: 'h5-input ' + this.className,
        });
      }, // Attribute

    }, {
      key: "name",
      get: function get() {
        return this.__attrs.get('name');
      },
      set: function set(value) {
        value = '' + value;

        this.__attrs.set('name', value);
      },
    }, {
      key: "type",
      get: function get() {
        return this.__attrs.get('type') || 'text';
      },
      set: function set(value) {
        value = '' + value;

        this.__attrs.set('type', value);
      },
    }, {
      key: "value",
      get: function get() {
        var value = this.__attrs.get('value');

        if ( !value && !this.__changed ) {
          value = this.__attrs.get('defaultValue');
        }

        return value || '';
      },
      set: function set(value) {
        this.__changed = true;
        value = '' + value;

        this.__attrs.set('value', value);
      },
    }, {
      key: "readOnly",
      get: function get() {
        return !!this.__attrs.get('readOnly');
      },
      set: function set(value) {
        this.__attrs.set('readOnly', !!value);
      },
    }, {
      key: "disabled",
      get: function get() {
        return !!this.__attrs.get('disabled');
      },
      set: function set(value) {
        value = !!value;

        this.__attrs.set('disabled', value);
      },
    }, {
      key: "maxlength",
      get: function get() {
        return this.__attrs.get('maxlength');
      },
      set: function set(value) {
        this.__attrs.set('maxlength', value);
      },
    }, {
      key: "placeholder",
      get: function get() {
        return this.__attrs.get('placeholder') || '';
      },
      set: function set(value) {
        value = '' + value;

        this.__attrs.set('placeholder', value);
      },
    }, {
      key: "checked",
      set: function set(value) {
        this.__attrs.set('checked', value);
      },
      get: function get() {
        return this.__attrs.get('checked') || '';
      },
    }]);

    return HTMLInputElement;
  }(Element);

  var HTMLTextAreaElement = /*#__PURE__*/function (_Element) {
    inheritsLoose(HTMLTextAreaElement, _Element);

    function HTMLTextAreaElement(options) {
      var _this;

      _this = _Element.call(this, options) || this;
      _this.__changed = false;
      return _this;
    }

    /**
     * The cloneNode interface is invoked to handle additional properties
     */


    var _proto = HTMLTextAreaElement.prototype;

    _proto._dealWithAttrsForCloneNode = function _dealWithAttrsForCloneNode() {
      return {
        type: this.type,
        value: this.value,
        disabled: this.disabled,
        maxlength: this.maxlength,
        placeholder: this.placeholder,
        // Special field
        mpplaceholderclass: this.mpplaceholderclass,
      };
    };

    _proto.setAttribute = function setAttribute(name, value, immediate) {
      if ( immediate === void 0 ) {
        immediate = true;
      }

      if ( name === 'focus' || name === 'autofocus' || name === 'autoFocus' ) {
        // autoFocus is passed by rax-textinput
        name = 'focus-state';
      }

      if ( name === 'value' ) {
        this.__changed = true;
      }

      _Element.prototype.setAttribute.call(this, name, value, immediate);
    } // Sets properties, but does not trigger updates
    ;

    _proto._setAttributeWithOutUpdate = function _setAttributeWithOutUpdate(name, value) {
      if ( name === 'focus' || name === 'autofocus' || name === 'autoFocus' ) {
        // autoFocus is passed by rax-textinput
        name = 'focus-state';
      }

      if ( name === 'value' ) {
        this.__changed = true;
      }

      _Element.prototype._setAttributeWithOutUpdate.call(this, name, value);
    };

    _proto.getAttribute = function getAttribute(name) {
      if ( name === 'focus' || name === 'autofocus' || name === 'autoFocus' ) {
        // autoFocus is passed by rax-textinput
        name = 'focus-state';
      }

      return this.__attrs.get(name);
    };

    _proto.blur = function blur() {
      this.setAttribute('focus', false);
    };

    _proto.focus = function focus() {
      this.setAttribute('focus', true);
    };

    createClass(HTMLTextAreaElement, [{
      key: "_renderInfo",
      get: function get() {
        return _extends_1({
          nodeId: this.__nodeId,
          pageId: this.__pageId,
          nodeType: 'textarea',
        }, this.__attrs.__value, {
          style: this.style.cssText,
          class: 'h5-textarea ' + this.className,
        });
      }, // Attribute

    }, {
      key: "name",
      get: function get() {
        return this.__attrs.get('name');
      },
      set: function set(value) {
        value = '' + value;

        this.__attrs.set('name', value);
      }, // Attribute

    }, {
      key: "type",
      get: function get() {
        return this.__attrs.get('type') || 'textarea';
      },
      set: function set(value) {
        value = '' + value;

        this.__attrs.set('type', value);
      },
    }, {
      key: "value",
      get: function get() {
        var value = this.__attrs.get('value');

        if ( !value && !this.__changed ) {
          value = this.__attrs.get('defaultValue');
        }

        return value || '';
      },
      set: function set(value) {
        this.__changed = true;
        value = '' + value;

        this.__attrs.set('value', value);
      },
    }, {
      key: "readOnly",
      get: function get() {
        return !!this.__attrs.get('readOnly');
      },
      set: function set(value) {
        this.__attrs.set('readOnly', !!value);
      },
    }, {
      key: "disabled",
      get: function get() {
        return !!this.__attrs.get('disabled');
      },
      set: function set(value) {
        value = !!value;

        this.__attrs.set('disabled', value);
      },
    }, {
      key: "maxlength",
      get: function get() {
        return this.__attrs.get('maxlength');
      },
      set: function set(value) {
        this.__attrs.set('maxlength', value);
      },
    }, {
      key: "placeholder",
      get: function get() {
        return this.__attrs.get('placeholder') || '';
      },
      set: function set(value) {
        value = '' + value;

        this.__attrs.set('placeholder', value);
      },
    }, {
      key: "selectionStart",
      get: function get() {
        var value = +this.__attrs.get('selection-start');
        return value !== undefined ? value : -1;
      },
      set: function set(value) {
        this.__attrs.set('selection-start', value);
      },
    }, {
      key: "selectionEnd",
      get: function get() {
        var value = +this.__attrs.get('selection-end');
        return value !== undefined ? value : -1;
      },
      set: function set(value) {
        this.__attrs.set('selection-end', value);
      },
    }]);

    return HTMLTextAreaElement;
  }(Element);

  var HTMLVideoElement = /*#__PURE__*/function (_Element) {
    inheritsLoose(HTMLVideoElement, _Element);

    function HTMLVideoElement(options) {
      var _this;

      var width = options.width;
      var height = options.height;
      if ( typeof width === 'number' && width >= 0 ) options.attrs.width = width;
      if ( typeof height === 'number' && height >= 0 ) options.attrs.height = height;
      _this = _Element.call(this, options) || this;

      _this.$_initRect();

      return _this;
    }

    var _proto = HTMLVideoElement.prototype;

    _proto.$_initRect = function $_initRect() {
      var width = parseInt(this.__attrs.get('width'), 10);
      var height = parseInt(this.__attrs.get('height'), 10);
      if ( typeof width === 'number' && width >= 0 ) this.$_style.width = width + "px";
      if ( typeof height === 'number' && height >= 0 ) this.$_style.height = height + "px";
    };

    createClass(HTMLVideoElement, [{
      key: "_renderInfo",
      get: function get() {
        return _extends_1({
          nodeId: this.__nodeId,
          pageId: this.__pageId,
          nodeType: 'video',
        }, this.__attrs.__value, {
          style: this.style.cssText,
          class: 'h5-video ' + this.className,
        });
      },
    }, {
      key: "src",
      get: function get() {
        return this.__attrs.get('src') || '';
      },
      set: function set(value) {
        if ( !value || typeof value !== 'string' ) return;

        this.__attrs.set('src', value);
      },
    }, {
      key: "width",
      get: function get() {
        return +this.__attrs.get('width') || 0;
      },
      set: function set(value) {
        if ( typeof value !== 'number' || !isFinite(value) || value < 0 ) return;

        this.__attrs.set('width', value);

        this.$_initRect();
      },
    }, {
      key: "height",
      get: function get() {
        return +this.__attrs.get('height') || 0;
      },
      set: function set(value) {
        if ( typeof value !== 'number' || !isFinite(value) || value < 0 ) return;

        this.__attrs.set('height', value);

        this.$_initRect();
      },
    }, {
      key: "autoplay",
      get: function get() {
        return !!this.__attrs.get('autoplay');
      },
      set: function set(value) {
        value = !!value;

        this.__attrs.set('autoplay', value);
      },
    }, {
      key: "loop",
      get: function get() {
        return !!this.__attrs.get('loop');
      },
      set: function set(value) {
        value = !!value;

        this.__attrs.set('loop', value);
      },
    }, {
      key: "muted",
      get: function get() {
        return !!this.__attrs.get('muted');
      },
      set: function set(value) {
        value = !!value;

        this.__attrs.set('muted', value);
      },
    }, {
      key: "controls",
      get: function get() {
        var value = this.__attrs.get('controls');

        return value !== undefined ? !!value : true;
      },
      set: function set(value) {
        this.__attrs.set('controls', value);
      },
    }, {
      key: "poster",
      get: function get() {
        return this.__attrs.get('poster');
      },
      set: function set(value) {
        if ( !value || typeof value !== 'string' ) return;

        this.__attrs.set('poster', value);
      },
    }, {
      key: "currentTime",
      get: function get() {
        return +this.__attrs.get('currentTime') || 0;
      },
    }, {
      key: "buffered",
      get: function get() {
        return this.__attrs.get('buffered');
      },
    }]);

    return HTMLVideoElement;
  }(Element);

  var CustomComponent = /*#__PURE__*/function (_Element) {
    inheritsLoose(CustomComponent, _Element);

    function CustomComponent(options) {
      var _this;

      _this = _Element.call(this, options) || this;
      _this.__nativeType = options.nativeType;
      return _this;
    }

    var _proto = CustomComponent.prototype;

    _proto.$$destroy = function $$destroy() {
      _Element.prototype.$$destroy.call(this);

      this.__nativeType = null;
    };

    createClass(CustomComponent, [{
      key: "_renderInfo",
      get: function get() {
        var _this2 = this;

        var renderInfo = _extends_1({
          nodeId: this.__nodeId,
          pageId: this.__pageId,
          nodeType: this.__tagName,
          style: this.style.cssText,
          className: this.className,
        }, this.__attrs.__value);

        var config = cache.getConfig();
        var nativeInfo = null;

        if ( this.__nativeType === 'customComponent' ) {
          nativeInfo = config.usingComponents[this.__tagName];
        } else if ( this.__nativeType === 'miniappPlugin' ) {
          nativeInfo = config.usingPlugins[this.__tagName];
        }

        if ( nativeInfo ) {
          // Bind methods to every element which is used recursively to generate dom tree
          nativeInfo.events.forEach(function (event) {
            var eventName = _this2.__tagName + "_" + event + "_" + tool.getId();
            renderInfo[event] = eventName;
            cache.setElementMethods(eventName, function () {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              _this2.$$trigger(event, {
                args: args,
              });
            });
          });
        }

        return renderInfo;
      },
    }]);

    return CustomComponent;
  }(Element);

  var Performance = /*#__PURE__*/function () {
    function Performance() {
      this.recorder = new Map();
    }

    var _proto = Performance.prototype;

    _proto.start = function start(id) {
      var _cache$getConfig = cache.getConfig(),
        debug = _cache$getConfig.debug;

      if ( !debug ) {
        return;
      }

      this.recorder.set(id, Date.now());
    };

    _proto.stop = function stop(id) {
      var _cache$getConfig2 = cache.getConfig(),
        debug = _cache$getConfig2.debug;

      if ( !debug ) {
        return;
      }

      var now = Date.now();
      var prev = this.recorder.get(id);

      if ( !prev ) {
        console.warn(id + " hasn't invoke start method, please check your code!");
        return;
      }

      var time = now - prev;
      console.log(id + " Take: " + time + "ms");
    };

    return Performance;
  }();

  var perf = new Performance();

  function getProperty(obj, path, cache) {
    // Reduce traversal through cache
    cache.find(function (_ref) {
      var cachedPath = _ref.path,
        value = _ref.value;

      if ( cachedPath === path ) {
        path = '';
        obj = value;
        return true;
      } else {
        var pathSplited = path.split(cachedPath + ".");

        if ( pathSplited.length > 1 ) {
          path = pathSplited[1];
          obj = value;
          return true;
        }
      }

      return false;
    });
    var value = obj;
    var parentRendered = true;

    if ( Object.prototype.toString.call(value) !== '[object Object]' && !Array.isArray(value) ) {
      return {
        parentRendered: parentRendered,
        value: value,
      };
    }

    var keys = path.split('.');

    if ( keys.length > 0 ) {
      for (var i = 0; i < keys.length; i++) {
        var matched = keys[i].match(/\[(.+?)\]/);
        var key = matched && matched[1] ? matched[1] : keys[i]; // If i is not equal to keys length - 1, the parent node doesn't exist in the view

        if ( !value[key] && i !== keys.length - 1 ) {
          parentRendered = false;
          break;
        }
        value = value[key];
      }
    }

    return {
      parentRendered: parentRendered,
      value: value,
    };
  }

  var RootElement = /*#__PURE__*/function (_Element) {
    inheritsLoose(RootElement, _Element);

    function RootElement(options) {
      var _this;

      _this = _Element.call(this, options) || this;
      _this.__nodeId = options.nodeId;
      _this.allowRender = true;
      _this.renderStacks = [];
      _this.__renderCallbacks = [];
      return _this;
    }

    var _proto = RootElement.prototype;

    _proto.$$destroy = function $$destroy() {
      _Element.prototype.$$destroy.call(this);

      this.allowRender = null;
      this.renderStacks = null;
    };

    _proto.enqueueRender = function enqueueRender(payload) {
      var _this2 = this;

      clearTimeout(this.__timer);
      this.__timer = setTimeout(function () {
        _this2.executeRender();
      }, 0);
      this.renderStacks.push(payload);
    };

    _proto.executeRender = function executeRender() {
      var _this3 = this;

      if ( !this.allowRender ) {
        return;
      }

      {
        perf.start('setData');
      } // type 1: { path, start, deleteCount, item? } => need to simplify item
      // type 2: { path, value }


      var internal = cache.getDocument(this.__pageId)._internal;

      if ( internal.$batchedUpdates ) {
        var callback;
        internal.$batchedUpdates(function () {
          _this3.renderStacks.forEach(function (task, index) {
            if ( index === _this3.renderStacks.length - 1 ) {
              callback = function callback() {
                {
                  perf.stop('setData');
                }

                var fn;

                while (fn = _this3.__renderCallbacks.pop()) {
                  fn();
                }
              };

              internal.firstRenderCallback();
            }

            if ( task.type === 'children' ) {
              var _internal$$spliceData;

              var spliceArgs = [task.start, task.deleteCount];
              internal.$spliceData((_internal$$spliceData = {}, _internal$$spliceData[task.path] = task.item ? spliceArgs.concat(task.item) : spliceArgs, _internal$$spliceData), callback);
            } else {
              var _internal$setData;

              internal.setData((_internal$setData = {}, _internal$setData[task.path] = task.value, _internal$setData), callback);
            }
          });
        });
      } else {
        var renderObject = {};
        var pathCache = [];
        this.renderStacks.forEach(function (task) {
          var path = task.path; // there is no need to aggregate arrays if $batchedUpdate and $spliceData exist

          if ( task.type === 'children' ) {
            var taskInfo = getProperty(internal.data, path, pathCache); // path cache should save lastest taskInfo value

            pathCache.push({
              path: task.path,
              value: taskInfo.value,
            });

            if ( !renderObject[path] ) {
              renderObject[path] = taskInfo.value ? [].concat(taskInfo.value) : [];
            }

            if ( task.item ) {
              renderObject[path].splice(task.start, task.deleteCount, task.item);
            } else {
              renderObject[path].splice(task.start, task.deleteCount);
            }
          } else {
            renderObject[path] = task.value;
          }
        });
        internal.firstRenderCallback(renderObject);
        internal.setData(renderObject, function () {
          var fn;

          while (fn = _this3.__renderCallbacks.pop()) {
            fn();
          }

          {
            perf.stop('setData');
          }
        });
      }

      this.renderStacks = [];
    };

    createClass(RootElement, [{
      key: "_path",
      get: function get() {
        return 'root';
      },
    }, {
      key: "_root",
      get: function get() {
        return this;
      },
    }]);

    return RootElement;
  }(Element);

  var CONSTRUCTOR_MAP = new Map([['img', Image], ['input', HTMLInputElement], ['textarea', HTMLTextAreaElement], ['video', HTMLVideoElement]]);

  var Document = /*#__PURE__*/function (_EventTarget) {
    inheritsLoose(Document, _EventTarget);

    function Document(pageId) {
      var _this;

      _this = _EventTarget.call(this) || this;

      var _cache$getConfig = cache.getConfig(),
        _cache$getConfig$usin = _cache$getConfig.usingComponents,
        usingComponents = _cache$getConfig$usin === void 0 ? {} : _cache$getConfig$usin,
        _cache$getConfig$usin2 = _cache$getConfig.usingPlugins,
        usingPlugins = _cache$getConfig$usin2 === void 0 ? {} : _cache$getConfig$usin2;

      _this.usingComponents = usingComponents;
      _this.usingPlugins = usingPlugins;
      _this.__idMap = new Map();
      _this.__pageId = pageId;
      var bodyNodeId = BODY_NODE_ID + "-" + pageId;
      _this.__root = new RootElement({
        nodeId: bodyNodeId,
        type: 'element',
        tagName: 'body',
        attrs: {},
        children: [],
        document: assertThisInitialized(_this),
      });
      cache.setNode(bodyNodeId, _this.__root); // update body's parentNode

      _this.__root.parentNode = assertThisInitialized(_this);
      return _this;
    } // Event trigger


    var _proto = Document.prototype;

    _proto.$$trigger = function $$trigger(eventName, options) {
      return this.documentElement.$$trigger(eventName, options);
    };

    _proto._isRendered = function _isRendered() {
      return true;
    };

    _proto._createElement = function _createElement(options) {
      var ConstructorClass = CONSTRUCTOR_MAP.get(options.tagName);

      if ( ConstructorClass ) {
        return new ConstructorClass(options);
      }

      options.attrs = options.attrs || {};

      if ( options.attrs.__native ) {
        if ( this.usingComponents[options.tagName] ) {
          // Transform to custom-component
          options.nativeType = 'customComponent';
          return new CustomComponent(options);
        } else if ( this.usingPlugins[options.tagName] ) {
          options.nativeType = 'miniappPlugin';
          return new CustomComponent(options);
        }
      } else {
        return new Element(options);
      }
    } // Node type
    ;

    _proto.getElementById = function getElementById(id) {
      if ( typeof id !== 'string' ) return;

      var element = this.__idMap.get(id);

      if ( element && element._isRendered() ) {
        return element;
      }

      return null;
    };

    _proto.getElementsByTagName = function getElementsByTagName(tagName) {
      var _this2 = this;

      if ( typeof tagName !== 'string' ) return [];
      var elements = [];
      cache.getAllNodes()
        .forEach(function (element) {
          if ( element && element.__tagName === tagName && element._isRendered() && element.__pageId === _this2.__pageId ) {
            elements.push(element);
          }
        });
      return elements;
    };

    _proto.getElementsByClassName = function getElementsByClassName(className) {
      var _this3 = this;

      if ( typeof className !== 'string' ) return [];
      var elements = [];
      cache.getAllNodes()
        .forEach(function (element) {
          var classNames = className.trim()
            .split(/\s+/);

          if ( element && element._isRendered() && element.__pageId === _this3.__pageId && classNames.every(function (c) {
            return element.classList && element.classList.contains(c);
          }) ) {
            elements.push(element);
          }
        });
      return elements;
    };

    _proto.querySelector = function querySelector(selector) {
      if ( typeof selector !== 'string' ) return;

      if ( selector[0] === '.' ) {
        var elements = this.getElementsByClassName(selector.slice(1));
        return elements.length > 0 ? elements[0] : null;
      } else if ( selector[0] === '#' ) {
        return this.getElementById(selector.slice(1));
      } else if ( /^[a-zA-Z]/.test(selector) ) {
        var _elements = this.getElementsByTagName(selector);

        return _elements.length > 0 ? _elements[0] : null;
      }

      return null;
    };

    _proto.querySelectorAll = function querySelectorAll(selector) {
      if ( typeof selector !== 'string' ) return [];

      if ( selector[0] === '.' ) {
        return this.getElementsByClassName(selector.slice(1));
      } else if ( selector[0] === '#' ) {
        var element = this.getElementById(selector.slice(1));
        return element ? [element] : [];
      } else if ( /^[a-zA-Z]/.test(selector) ) {
        return this.getElementsByTagName(selector);
      }

      return null;
    };

    _proto.createElement = function createElement(tagName) {
      return this._createElement({
        document: this,
        tagName: tagName,
      });
    };

    _proto.createElementNS = function createElementNS(ns, tagName) {
      // Actually use createElement
      return this.createElement(tagName);
    };

    _proto.createTextNode = function createTextNode(content) {
      content = '' + content;
      return new TextNode({
        content: content,
        document: this,
      });
    };

    _proto.createComment = function createComment(data) {
      return new Comment({
        document: this,
        data: data,
      });
    };

    _proto.createDocumentFragment = function createDocumentFragment() {
      return new Element({
        tagName: 'documentfragment',
        nodeType: Node.DOCUMENT_FRAGMENT_NODE,
        document: this,
      });
    };

    _proto.createEvent = function createEvent() {
      var window = cache.getWindow();
      return new window.CustomEvent();
    };

    _proto.addEventListener = function addEventListener(eventName, handler, options) {
      this.documentElement.addEventListener(eventName, handler, options);
    };

    _proto.removeEventListener = function removeEventListener(eventName, handler, isCapture) {
      this.documentElement.removeEventListener(eventName, handler, isCapture);
    };

    _proto.dispatchEvent = function dispatchEvent(evt) {
      this.documentElement.dispatchEvent(evt);
    };

    createClass(Document, [{
      key: "nodeType",
      get: function get() {
        return Node.DOCUMENT_NODE;
      },
    }, {
      key: "documentElement",
      get: function get() {
        return this.body;
      },
    }, {
      key: "body",
      get: function get() {
        return this.__root;
      },
    }, {
      key: "nodeName",
      get: function get() {
        return '#document';
      },
    }, {
      key: "defaultView",
      get: function get() {
        return cache.getWindow() || null;
      },
    }]);

    return Document;
  }(EventTarget);

  function createDocument(pageId) {
    var document = new Document(pageId);
    cache.init(pageId, {
      document: document,
    });
    return document;
  }

  // eslint-disable-next-line import/no-extraneous-dependencies
  function createAppConfig(init, config, packageName) {
    if ( packageName === void 0 ) {
      packageName = 'main';
    }

    cache.setConfig(config);
    var appConfig = {
      launched: true,
      onLaunch: function onLaunch(options) {

        var window = createWindow();
        cache.setWindow(packageName, window); // In wechat miniprogram getCurrentPages() length is 0, so web bundle only can be executed in first page

        {
          // Use page route as pageId key word
          // eslint-disable-next-line no-undef
          var currentPageId = getCurrentPages()[0].route + "-1";
          var currentDocument = createDocument(currentPageId);
          this.__pageId = window.__pageId = currentPageId;
          init(window, currentDocument);
          window.$$trigger('launch', {
            event: {
              options: options,
              context: this,
            },
          });
        }

        this.window = window;
      },
      onShow: function onShow(options) {
        if ( this.window && this.launched ) {
          this.__showOptions = options;
          this.window.$$trigger('appshow', {
            event: {
              options: options,
              context: this,
            },
          });
        }
      },
      onHide: function onHide() {
        if ( this.window ) {
          this.window.$$trigger('apphide', {
            event: {
              context: this,
            },
          });
        }
      },
      onError: function onError(err) {
        if ( this.window ) {
          // eslint-disable-next-line no-undef
          var pages = getCurrentPages() || [];
          var currentPage = pages[pages.length - 1];

          if ( currentPage && currentPage.window ) {
            currentPage.window.$$trigger('error', {
              event: err,
            });
          }

          this.window.$$trigger('apperror', {
            event: {
              context: this,
              error: err,
            },
          });
        }
      },
      onPageNotFound: function onPageNotFound(options) {
        if ( this.window ) {
          this.window.$$trigger('pagenotfound', {
            event: {
              options: options,
              context: this,
            },
          });
        }
      },
    };

    {
      appConfig.onShareAppMessage = function (options) {
        if ( this.window ) {
          var shareInfo = {};
          this.window.$$trigger('appshare', {
            event: {
              options: options,
              shareInfo: shareInfo,
            },
          });
          return shareInfo.content;
        }
      };
    }

    return appConfig;
  }

  // eslint-disable-next-line import/no-extraneous-dependencies

  function createLifeCycleCallback(lifeCycle) {
    if ( lifeCycle === 'onShareAppMessage' ) {
      return function (options) {
        if ( this.document ) {
          var shareInfo = {};
          var returnedShareInfo = this.document.$$trigger('onShareAppMessage', {
            event: {
              options: options,
              shareInfo: shareInfo,
            },
          });
          return returnedShareInfo || shareInfo.content;
        }
      };
    }

    return function (event) {
      if ( this.document ) {
        this.document.$$trigger(lifeCycle, {
          event: event,
        });
      }
    };
  }

  function injectLifeCycle(lifeCycles, config) {
    lifeCycles.forEach(function (lifeCycle) {
      if ( !['onLoad', 'onShow', 'onHide', 'onUnload'].includes(lifeCycle) ) {
        if ( NATIVE_EVENTS_LIST.includes(lifeCycle) ) {
          if ( !config.events ) {
            config.events = {};
          } // Define special lifecycle in config's events


          config.events[lifeCycle] = createLifeCycleCallback(lifeCycle);
        } else {
          config[lifeCycle] = createLifeCycleCallback(lifeCycle);
        }
      }
    });
  }

  function getDomNodeFromEvt(eventName, evt) {
    if ( !evt ) return;
    var target = eventName.indexOf('canvas') === 0 ? evt.target : evt.currentTarget;
    return cache.getNode(target && target.dataset.privateNodeId);
  }

  var _ref;

  // Events which should bubble
  var baseEvents = [{
    name: 'onTap',
    eventName: 'click',
    extra: {
      button: 0,
    },
  }, (_ref = {
    name: 'onLongTap',
  }, _ref["name"] = 'longtap', _ref), {
    name: 'onTouchStart',
    eventName: 'touchstart',
  }, {
    name: 'onTouchMove',
    eventName: 'touchmove',
  }, {
    name: 'onTouchEnd',
    eventName: 'touchend',
  }, {
    name: 'onTouchCancel',
    eventName: 'touchcancel',
  }];

  var coverImage = {
    name: 'cover-image',
    singleEvents: [{
      name: 'onCoverImageLoad',
      eventName: 'load',
    }, {
      name: 'onCoverImageError',
      eventName: 'error',
    }],
  };

  var coverView = {
    name: 'cover-view',
  };

  var movableArea = {
    name: 'movable-area',
  };

  // eslint-disable-next-line import/no-extraneous-dependencies
  var ScrollView = {
    name: 'scroll-view',
    singleEvents: [{
      name: 'onScrollViewScrollToUpper',
      eventName: 'scrolltoupper',
    }, {
      name: 'onScrollViewScrollToLower',
      eventName: 'scrolltolower',
    }],
    functionalSingleEvents: [{
      name: 'onScrollViewScroll',
      eventName: 'scroll',
      middleware: function middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('scroll-into-view', '');

        domNode._setAttributeWithOutUpdate('scroll-top', evt.detail.scrollTop);

        domNode._setAttributeWithOutUpdate('scroll-left', evt.detail.scrollLeft);
      },
    }],
  };

  // eslint-disable-next-line import/no-extraneous-dependencies
  var swiper = {
    name: 'swiper',
    singleEvents: [{
      name: 'onSwiperTransition',
      eventName: 'transition',
    }],
    functionalSingleEvents: [{
      name: 'onSwiperChange',
      eventName: 'change',
      middleware: function middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('current', evt.detail.current);
      },
    }],
  };

  {
    swiper.singleEvents.push({
      name: 'onSwiperAnimationEnd',
      eventName: 'animationEnd',
    });
  }

  // eslint-disable-next-line import/no-extraneous-dependencies
  var view = {
    name: 'view',
  };

  {
    view.simpleEvents = [{
      name: 'onViewAppear',
      eventName: 'appear',
    }, {
      name: 'onViewFirstAppear',
      eventName: 'firstappear',
    }, {
      name: 'onViewDisappear',
      eventName: 'disappear',
    }];
  }

  var icon = {
    name: 'icon',
  };

  var progress = {
    name: 'progress',
    singleEvents: [{
      name: 'onProgressActiveEnd',
      eventName: 'activeend',
    }],
  };

  var text = {
    name: 'text',
  };

  var richText = {
    name: 'rich-text',
  };

  var button = {
    name: 'button',
    singleEvents: [{
      name: 'onButtonGetUserInfo',
      eventName: 'getuserinfo',
    }, {
      name: 'onButtonContact',
      eventName: 'contact',
    }, {
      name: 'onButtonGetPhoneNumber',
      eventName: 'getphonenumber',
    }, {
      name: 'onButtonError',
      eventName: 'error',
    }, {
      name: 'onButtonOpenSetting',
      eventName: 'opensetting',
    }, {
      name: 'onButtonLaunchApp',
      eventName: 'launchapp',
    }, {
      name: 'onButtonGetAuthorize',
      eventName: 'getauthorize',
    }],
  };

  var editor = {
    name: 'editor',
    singleEvents: [{
      name: 'onEditorReady',
      eventName: 'ready',
    }, {
      name: 'onEditorFocus',
      eventName: 'focus',
    }, {
      name: 'onEditorBlur',
      eventName: 'blur',
    }, {
      name: 'onEditorInput',
      eventName: 'input',
    }, {
      name: 'onEditorStatusChange',
      eventName: 'statuschange',
    }],
  };

  var form = {
    name: 'form',
    singleEvents: [{
      name: 'onFormSubmit',
      eventName: 'submit',
    }, {
      name: 'onFormReset',
      eventName: 'reset',
    }],
  };

  var label = {
    name: 'label',
  };

  var input = {
    name: 'input',
    simpleEvents: [{
      name: 'onInputConfirm',
      eventName: 'confirm',
    }],
    singleEvents: [{
      name: 'onInputKeyBoardHeightChange',
      eventName: 'keyboardheightchange',
    }],
    complexEvents: [{
      name: 'onInputInput',
      eventName: 'input',
      middleware: function middleware(evt, domNode, nodeId) {
        var value = '' + evt.detail.value;

        domNode._setAttributeWithOutUpdate('value', value);

        this.callEvent('input', evt, null, nodeId);
      },
    }, {
      name: 'onInputFocus',
      eventName: 'focus',
      middleware: function middleware(evt, domNode, nodeId) {
        domNode.__inputOldValue = domNode.value || '';

        domNode._setAttributeWithOutUpdate('focus-state', true);

        this.callSimpleEvent('focus', evt, domNode);
      },
    }, {
      name: 'onInputBlur',
      eventName: 'blur',
      middleware: function middleware(evt, domNode, nodeId) {
        domNode._setAttributeWithOutUpdate('focus-state', false);

        if ( domNode.__inputOldValue !== undefined && domNode.value !== domNode.__inputOldValue ) {
          domNode.__inputOldValue = undefined;
          this.callEvent('change', evt, null, nodeId);
        }

        this.callSimpleEvent('blur', evt, domNode);
      },
    }],
  };

  var radioGroup = {
    name: 'radio-group',
    singleEvents: [{
      name: 'onRadioChange',
      eventName: 'change',
    }],
  };

  var radio = {
    name: 'radio',
    singleEvents: [{
      name: 'onRadioChange',
      eventName: 'change',
    }],
  };

  var checkboxGroup = {
    name: 'checkbox-group',
    singleEvents: [{
      name: 'onCheckboxChange',
      eventName: 'change',
    }],
  };

  var checkbox = {
    name: 'checkbox',
    singleEvents: [{
      name: 'onCheckboxItemChange',
      eventName: 'change',
    }],
  };

  // eslint-disable-next-line import/no-extraneous-dependencies
  var picker = {
    name: 'picker',
    singleEvents: [{
      name: 'onPickerCancel',
      eventName: 'cancel',
    }],
    functionalSingleEvents: [{
      name: 'onPickerChange',
      eventName: 'change',
      middleware: function middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('value', evt.detail.value);
      },
    }],
  };

  var pickerView = {
    name: 'picker-view',
    singleEvents: [{
      name: 'onPickerViewPickstart',
      eventName: 'pickstart',
    }, {
      name: 'onPickerViewPickend',
      eventName: 'pickend',
    }],
    functionalSingleEvents: [{
      name: 'onPickerViewChange',
      eventName: 'change',
      middleware: function middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('value', evt.detail.value);
      },
    }],
  };

  var slider = {
    name: 'slider',
    singleEvents: [{
      name: 'onSliderChanging',
      eventName: 'changing',
    }],
    functionalSingleEvents: [{
      name: 'onSliderChange',
      eventName: 'change',
      middleware: function middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('value', evt.detail.value);

        domNode.__oldValues = domNode.__oldValues || {};
        domNode.__oldValues.value = evt.detail.value;
      },
    }],
  };

  var switchCom = {
    name: 'switch',
    functionalSingleEvents: [{
      name: 'onSwitchChange',
      eventName: 'change',
      middleware: function middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('checked', evt.detail.value);
      },
    }],
  };

  var textarea = {
    name: 'textarea',
    singleEvents: [{
      name: 'keyboardheightchange',
      eventName: 'keyboardheightchange',
    }],
    simpleEvents: [{
      name: 'onTextareaConfirm',
      eventName: 'confirm',
    }],
    complexEvents: [{
      name: 'onTextareaFocus',
      eventName: 'input',
      middleware: function middleware(evt, domNode, nodeId) {
        domNode.__textareaOldValue = domNode.value || '';

        domNode._setAttributeWithOutUpdate('focus-state', true);

        this.callSimpleEvent('focus', evt, domNode);
      },
    }, {
      name: 'onTextareaBlur',
      eventName: 'blur',
      middleware: function middleware(evt, domNode, nodeId) {
        domNode._setAttributeWithOutUpdate('focus-state', false);

        if ( domNode.__textareaOldValue !== undefined && domNode.value !== domNode.__textareaOldValue ) {
          domNode.__textareaOldValue = undefined;
          this.callEvent('change', evt, null, nodeId);
        }

        this.callSimpleEvent('blur', evt, domNode);
      },
    }, {
      name: 'onTextareaInput',
      eventName: 'input',
      middleware: function middleware(evt, domNode, nodeId) {
        var value = '' + evt.detail.value;

        domNode._setAttributeWithOutUpdate('value', value);

        this.callEvent('input', evt, null, nodeId);
      },
    }],
  };

  var navigator = {
    name: 'navigator',
    singleEvents: [{
      name: 'onNavigatorSuccess',
      eventName: 'success',
    }, {
      name: 'onNavigatorFail',
      eventName: 'fail',
    }, {
      name: 'onNavigatorComplete',
      eventName: 'complete',
    }],
  };

  // eslint-disable-next-line import/no-extraneous-dependencies
  var camera = {
    name: 'camera',
  };

  var image = {
    name: 'image',
    singleEvents: [{
      name: 'onImageLoad',
      eventName: 'load',
    }, {
      name: 'onImageError',
      eventName: 'error',
    }],
  };

  var video = {
    name: 'video',
    singleEvents: [{
      name: 'onVideoPlay',
      eventName: 'play',
    }, {
      name: 'onVideoPause',
      eventName: 'pause',
    }, {
      name: 'onVideoEnded',
      eventName: 'ended',
    }, {
      name: 'onVideoFullScreenChange',
      eventName: 'fullscreenchange',
    }, {
      name: 'onVideoWaiting',
      eventName: 'waiting',
    }, {
      name: 'onVideoError',
      eventName: 'error',
    }],
    functionalSingleEvents: [{
      name: 'onVideoTimeUpdate',
      eventName: 'timeupdate',
      middleware: function middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('currentTime', evt.detail.currentTime);
      },
    }, {
      name: 'onVideoProgress',
      eventName: 'progress',
      middleware: function middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('buffered', evt.detail.buffered);
      },
    }],
  };

  // eslint-disable-next-line import/no-extraneous-dependencies
  var map = {
    name: 'map',
    singleEvents: [{
      name: 'onMapTap',
      eventName: 'tap',
    }, {
      name: 'onMapUpdated',
      eventName: 'updated',
    }, {
      name: 'onMapPoiTap',
      eventName: 'poitap',
    }],
    functionalSingleEvents: [{
      name: 'onMapRegionChange',
      eventName: 'regionchange',
      middleware: function middleware(evt, domNode) {
        {
          evt.detail = {
            type: evt.detail,
            latitude: evt.latitude,
            longitude: evt.longitude,
            scale: evt.scale,
            skew: evt.skew,
            rotate: evt.rotate,
            causedBy: evt.causedBy,
          };
        }
      },
    }, {
      name: 'onMapMarkerTap',
      eventName: 'markertap',
      middleware: function middleware(evt, domNode) {
        {
          evt.detail = {
            markerId: evt.markerId,
            latitude: evt.latitude,
            longitude: evt.longitude,
          };
        }
      },
    }, {
      name: 'onMapControlTap',
      eventName: 'controltap',
      middleware: function middleware(evt, domNode) {
        {
          evt.detail = {
            controlId: evt.controlId,
          };
        }
      },
    }, {
      name: 'onMapCalloutTap',
      eventName: 'callouttap',
      middleware: function middleware(evt, domNode) {
        {
          evt.detail = {
            markerId: evt.markerId,
            latitude: evt.latitude,
            longitude: evt.longitude,
          };
        }
      },
    }, {
      name: 'onMapPanelTap',
      eventName: 'paneltap',
      middleware: function middleware(evt, domNode) {
        {
          evt.detail = {
            panelId: evt.panelId,
            layoutId: evt.layoutId,
          };
        }
      },
    }],
  };

  var canvas = {
    name: 'canvas',
    singleEvents: [{
      name: 'onCanvasTouchStart',
      eventName: 'canvastouchstart',
    }, {
      name: 'onCanvasTouchMove',
      eventName: 'canvastouchmove',
    }, {
      name: 'onCanvasTouchEnd',
      eventName: 'canvastouchend',
    }, {
      name: 'onCanvasTouchCancel',
      eventName: 'canvastouchcancel',
    }, {
      name: 'onCanvasLongTap',
      eventName: 'longtap',
    }, {
      name: 'onCanvasError',
      eventName: 'error',
    }],
  };

  var webView = {
    name: 'web-view',
    singleEvents: [{
      name: 'onWebviewMessage',
      eventName: 'message',
    }, {
      name: 'onWebviewLoad',
      eventName: 'load',
    }, {
      name: 'onWebviewError',
      eventName: 'error',
    }],
  };

  // eslint-disable-next-line import/no-extraneous-dependencies
  var livePlayer = {
    name: 'live-player',
    singleEvents: [{
      name: 'onLivePlayerStateChange',
      eventName: 'statechange',
    }, {
      name: 'onLivePlayerFullScreenChange',
      eventName: 'fullscreenchange',
    }],
  };

  {
    livePlayer.singleEvents = livePlayer.singleEvents.concat([{
      name: 'onLivePlayerError',
      eventName: 'error',
    }, {
      name: 'onLiverPlayerUserAction',
      eventName: 'useraction',
    }]);
  }

  // eslint-disable-next-line import/no-extraneous-dependencies
  var livePusher = {
    name: 'live-pusher',
    singleEvents: [{
      name: 'onLivePusherStateChange',
      eventName: 'statechange',
    }, {
      name: 'onLivePusherError',
      eventName: 'error',
    }, {
      name: 'onLivePusherNetStatus',
      eventName: 'netstatus',
    }],
  };

  var movableView = {
    name: 'movable-view',
    singleEvents: [{
      name: 'onMovableViewHtouchmove',
      eventName: 'htouchmove',
    }, {
      name: 'onMovableViewVtouchmove',
      eventName: 'vtouchmove',
    }],
    functionalSingleEvents: [{
      name: 'onMovableViewChange',
      eventName: 'change',
      middleware: function middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('x', evt.detail.x);

        domNode._setAttributeWithOutUpdate('y', evt.detail.y);
      },
    }, {
      name: 'onMovableViewScale',
      eventName: 'scale',
      middleware: function middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('x', evt.detail.x);

        domNode._setAttributeWithOutUpdate('y', evt.detail.y);

        domNode._setAttributeWithOutUpdate('scale-value', evt.detail.scale);
      },
    }],
  };

  var swiperItem = {
    name: 'swiper-item',
  };

  var pickerViewColumn = {
    name: 'picker-view-column',
  };

  // Components
  var components = [coverImage, coverView, movableArea, ScrollView, swiper, view, icon, progress, text, richText, button, editor, form, label, input, radioGroup, radio, checkboxGroup, checkbox, picker, pickerView, slider, switchCom, textarea, navigator, camera, image, video, map, canvas, webView, livePlayer, livePusher, movableView, swiperItem, pickerViewColumn];
  var handlesMap = {
    simpleEvents: [],
    singleEvents: [],
    functionalSingleEvents: [],
    complexEvents: [],
  };
  components.forEach(function (_ref) {
    var simpleEvents = _ref.simpleEvents,
      singleEvents = _ref.singleEvents,
      functionalSingleEvents = _ref.functionalSingleEvents,
      complexEvents = _ref.complexEvents;

    if ( simpleEvents ) {
      handlesMap.simpleEvents = handlesMap.simpleEvents.concat(simpleEvents);
    }

    if ( singleEvents ) {
      handlesMap.singleEvents = handlesMap.singleEvents.concat(singleEvents);
    }

    if ( functionalSingleEvents ) {
      handlesMap.functionalSingleEvents = handlesMap.functionalSingleEvents.concat(functionalSingleEvents);
    }

    if ( complexEvents ) {
      handlesMap.complexEvents = handlesMap.complexEvents.concat(complexEvents);
    }
  });

  function callEvent(eventName, evt, extra, nodeId) {
    var originNode = cache.getNode(nodeId);
    if ( !originNode ) return;
    EventTarget.$$process(originNode, eventName, evt, extra);
  }

  function callSimpleEvent(eventName, evt, domNode) {
    if ( !domNode ) return;
    EventTarget.$$process(domNode, new Event({
      name: eventName,
      target: domNode,
      eventPhase: Event.AT_TARGET,
      detail: evt && evt.detail,
      $$extra: evt && evt.extra,
      bubbles: false,
    }));
  }

  function callSingleEvent(eventName, evt) {
    var domNode = this.getDomNodeFromEvt(eventName, evt);
    if ( !domNode ) return;
    domNode.$$trigger(eventName, {
      event: new Event({
        timeStamp: evt && evt.timeStamp,
        touches: evt && evt.touches,
        changedTouches: evt && evt.changedTouches,
        name: eventName,
        target: domNode,
        eventPhase: Event.AT_TARGET,
        detail: evt && evt.detail,
        $$extra: evt && evt.extra,
      }),
      currentTarget: domNode,
    });
  }

  // eslint-disable-next-line import/no-extraneous-dependencies

  function createEventProxy() {
    var config = {}; // Add get DOM Node from event method

    config.getDomNodeFromEvt = getDomNodeFromEvt; // Add call event method

    config.callEvent = callEvent; // Add call simple event method

    config.callSimpleEvent = callSimpleEvent; // Add call single event method

    config.callSingleEvent = callSingleEvent; // Add reactive event define which will bubble

    baseEvents.forEach(function (_ref) {
      var name = _ref.name,
        _ref$extra = _ref.extra,
        extra = _ref$extra === void 0 ? null : _ref$extra,
        eventName = _ref.eventName;

      config[name] = function (evt) {
        var domNode = this.getDomNodeFromEvt(eventName, evt);
        var document = domNode.ownerDocument;

        if ( document && document.__checkEvent(evt) ) {
          this.callEvent(eventName, evt, extra, evt.currentTarget.dataset.privateNodeId); // Default Left button
        }
      };
    }); // Add reactive event define which won't bubble

    handlesMap.simpleEvents.forEach(function (_ref2) {
      var name = _ref2.name,
        eventName = _ref2.eventName;

      config[name] = function (evt) {
        var nodeId = evt.currentTarget.dataset.privateNodeId;
        var targetNode = cache.getNode(nodeId);
        if ( !targetNode ) return;
        this.callSimpleEvent(eventName, evt, targetNode);
      };
    }); // Add reactive event define which only trigger once

    handlesMap.singleEvents.forEach(function (_ref3) {
      var name = _ref3.name,
        eventName = _ref3.eventName;

      config[name] = function (evt) {
        this.callSingleEvent(eventName, evt);
      };
    }); // Add reactive event define which only trigger once and need middleware

    handlesMap.functionalSingleEvents.forEach(function (_ref4) {
      var name = _ref4.name,
        eventName = _ref4.eventName,
        middleware = _ref4.middleware;

      config[name] = function (evt) {
        var domNode = this.getDomNodeFromEvt(eventName, evt);
        if ( !domNode ) return;
        middleware.call(this, evt, domNode);
        this.callSingleEvent(eventName, evt);
      };
    }); // Add reactive event define which complex

    handlesMap.complexEvents.forEach(function (_ref5) {
      var name = _ref5.name,
        eventName = _ref5.eventName,
        middleware = _ref5.middleware;

      config[name] = function (evt) {
        var domNode = this.getDomNodeFromEvt(eventName, evt);
        if ( !domNode ) return;
        middleware.call(this, evt, domNode, evt.currentTarget.dataset.privateNodeId);
      };
    });
    return config;
  }

  function getBaseLifeCycles(route, init, packageName) {
    if ( packageName === void 0 ) {
      packageName = 'main';
    }

    return {
      onLoad: function onLoad(query) {
        var _this = this;

        // eslint-disable-next-line no-undef
        var app = getApp();
        this.pageId = route + '-' + cache.getRouteId(route);

        if ( this.pageId === app.__pageId ) {
          this.document = cache.getDocument(this.pageId);
        } else {
          this.document = createDocument(this.pageId);
        }

        var isBundleLoaded = cache.hasWindow(packageName);

        if ( isBundleLoaded ) {
          this.window = cache.getWindow(packageName);
        } else {
          this.window = createWindow();
          cache.setWindow(packageName, this.window);
          init(this.window, this.document);
        } // In wechat miniprogram web bundle need be executed in first page


        this.document._internal = this;
        this.query = query; // Update location page options

        // this.window.history.location.__updatePageOption(query); // Set __pageId to global window object


        this.window.__pageId = this.pageId; // Find self render function
        // eslint-disable-next-line no-undef

        this.renderInfo = this.window.__pagesRenderInfo.find(function (_ref) {
          var path = _ref.path;
          return _this.pageId.substring(0, _this.pageId.lastIndexOf('-')) === path;
        });

        if ( !this.renderInfo && 'development' === 'development' ) {
          throw new Error("Could't find target render method.");
        }

        this.renderInfo.setDocument(this.document);
        this.renderInfo.render();
        this.document.$$trigger('DOMContentLoaded');
      },
      onShow: function onShow() {
        if ( this.window ) {
          // Update pageId
          this.window.__pageId = this.pageId;

          if ( !this.firstRender ) {
            this.renderInfo && this.renderInfo.setDocument(this.document);
          }

          this.document.$$trigger('miniapp_pageshow'); // compatible with original name

          this.document.$$trigger('onShow');
        }
      },
      onHide: function onHide() {
        if ( this.window ) {
          this.document.$$trigger('miniapp_pagehide'); // compatible with original name

          this.document.$$trigger('onHide');
        }
      },
      onUnload: function onUnload() {
        this.document.$$trigger('miniapp_pagehide');
        this.document.$$trigger('beforeunload');
        this.document.$$trigger('pageunload');
        this.document.__unmount && this.document.__unmount(); // Manually unmount component instance

        this.document.body.$$destroy();
        cache.destroy(this.pageId);
        this.pageId = null;
        this.window = null;
        this.document = null;
        this.query = null;
      },
    };
  }

  function createPageConfig(route, lifeCycles, init, packageName) {
    if ( lifeCycles === void 0 ) {
      lifeCycles = [];
    }

    if ( packageName === void 0 ) {
      packageName = 'main';
    }

    var pageConfig = _extends_1({
      firstRender: true,
      data: {
        root: {
          nodeId: BODY_NODE_ID,
          nodeType: 'h-element',
          children: [],
        },
      },
      firstRenderCallback: function firstRenderCallback(task) {
        if ( this.firstRender ) {
          this.firstRender = false;
          var initData = {
            pageId: this.pageId,
            'root.pageId': this.pageId,
            'root.nodeId': BODY_NODE_ID + "-" + this.pageId,
          };

          if ( task ) {
            Object.assign(task, initData);
          } else {
            this.setData(initData);
          }
        }
      },
    }, getBaseLifeCycles(route, init, packageName), createEventProxy()); // Define page lifecycles, like onReachBottom


    injectLifeCycle(lifeCycles, pageConfig);
    return pageConfig;
  }

  // eslint-disable-next-line import/no-extraneous-dependencies
  function getComponentLifeCycle(_ref) {
    var mount = _ref.mount,
      unmount = _ref.unmount,
      update = _ref.update;

    {
      return {
        didMount: function didMount() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          mount && mount.apply(this, args);
        },
        didUpdate: function didUpdate() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          update && update.apply(this, args);
        },
        didUnmount: function didUnmount() {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          unmount && unmount.apply(this, args);
        },
      };
    }
  }

  function createElementConfig() {
    {
      return _extends_1({
        props: {
          r: {},
        },
        methods: createEventProxy(),
      }, getComponentLifeCycle({
        mount: function mount() {
          cache.setElementInstance(this);
        },
      }));
    }
  }

  var index = {
    createAppConfig: createAppConfig,
    createPageConfig: createPageConfig,
    createElementConfig: createElementConfig,
  };

  return index;

})));
