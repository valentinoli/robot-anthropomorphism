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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/webcam.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/webcam.js":
/*!***********************!*\
  !*** ./src/webcam.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// SDK Needs to create video and canvas nodes in the DOM in order to function\n// Here we are adding those nodes a predefined div.\nvar divRoot = document.getElementById(\"affdexElements\");\nvar width = 640;\nvar height = 480;\nvar faceMode = affdex.FaceDetectorMode.LARGE_FACES; // Construct a CameraDetector and specify the image width / height and face detector mode.\n\nvar detector = new affdex.CameraDetector(divRoot, width, height, faceMode); //Enable detection of all Expressions, Emotions and Emojis classifiers.\n\ndetector.detectAllEmotions();\ndetector.detectAllExpressions();\ndetector.detectAllEmojis();\ndetector.detectAllAppearance(); //Add a callback to notify when the detector is initialized and ready for runing.\n\ndetector.addEventListener(\"onInitializeSuccess\", function () {\n  return console.log(\"The detector reports initialized\");\n}); //Add a callback to notify when camera access is allowed\n\ndetector.addEventListener(\"onWebcamConnectSuccess\", function () {\n  return console.log(\"Webcam access allowed\");\n}); // Add a callback to notify when camera access is denied\n\ndetector.addEventListener(\"onWebcamConnectFailure\", function () {\n  return console.log(\"Webcam access denied\");\n}); // Add a callback to notify when detector is stopped\n\ndetector.addEventListener(\"onStopSuccess\", function () {\n  return console.log(\"The detector reports stopped\");\n});\nvar results = [];\nvar timestamps = [];\nvar loadingEl = document.querySelector('.loading'); // Add a callback to receive the results from processing an image.\n// The faces object contains the list of the faces detected in an image.\n// Faces object contains probabilities for all the different expressions, emotions and appearance metrics\n\ndetector.addEventListener(\"onImageResultsSuccess\", function (faces, image, timestamp) {\n  console.log(\"Timestamp: \".concat(timestamp));\n  console.log(\"Number of faces found: \".concat(faces.length));\n\n  if (faces.length > 0) {\n    var _faces$ = faces[0],\n        appearance = _faces$.appearance,\n        expressions = _faces$.expressions,\n        emotions = _faces$.emotions,\n        emojis = _faces$.emojis;\n    var result = {\n      appearance: appearance,\n      expressions: expressions,\n      emotions: emotions,\n      emojis: emojis\n    };\n    timestamps.push(timestamp);\n    results.push(result); // log('#results', \"Appearance: \" + JSON.stringify(faces[0].appearance));\n    // log('#results', \"Emotions: \" + JSON.stringify(faces[0].emotions, function(key, val) {\n    //   return val.toFixed ? Number(val.toFixed(0)) : val;\n    // }));\n    // log('#results', \"Expressions: \" + JSON.stringify(faces[0].expressions, function(key, val) {\n    //   return val.toFixed ? Number(val.toFixed(0)) : val;\n    // }));\n    // expressions.push(timestamp.toFixed(2));\n    // expressions.push(JSON.stringify(faces[0].expressions, function(key, val) {\n    //   return val.toFixed ? Number(val.toFixed(0)) : val;\n    // }))\n  }\n});\nvar videoEl = document.getElementById('video');\nvideoEl.addEventListener('play', onStart);\nvideoEl.addEventListener('ended', onStop);\n\nfunction onStart() {\n  if (detector && !detector.isRunning) {\n    // Run start() in affdex.js\n    console.log(\"Detector started\");\n    detector.start();\n  }\n} // // https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript\n// let textFile = null;\n// const makeTextFile = function (res) {\n//   const data = new Blob([res], {type: 'text/plain'});\n//\n//   // If we are replacing a previously generated file we need to\n//   // manually revoke the object URL to avoid memory leaks.\n//   if (textFile !== null) {\n//     window.URL.revokeObjectURL(textFile);\n//   }\n//\n//   textFile = window.URL.createObjectURL(data);\n//\n//   // returns a URL you can use as a href\n//   return textFile;\n// };\n\n\nfunction toggleLoading() {\n  loadingEl.style.display = loadingEl.style.display === 'none' ? 'flex' : 'none';\n} //function executes when the Stop button is pushed.\n\n\nfunction onStop() {\n  if (detector && detector.isRunning) {\n    detector.removeEventListener();\n    detector.stop(); // Post results to server and show loading state\n\n    toggleLoading();\n    fetch('/', {\n      method: 'post',\n      headers: {\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify({\n        timestamps: timestamps,\n        results: results\n      })\n    }).then(function (response) {\n      if (response.status >= 200 && response.status < 300) {\n        return Promise.resolve(response);\n      } else {\n        return Promise.reject(new Error(response.statusText));\n      }\n    }).then(function (res) {\n      return res.json();\n    }).then(function (json) {\n      console.log(json);\n      var redirectUrl = json.redirectUrl;\n      setTimeout(function () {\n        toggleLoading();\n        window.location = redirectUrl;\n      }, 4000);\n    })[\"catch\"](function (error) {\n      toggleLoading();\n      console.error(error);\n    }); // // 4 March 2020 - Valentin\n    // // Write expression values to a text file\n    // const link = document.createElement('a');\n    // link.setAttribute('download', 'info.txt');\n    // link.href = makeTextFile(json);\n    // document.body.appendChild(link);\n    //\n    // // wait for the link to be added to the document\n    // window.requestAnimationFrame(function () {\n    //   const event = new MouseEvent('click');\n    //   link.dispatchEvent(event);\n    //   document.body.removeChild(link);\n    // });\n  }\n}\n\n; // function log(node_name, msg) {\n//   $(node_name).append(\"<span>\" + msg + \"</span><br />\")\n// }\n//function executes when the Reset button is pushed.\n// function onReset() {\n//   console.log(\"Clicked the reset button\");\n//   if (detector && detector.isRunning) {\n//     detector.reset();\n//   }\n// };\n//Draw the detected facial feature points on the image\n// function drawFeaturePoints(img, featurePoints) {\n//   var contxt = $('#face_video_canvas')[0].getContext('2d');\n//\n//   var hRatio = contxt.canvas.width / img.width;\n//   var vRatio = contxt.canvas.height / img.height;\n//   var ratio = Math.min(hRatio, vRatio);\n//\n//   contxt.strokeStyle = \"#FFFFFF\";\n//   for (var id in featurePoints) {\n//     contxt.beginPath();\n//     contxt.arc(featurePoints[id].x,\n//       featurePoints[id].y, 2, 0, 2 * Math.PI);\n//     contxt.stroke();\n//\n//   }\n// }\n\n//# sourceURL=webpack:///./src/webcam.js?");

/***/ })

/******/ });