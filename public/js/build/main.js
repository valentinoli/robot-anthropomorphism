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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// SDK Needs to create video and canvas nodes in the DOM in order to function\r\n// Here we are adding those nodes a predefined div.\r\nconst divRoot = document.getElementById(\"affdexElements\");\r\nconst width = 640;\r\nconst height = 480;\r\nconst faceMode = affdex.FaceDetectorMode.LARGE_FACES;\r\n\r\n// Construct a CameraDetector and specify the image width / height and face detector mode.\r\nconst detector = new affdex.CameraDetector(divRoot, width, height, faceMode);\r\n\r\n//Enable detection of all Expressions, Emotions and Emojis classifiers.\r\ndetector.detectAllEmotions();\r\ndetector.detectAllExpressions();\r\ndetector.detectAllEmojis();\r\ndetector.detectAllAppearance();\r\n\r\n//Add a callback to notify when the detector is initialized and ready for runing.\r\ndetector.addEventListener(\"onInitializeSuccess\", () => console.log(\"The detector reports initialized\"));\r\n\r\n//Add a callback to notify when camera access is allowed\r\ndetector.addEventListener(\"onWebcamConnectSuccess\", () => console.log(\"Webcam access allowed\"));\r\n\r\n// Add a callback to notify when camera access is denied\r\ndetector.addEventListener(\"onWebcamConnectFailure\", () => console.log(\"Webcam access denied\"));\r\n\r\n// Add a callback to notify when detector is stopped\r\ndetector.addEventListener(\"onStopSuccess\", () => console.log(\"The detector reports stopped\"));\r\n\r\nconst results = [];\r\nconst timestamps = [];\r\n\r\nconst loadingEl = document.querySelector('.loading');\r\n\r\n// Add a callback to receive the results from processing an image.\r\n// The faces object contains the list of the faces detected in an image.\r\n// Faces object contains probabilities for all the different expressions, emotions and appearance metrics\r\ndetector.addEventListener(\"onImageResultsSuccess\", function(faces, image, timestamp) {\r\n  console.log(`Timestamp: ${timestamp}`);\r\n  console.log(`Number of faces found: ${faces.length}`);\r\n\r\n  if (faces.length > 0) {\r\n    const {\r\n      appearance,\r\n      expressions,\r\n      emotions,\r\n      emojis,\r\n    } = faces[0];\r\n\r\n    const result = {\r\n      appearance,\r\n      expressions,\r\n      emotions,\r\n      emojis,\r\n    };\r\n\r\n    timestamps.push(timestamp);\r\n    results.push(result);\r\n    // log('#results', \"Appearance: \" + JSON.stringify(faces[0].appearance));\r\n    // log('#results', \"Emotions: \" + JSON.stringify(faces[0].emotions, function(key, val) {\r\n    //   return val.toFixed ? Number(val.toFixed(0)) : val;\r\n    // }));\r\n    // log('#results', \"Expressions: \" + JSON.stringify(faces[0].expressions, function(key, val) {\r\n    //   return val.toFixed ? Number(val.toFixed(0)) : val;\r\n    // }));\r\n\r\n    // expressions.push(timestamp.toFixed(2));\r\n    // expressions.push(JSON.stringify(faces[0].expressions, function(key, val) {\r\n    //   return val.toFixed ? Number(val.toFixed(0)) : val;\r\n    // }))\r\n  }\r\n});\r\n\r\nconst videoEl = document.getElementById('video');\r\nvideoEl.addEventListener('play', onStart);\r\nvideoEl.addEventListener('ended', onStop);\r\n\r\nfunction onStart() {\r\n  console.log(\"Clicked the start button\");\r\n  if (detector && !detector.isRunning) {\r\n    // Run start() in affdex.js\r\n    console.log(\"Detector started\");\r\n    detector.start();\r\n  }\r\n}\r\n\r\n// // https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript\r\n// let textFile = null;\r\n// const makeTextFile = function (res) {\r\n//   const data = new Blob([res], {type: 'text/plain'});\r\n//\r\n//   // If we are replacing a previously generated file we need to\r\n//   // manually revoke the object URL to avoid memory leaks.\r\n//   if (textFile !== null) {\r\n//     window.URL.revokeObjectURL(textFile);\r\n//   }\r\n//\r\n//   textFile = window.URL.createObjectURL(data);\r\n//\r\n//   // returns a URL you can use as a href\r\n//   return textFile;\r\n// };\r\n\r\nfunction toggleLoading() {\r\n  loadingEl.style.display = loadingEl.style.display === 'none' ? 'flex': 'none';\r\n}\r\n\r\n//function executes when the Stop button is pushed.\r\nfunction onStop() {\r\n  console.log(\"Clicked the stop button\");\r\n  if (detector && detector.isRunning) {\r\n    detector.removeEventListener();\r\n    detector.stop();\r\n    // Post results to server and show loading state\r\n    toggleLoading();\r\n\r\n    fetch('/', {\r\n      method: 'post',\r\n      headers: {\r\n        'Content-Type': 'application/json'\r\n      },\r\n      body: JSON.stringify({ timestamps, results }),\r\n    })\r\n    .then(response => {\r\n      if (response.status >= 200 && response.status < 300) {\r\n        return Promise.resolve(response)\r\n      } else {\r\n        return Promise.reject(new Error(response.statusText))\r\n      }\r\n    })\r\n    .then(res => res.json())\r\n    .then(json => {\r\n      console.log(json);\r\n      const { redirectUrl } = json;\r\n      setTimeout(() => {\r\n        toggleLoading();\r\n        window.location = redirectUrl;\r\n      }, 4000);\r\n    })\r\n    .catch(error => {\r\n      toggleLoading();\r\n      console.error(error);\r\n    });\r\n\r\n    // // 4 March 2020 - Valentin\r\n    // // Write expression values to a text file\r\n    // const link = document.createElement('a');\r\n    // link.setAttribute('download', 'info.txt');\r\n    // link.href = makeTextFile(json);\r\n    // document.body.appendChild(link);\r\n    //\r\n    // // wait for the link to be added to the document\r\n    // window.requestAnimationFrame(function () {\r\n    //   const event = new MouseEvent('click');\r\n    //   link.dispatchEvent(event);\r\n    //   document.body.removeChild(link);\r\n    // });\r\n  }\r\n};\r\n\r\n// function log(node_name, msg) {\r\n//   $(node_name).append(\"<span>\" + msg + \"</span><br />\")\r\n// }\r\n\r\n//function executes when the Reset button is pushed.\r\n// function onReset() {\r\n//   console.log(\"Clicked the reset button\");\r\n//   if (detector && detector.isRunning) {\r\n//     detector.reset();\r\n//   }\r\n// };\r\n\r\n//Draw the detected facial feature points on the image\r\n// function drawFeaturePoints(img, featurePoints) {\r\n//   var contxt = $('#face_video_canvas')[0].getContext('2d');\r\n//\r\n//   var hRatio = contxt.canvas.width / img.width;\r\n//   var vRatio = contxt.canvas.height / img.height;\r\n//   var ratio = Math.min(hRatio, vRatio);\r\n//\r\n//   contxt.strokeStyle = \"#FFFFFF\";\r\n//   for (var id in featurePoints) {\r\n//     contxt.beginPath();\r\n//     contxt.arc(featurePoints[id].x,\r\n//       featurePoints[id].y, 2, 0, 2 * Math.PI);\r\n//     contxt.stroke();\r\n//\r\n//   }\r\n// }\r\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });