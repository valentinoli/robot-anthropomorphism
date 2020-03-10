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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _video__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./video */ \"./src/video.js\");\n/* harmony import */ var _video__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_video__WEBPACK_IMPORTED_MODULE_0__);\n// SDK Needs to create video and canvas nodes in the DOM in order to function\n// Here we are adding those nodes a predefined div.\nvar divRoot = document.getElementById(\"affdexElements\");\nvar width = 640;\nvar height = 480;\nvar faceMode = affdex.FaceDetectorMode.LARGE_FACES; // Construct a CameraDetector and specify the image width / height and face detector mode.\n\nvar detector = new affdex.CameraDetector(divRoot, width, height, faceMode);\nvar results = [];\nvar timestamps = [];\n\n\nfunction runNextVideo() {\n  if (detector && !detector.isRunning && _video__WEBPACK_IMPORTED_MODULE_0___default.a.length > 0) {\n    // Run start() in affdex-edited-for-processing.js\n    // Creates video element and canvas element + context\n    // Returns the video element. Doesn't really start the detector.\n    var videoEl = detector.start();\n    var nextVideo = _video__WEBPACK_IMPORTED_MODULE_0___default.a[0];\n    videoEl.setAttribute('src', \"video/\".concat(nextVideo, \".mp4\")); // videoEl.play();\n\n    var onPlaying = function onPlaying() {\n      // Call this function only once when video starts playing\n      // Start the AFFDEX detector\n      console.log(\"Detector started\");\n      affdex.Detector.prototype.start.apply(detector);\n    };\n\n    videoEl.addEventListener('playing', onPlaying);\n    videoEl.addEventListener('ended', onStop); // call onStop() when video ends\n\n    videoEl.addEventListener('canplay', function () {\n      // play video when it is available\n      var promise = videoEl.play();\n      promise.then(function () {\n        console.log(\"Video playing: \".concat(nextVideo));\n        videoEl.removeEventListener('playing', onPlaying);\n      })[\"catch\"](console.error);\n    });\n  }\n} //Enable detection of all Expressions, Emotions and Emojis classifiers.\n\n\ndetector.detectAllEmotions();\ndetector.detectAllExpressions();\ndetector.detectAllEmojis();\ndetector.detectAllAppearance(); //Add a callback to notify when the detector is initialized and ready for runing.\n\ndetector.addEventListener(\"onInitializeSuccess\", function () {\n  return console.log(\"The detector reports initialized\");\n}); // //Add a callback to notify when camera access is allowed\n// detector.addEventListener(\"onWebcamConnectSuccess\", () => console.log(\"Webcam access allowed\"));\n//\n// // Add a callback to notify when camera access is denied\n// detector.addEventListener(\"onWebcamConnectFailure\", () => console.log(\"Webcam access denied\"));\n// Add a callback to notify when detector is stopped\n\ndetector.addEventListener(\"onStopSuccess\", function () {\n  return console.log(\"The detector reports stopped\");\n}); // Add a callback to receive the results from processing an image.\n// The faces object contains the list of the faces detected in an image.\n// Faces object contains probabilities for all the different expressions, emotions and appearance metrics\n\ndetector.addEventListener(\"onImageResultsSuccess\", function (faces, image, timestamp) {\n  // console.log(`Timestamp: ${timestamp}`);\n  // console.log(`Number of faces found: ${faces.length}`);\n  if (faces.length > 0) {\n    var _faces$ = faces[0],\n        appearance = _faces$.appearance,\n        expressions = _faces$.expressions,\n        emotions = _faces$.emotions,\n        emojis = _faces$.emojis;\n    var result = {\n      appearance: appearance,\n      expressions: expressions,\n      emotions: emotions,\n      emojis: emojis\n    };\n    timestamps.push(timestamp);\n    results.push(result);\n  }\n}); // // https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript\n// let textFile = null;\n// const makeTextFile = function (res) {\n//   const data = new Blob([res], {type: 'text/plain'});\n//\n//   // If we are replacing a previously generated file we need to\n//   // manually revoke the object URL to avoid memory leaks.\n//   if (textFile !== null) {\n//     window.URL.revokeObjectURL(textFile);\n//   }\n//\n//   textFile = window.URL.createObjectURL(data);\n//\n//   // returns a URL you can use as a href\n//   return textFile;\n// };\n\nfunction toggleLoading() {\n  var loadingEl = document.querySelector('.loading');\n  loadingEl.style.display = loadingEl.style.display === 'flex' ? 'none' : 'flex';\n} //function executes when the Stop button is pushed.\n\n\nfunction onStop() {\n  if (detector && detector.isRunning) {\n    detector.removeEventListener();\n    detector.stop(); // Post results to server and show loading state\n\n    toggleLoading();\n    fetch('/', {\n      method: 'post',\n      headers: {\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify({\n        timestamps: timestamps,\n        results: results\n      })\n    }).then(function (response) {\n      if (response.status >= 200 && response.status < 300) {\n        return Promise.resolve(response);\n      } else {\n        return Promise.reject(new Error(response.statusText));\n      }\n    }).then(function (res) {\n      return res.json();\n    }).then(function (json) {\n      results = [];\n      timestamps = [];\n      _video__WEBPACK_IMPORTED_MODULE_0___default.a.shift(); // process next video\n\n      console.log(\"Results from AFFDEX parsed successfully, saved in \".concat(json.hash, \".txt\"));\n      setTimeout(function () {\n        toggleLoading();\n        runNextVideo();\n      }, 4000);\n    })[\"catch\"](function (error) {\n      toggleLoading();\n      console.error(error);\n    }); // // 4 March 2020 - Valentin\n    // // Write expression values to a text file\n    // const link = document.createElement('a');\n    // link.setAttribute('download', 'info.txt');\n    // link.href = makeTextFile(json);\n    // document.body.appendChild(link);\n    //\n    // // wait for the link to be added to the document\n    // window.requestAnimationFrame(function () {\n    //   const event = new MouseEvent('click');\n    //   link.dispatchEvent(event);\n    //   document.body.removeChild(link);\n    // });\n  }\n}\n\n;\nwindow.addEventListener('DOMContentLoaded', function () {\n  // Run first video only when user has clicked the window\n  // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes\n  window.addEventListener('click', runNextVideo);\n});\n\n//# sourceURL=webpack:///./src/post-processing.js?");

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