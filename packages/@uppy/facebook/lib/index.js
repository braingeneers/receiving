var _class, _temp;

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var _require2 = require('@uppy/companion-client'),
    Provider = _require2.Provider;

var ProviderViews = require('@uppy/provider-views');

var _require3 = require('preact'),
    h = _require3.h;

module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(Facebook, _Plugin);

  function Facebook(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.id = _this.opts.id || 'Facebook';
    Provider.initPlugin(_assertThisInitialized(_this), opts);
    _this.title = _this.opts.title || 'Facebook';

    _this.icon = function () {
      return h("svg", {
        "aria-hidden": "true",
        focusable: "false",
        width: "32",
        height: "32",
        viewBox: "0 0 32 32",
        xmlns: "http://www.w3.org/2000/svg"
      }, h("g", {
        fill: "none",
        "fill-rule": "evenodd"
      }, h("rect", {
        width: "32",
        height: "32",
        rx: "16",
        fill: "#3C5A99"
      }), h("path", {
        d: "M17.842 26v-8.667h2.653l.398-3.377h-3.051v-2.157c0-.978.248-1.644 1.527-1.644H21V7.132A19.914 19.914 0 0 0 18.623 7c-2.352 0-3.963 1.574-3.963 4.465v2.49H12v3.378h2.66V26h3.182z",
        fill: "#FFF",
        "fill-rule": "nonzero"
      })));
    };

    _this.provider = new Provider(uppy, {
      companionUrl: _this.opts.companionUrl,
      companionHeaders: _this.opts.companionHeaders || _this.opts.serverHeaders,
      provider: 'facebook',
      pluginId: _this.id
    });
    _this.onFirstRender = _this.onFirstRender.bind(_assertThisInitialized(_this));
    _this.render = _this.render.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Facebook.prototype;

  _proto.install = function install() {
    this.view = new ProviderViews(this, {
      provider: this.provider
    }); // Set default state for Dropbox

    this.setPluginState({
      authenticated: false,
      files: [],
      folders: [],
      directories: [],
      activeRow: -1,
      filterInput: '',
      isSearchVisible: false
    });
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    this.view.tearDown();
    this.unmount();
  };

  _proto.onFirstRender = function onFirstRender() {
    return this.view.getFolder();
  };

  _proto.render = function render(state) {
    var viewOptions = {};

    if (this.getPluginState().files.length && !this.getPluginState().folders.length) {
      viewOptions.viewType = 'grid';
      viewOptions.showFilter = false;
      viewOptions.showTitles = false;
    }

    return this.view.render(state, viewOptions);
  };

  return Facebook;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);