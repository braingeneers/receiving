function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var React = require('react');

var PropTypes = require('prop-types');

var DashboardPlugin = require('@uppy/dashboard');

var basePropTypes = require('./propTypes').dashboard;

var h = React.createElement;
/**
 * React Component that renders a Dashboard for an Uppy instance in a Modal
 * dialog. Visibility of the Modal is toggled using the `open` prop.
 */

var DashboardModal = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DashboardModal, _React$Component);

  function DashboardModal() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = DashboardModal.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.installPlugin();
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.uppy !== this.props.uppy) {
      this.uninstallPlugin(prevProps);
      this.installPlugin();
    }

    if (prevProps.open && !this.props.open) {
      this.plugin.closeModal();
    } else if (!prevProps.open && this.props.open) {
      this.plugin.openModal();
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.uninstallPlugin();
  };

  _proto.installPlugin = function installPlugin() {
    var uppy = this.props.uppy;

    var options = _extends({
      id: 'react:DashboardModal'
    }, this.props, {
      onRequestCloseModal: this.props.onRequestClose
    });

    if (!options.target) {
      options.target = this.container;
    }

    delete options.uppy;
    uppy.use(DashboardPlugin, options);
    this.plugin = uppy.getPlugin(options.id);

    if (this.props.open) {
      this.plugin.openModal();
    }
  };

  _proto.uninstallPlugin = function uninstallPlugin(props) {
    if (props === void 0) {
      props = this.props;
    }

    var uppy = props.uppy;
    uppy.removePlugin(this.plugin);
  };

  _proto.render = function render() {
    var _this = this;

    return h('div', {
      ref: function ref(container) {
        _this.container = container;
      }
    });
  };

  return DashboardModal;
}(React.Component);

DashboardModal.propTypes = _extends({
  // Only check this prop type in the browser.
  target: typeof window !== 'undefined' ? PropTypes.instanceOf(window.HTMLElement) : PropTypes.any,
  open: PropTypes.bool,
  onRequestClose: PropTypes.func,
  closeModalOnClickOutside: PropTypes.bool,
  disablePageScrollWhenModalOpen: PropTypes.bool
}, basePropTypes);
DashboardModal.defaultProps = {};
module.exports = DashboardModal;