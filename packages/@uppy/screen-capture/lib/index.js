var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('preact'),
    h = _require.h;

var _require2 = require('@uppy/core'),
    Plugin = _require2.Plugin;

var Translator = require('@uppy/utils/lib/Translator');

var getFileTypeExtension = require('@uppy/utils/lib/getFileTypeExtension');

var ScreenRecIcon = require('./ScreenRecIcon');

var CaptureScreen = require('./CaptureScreen'); // Adapted from: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia


function getMediaDevices() {
  // check if screen capturing is supported

  /* eslint-disable */
  if (navigator && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia && window && window.MediaRecorder) {
    return navigator.mediaDevices;
  }
  /* eslint-enable */


  return null;
}
/**
 * Screen capture
 */


module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(ScreenCapture, _Plugin);

  function ScreenCapture(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.mediaDevices = getMediaDevices();
    _this.protocol = location.protocol.match(/https/i) ? 'https' : 'http';
    _this.id = _this.opts.id || 'ScreenCapture';
    _this.title = _this.opts.title || 'Screencast';
    _this.type = 'acquirer';
    _this.icon = ScreenRecIcon;
    _this.defaultLocale = {
      strings: {
        startCapturing: 'Begin screen capturing',
        stopCapturing: 'Stop screen capturing',
        submitRecordedFile: 'Submit captured video',
        streamActive: 'Stream active',
        streamPassive: 'Stream passive',
        micDisabled: 'Microphone access denied by user',
        recording: 'Recording'
      }
    }; // set default options
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints

    var defaultOptions = {
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#Properties_of_shared_screen_tracks
      displayMediaConstraints: {
        video: {
          width: 1280,
          height: 720,
          frameRate: {
            ideal: 3,
            max: 5
          },
          cursor: 'motion',
          displaySurface: 'monitor'
        }
      },
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints/audio
      userMediaConstraints: {
        audio: true
      },
      preferredVideoMimeType: 'video/webm'
    }; // merge default options with the ones set by user

    _this.opts = _extends({}, defaultOptions, {}, opts); // i18n

    _this.translator = new Translator([_this.defaultLocale, _this.uppy.locale, _this.opts.locale]);
    _this.i18n = _this.translator.translate.bind(_this.translator);
    _this.i18nArray = _this.translator.translateArray.bind(_this.translator); // uppy plugin class related

    _this.install = _this.install.bind(_assertThisInitialized(_this));
    _this.setPluginState = _this.setPluginState.bind(_assertThisInitialized(_this));
    _this.render = _this.render.bind(_assertThisInitialized(_this)); // screen capturer related

    _this.start = _this.start.bind(_assertThisInitialized(_this));
    _this.stop = _this.stop.bind(_assertThisInitialized(_this));
    _this.startRecording = _this.startRecording.bind(_assertThisInitialized(_this));
    _this.stopRecording = _this.stopRecording.bind(_assertThisInitialized(_this));
    _this.submit = _this.submit.bind(_assertThisInitialized(_this));
    _this.streamInterrupted = _this.streamInactivated.bind(_assertThisInitialized(_this)); // initialize

    _this.captureActive = false;
    _this.capturedMediaFile = null;
    return _this;
  }

  var _proto = ScreenCapture.prototype;

  _proto.install = function install() {
    // Return if browser doesn’t support getDisplayMedia and
    if (!this.mediaDevices) {
      this.uppy.log('Screen recorder access is not supported', 'error');
      return null;
    }

    this.setPluginState({
      streamActive: false,
      audioStreamActive: false
    });
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    if (this.videoStream) {
      this.stop();
    }

    this.unmount();
  };

  _proto.start = function start() {
    var _this2 = this;

    if (!this.mediaDevices) {
      return Promise.reject(new Error('Screen recorder access not supported'));
    }

    this.captureActive = true;
    this.selectAudioStreamSource();
    this.selectVideoStreamSource().then(function (res) {
      // something happened in start -> return
      if (res === false) {
        // Close the Dashboard panel if plugin is installed
        // into Dashboard (could be other parent UI plugin)
        if (_this2.parent && _this2.parent.hideAllPanels) {
          _this2.parent.hideAllPanels();

          _this2.captureActive = false;
        }
      }
    });
  };

  _proto.selectVideoStreamSource = function selectVideoStreamSource() {
    var _this3 = this;

    // if active stream available, return it
    if (this.videoStream) {
      return new Promise(function (resolve) {
        return resolve(_this3.videoStream);
      });
    } // ask user to select source to record and get mediastream from that
    // eslint-disable-next-line compat/compat


    return this.mediaDevices.getDisplayMedia(this.opts.displayMediaConstraints).then(function (videoStream) {
      _this3.videoStream = videoStream; // add event listener to stop recording if stream is interrupted

      _this3.videoStream.addEventListener('inactive', function (event) {
        _this3.streamInactivated();
      });

      _this3.setPluginState({
        streamActive: true
      });

      return videoStream;
    }).catch(function (err) {
      _this3.setPluginState({
        screenRecError: err
      });

      _this3.userDenied = true;
      setTimeout(function () {
        _this3.userDenied = false;
      }, 1000);
      return false;
    });
  };

  _proto.selectAudioStreamSource = function selectAudioStreamSource() {
    var _this4 = this;

    // if active stream available, return it
    if (this.audioStream) {
      return new Promise(function (resolve) {
        return resolve(_this4.audioStream);
      });
    } // ask user to select source to record and get mediastream from that
    // eslint-disable-next-line compat/compat


    return this.mediaDevices.getUserMedia(this.opts.userMediaConstraints).then(function (audioStream) {
      _this4.audioStream = audioStream;

      _this4.setPluginState({
        audioStreamActive: true
      });

      return audioStream;
    }).catch(function (err) {
      if (err.name === 'NotAllowedError') {
        _this4.uppy.info(_this4.i18n('micDisabled'), 'error', 5000);
      }

      return false;
    });
  };

  _proto.startRecording = function startRecording() {
    var _this5 = this;

    var options = {};
    this.capturedMediaFile = null;
    this.recordingChunks = [];
    var preferredVideoMimeType = this.opts.preferredVideoMimeType;
    this.selectVideoStreamSource().then(function (videoStream) {
      // Attempt to use the passed preferredVideoMimeType (if any) during recording.
      // If the browser doesn't support it, we'll fall back to the browser default instead
      if (preferredVideoMimeType && MediaRecorder.isTypeSupported(preferredVideoMimeType) && getFileTypeExtension(preferredVideoMimeType)) {
        options.mimeType = preferredVideoMimeType;
      } // prepare tracks


      var tracks = [videoStream.getVideoTracks()[0]]; // merge audio if exits

      if (_this5.audioStream) {
        tracks.push(_this5.audioStream.getAudioTracks()[0]);
      } // create new stream from video and audio
      // eslint-disable-next-line compat/compat


      _this5.outputStream = new MediaStream(tracks); // initialize mediarecorder

      _this5.recorder = new MediaRecorder(_this5.outputStream, options); // push data to buffer when data available

      _this5.recorder.addEventListener('dataavailable', function (event) {
        _this5.recordingChunks.push(event.data);
      }); // start recording


      _this5.recorder.start(); // set plugin state to recording


      _this5.setPluginState({
        recording: true
      });
    }).catch(function (err) {
      _this5.uppy.log(err, 'error');
    });
  };

  _proto.streamInactivated = function streamInactivated() {
    // get screen recorder state
    var _this$getPluginState = _extends({}, this.getPluginState()),
        recordedVideo = _this$getPluginState.recordedVideo,
        recording = _this$getPluginState.recording;

    if (!recordedVideo && !recording) {
      // Close the Dashboard panel if plugin is installed
      // into Dashboard (could be other parent UI plugin)
      if (this.parent && this.parent.hideAllPanels) {
        this.parent.hideAllPanels();
      }
    } else if (recording) {
      // stop recorder if it is active
      this.uppy.log('Capture stream inactive — stop recording');
      this.stopRecording();
    }

    this.videoStream = null;
    this.audioStream = null;
    this.setPluginState({
      streamActive: false,
      audioStreamActive: false
    });
  };

  _proto.stopRecording = function stopRecording() {
    var _this6 = this;

    var stopped = new Promise(function (resolve, reject) {
      _this6.recorder.addEventListener('stop', function () {
        resolve();
      });

      _this6.recorder.stop();
    });
    return stopped.then(function () {
      // recording stopped
      _this6.setPluginState({
        recording: false
      }); // get video file after recorder stopped


      return _this6.getVideo();
    }).then(function (file) {
      // store media file
      _this6.capturedMediaFile = file; // create object url for capture result preview

      _this6.setPluginState({
        recordedVideo: URL.createObjectURL(file.data)
      });
    }).then(function () {
      _this6.recordingChunks = null;
      _this6.recorder = null;
    }, function (error) {
      _this6.recordingChunks = null;
      _this6.recorder = null;
      throw error;
    });
  };

  _proto.submit = function submit() {
    try {
      // add recorded file to uppy
      if (this.capturedMediaFile) {
        this.uppy.addFile(this.capturedMediaFile);
      }
    } catch (err) {
      // Logging the error, exept restrictions, which is handled in Core
      if (!err.isRestriction) {
        this.uppy.log(err, 'error');
      }
    }
  };

  _proto.stop = function stop() {
    // flush video stream
    if (this.videoStream) {
      this.videoStream.getVideoTracks().forEach(function (track) {
        track.stop();
      });
      this.videoStream.getAudioTracks().forEach(function (track) {
        track.stop();
      });
      this.videoStream = null;
    } // flush audio stream


    if (this.audioStream) {
      this.audioStream.getAudioTracks().forEach(function (track) {
        track.stop();
      });
      this.audioStream.getVideoTracks().forEach(function (track) {
        track.stop();
      });
      this.audioStream = null;
    } // flush output stream


    if (this.outputStream) {
      this.outputStream.getAudioTracks().forEach(function (track) {
        track.stop();
      });
      this.outputStream.getVideoTracks().forEach(function (track) {
        track.stop();
      });
      this.outputStream = null;
    } // remove preview video


    this.setPluginState({
      recordedVideo: null
    });
    this.captureActive = false;
  };

  _proto.getVideo = function getVideo() {
    var mimeType = this.recordingChunks[0].type;
    var fileExtension = getFileTypeExtension(mimeType);

    if (!fileExtension) {
      return Promise.reject(new Error("Could not retrieve recording: Unsupported media type \"" + mimeType + "\""));
    }

    var name = "screencap-" + Date.now() + "." + fileExtension;
    var blob = new Blob(this.recordingChunks, {
      type: mimeType
    });
    var file = {
      source: this.id,
      name: name,
      data: new Blob([blob], {
        type: mimeType
      }),
      type: mimeType
    };
    return Promise.resolve(file);
  };

  _proto.render = function render(state) {
    // get screen recorder state
    var recorderState = this.getPluginState();

    if (!recorderState.streamActive && !this.captureActive && !this.userDenied) {
      this.start();
    }

    return h(CaptureScreen, _extends({}, recorderState, {
      onStartRecording: this.startRecording,
      onStopRecording: this.stopRecording,
      onStop: this.stop,
      onSubmit: this.submit,
      i18n: this.i18n,
      stream: this.videoStream
    }));
  };

  return ScreenCapture;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);