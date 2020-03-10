/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/post-processing.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/post-processing.js":
/*!********************************!*\
  !*** ./src/post-processing.js ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _video__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./video */ \"./src/video.js\");\n/* harmony import */ var _video__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_video__WEBPACK_IMPORTED_MODULE_0__);\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); }\n\nfunction _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === \"[object Arguments]\")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\n// SDK Needs to create video and canvas nodes in the DOM in order to function\n// Here we are adding those nodes a predefined div.\nvar divRoot = document.getElementById(\"affdexElements\");\nvar width = 640;\nvar height = 480;\nvar faceMode = affdex.FaceDetectorMode.LARGE_FACES; // Construct a CameraDetector and specify the image width / height and face detector mode.\n\nvar detector = new affdex.CameraDetector(divRoot, width, height, faceMode);\nvar results = [];\nvar timestamps = [];\n\n\nfunction runNextVideo() {\n  if (detector && !detector.isRunning && _video__WEBPACK_IMPORTED_MODULE_0___default.a.length > 0) {\n    // Run start() in affdex-edited-for-processing.js\n    // Creates video element and canvas element + context\n    // Returns the video element. Doesn't really start the detector.\n    var videoEl = detector.start();\n    var nextVideo = _video__WEBPACK_IMPORTED_MODULE_0___default.a[0];\n    videoEl.setAttribute('src', \"video/\".concat(nextVideo, \".mp4\")); // videoEl.play();\n\n    var onPlaying = function onPlaying() {\n      // Call this function only once when video starts playing\n      // Start the AFFDEX detector\n      console.log(\"Detector started\");\n      affdex.Detector.prototype.start.apply(detector);\n    };\n\n    videoEl.addEventListener('playing', onPlaying);\n    videoEl.addEventListener('ended', onStop); // call onStop() when video ends\n\n    videoEl.addEventListener('canplay', function () {\n      // play video when it is available\n      var promise = videoEl.play();\n      promise.then(function () {\n        console.log(\"Video playing: \".concat(nextVideo));\n        videoEl.removeEventListener('playing', onPlaying);\n      })[\"catch\"](console.error);\n    });\n  }\n} //Enable detection of all Expressions, Emotions and Emojis classifiers.\n\n\ndetector.detectAllEmotions();\ndetector.detectAllExpressions();\ndetector.detectAllEmojis();\ndetector.detectAllAppearance(); //Add a callback to notify when the detector is initialized and ready for runing.\n\ndetector.addEventListener(\"onInitializeSuccess\", function () {\n  return console.log(\"The detector reports initialized\");\n}); // //Add a callback to notify when camera access is allowed\n// detector.addEventListener(\"onWebcamConnectSuccess\", () => console.log(\"Webcam access allowed\"));\n//\n// // Add a callback to notify when camera access is denied\n// detector.addEventListener(\"onWebcamConnectFailure\", () => console.log(\"Webcam access denied\"));\n// Add a callback to notify when detector is stopped\n\ndetector.addEventListener(\"onStopSuccess\", function () {\n  return console.log(\"The detector reports stopped\");\n}); // Add a callback to receive the results from processing an image.\n// The faces object contains the list of the faces detected in an image.\n// Faces object contains probabilities for all the different expressions, emotions and appearance metrics\n\ndetector.addEventListener(\"onImageResultsSuccess\", function (faces, image, timestamp) {\n  if (faces.length > 0) {\n    var _faces$ = faces[0],\n        appearance = _faces$.appearance,\n        expressions = _faces$.expressions,\n        emotions = _faces$.emotions,\n        emojis = _faces$.emojis;\n    var result = {\n      appearance: appearance,\n      expressions: expressions,\n      emotions: emotions,\n      emojis: emojis\n    };\n    timestamps.push(timestamp);\n    results.push(result);\n  }\n});\n\nfunction toggleLoading() {\n  var loadingEl = document.querySelector('.loading');\n  loadingEl.style.display = loadingEl.style.display === 'flex' ? 'none' : 'flex';\n}\n\nfunction onStop() {\n  if (detector && detector.isRunning) {\n    detector.removeEventListener();\n    detector.stop(); // Post results to server and show loading state\n\n    toggleLoading();\n    fetch('/', {\n      method: 'post',\n      headers: {\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify({\n        timestamps: timestamps,\n        results: results\n      })\n    }).then(function (response) {\n      if (response.status >= 200 && response.status < 300) {\n        return Promise.resolve(response);\n      } else {\n        return Promise.reject(new Error(response.statusText));\n      }\n    }).then(function (res) {\n      return res.json();\n    }).then(function (json) {\n      var data = json.data,\n          hash = json.hash;\n      results = [];\n      timestamps = [];\n      _video__WEBPACK_IMPORTED_MODULE_0___default.a.shift(); // process next video\n\n      console.log(\"Results from AFFDEX parsed successfully, saved in \".concat(hash, \".txt\"));\n      console.log(\"Processed results:\\n \".concat(Object.entries(data.expressions).reduce(function (acc, _ref) {\n        var _ref2 = _slicedToArray(_ref, 2),\n            k = _ref2[0],\n            v = _ref2[1];\n\n        return \"\".concat(acc).concat(k, \": \").concat(v, \"\\n\\n\");\n      }, '')));\n      setTimeout(function () {\n        toggleLoading();\n        runNextVideo();\n      }, 10000);\n    })[\"catch\"](function (error) {\n      toggleLoading();\n      console.error(error);\n    });\n  }\n}\n\n;\nwindow.addEventListener('DOMContentLoaded', function () {\n  // Run first video only when user has clicked the window\n  // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes\n  window.addEventListener('click', runNextVideo);\n});\n\n//# sourceURL=webpack:///./src/post-processing.js?");

/***/ }),

/***/ "./src/video.js":
/*!**********************!*\
  !*** ./src/video.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = [\"video1\", \"video2\", \"video3\"];\n\n//# sourceURL=webpack:///./src/video.js?");

/***/ })

/******/ });