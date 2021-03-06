var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;
/**
 * Add Redux DevTools support to Uppy
 *
 * See https://medium.com/@zalmoxis/redux-devtools-without-redux-or-how-to-have-a-predictable-state-with-any-architecture-61c5f5a7716f
 * and https://github.com/zalmoxisus/mobx-remotedev/blob/master/src/monitorActions.js
 */


module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(ReduxDevTools, _Plugin);

  function ReduxDevTools(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.type = 'debugger';
    _this.id = _this.opts.id || 'ReduxDevTools';
    _this.title = 'Redux DevTools'; // set default options

    var defaultOptions = {}; // merge default options with the ones set by user

    _this.opts = _extends({}, defaultOptions, opts);
    _this.handleStateChange = _this.handleStateChange.bind(_assertThisInitialized(_this));
    _this.initDevTools = _this.initDevTools.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = ReduxDevTools.prototype;

  _proto.handleStateChange = function handleStateChange(prevState, nextState, patch) {
    this.devTools.send('UPPY_STATE_UPDATE', nextState);
  };

  _proto.initDevTools = function initDevTools() {
    var _this2 = this;

    this.devTools = window.devToolsExtension.connect();
    this.devToolsUnsubscribe = this.devTools.subscribe(function (message) {
      if (message.type === 'DISPATCH') {
        console.log(message.payload.type); // Implement monitors actions

        switch (message.payload.type) {
          case 'RESET':
            _this2.uppy.reset();

            return;

          case 'IMPORT_STATE':
            {
              var computedStates = message.payload.nextLiftedState.computedStates;
              _this2.uppy.store.state = _extends({}, _this2.uppy.getState(), computedStates[computedStates.length - 1].state);

              _this2.uppy.updateAll(_this2.uppy.getState());

              return;
            }

          case 'JUMP_TO_STATE':
          case 'JUMP_TO_ACTION':
            _this2.uppy.store.state = _extends({}, _this2.uppy.getState(), JSON.parse(message.state));

            _this2.uppy.updateAll(_this2.uppy.getState());

        }
      }
    });
  };

  _proto.install = function install() {
    this.withDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;

    if (this.withDevTools) {
      this.initDevTools();
      this.uppy.on('state-update', this.handleStateChange);
    }
  };

  _proto.uninstall = function uninstall() {
    if (this.withDevTools) {
      this.devToolsUnsubscribe();
      this.uppy.off('state-update', this.handleStateUpdate);
    }
  };

  return ReduxDevTools;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);