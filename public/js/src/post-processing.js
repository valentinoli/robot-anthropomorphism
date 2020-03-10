// SDK Needs to create video and canvas nodes in the DOM in order to function
// Here we are adding those nodes a predefined div.
const divRoot = document.getElementById("affdexElements");
const width = 640;
const height = 480;
const faceMode = affdex.FaceDetectorMode.LARGE_FACES;

// Construct a CameraDetector and specify the image width / height and face detector mode.
const detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

let results = [];
let timestamps = [];

import videoNames from './video'

function runNextVideo() {
  if (detector && !detector.isRunning && videoNames.length > 0) {
    // Run start() in affdex-edited-for-processing.js
    // Creates video element and canvas element + context
    // Returns the video element. Doesn't really start the detector.
    const videoEl = detector.start();
    const nextVideo = videoNames[0];
    videoEl.setAttribute('src', `video/${nextVideo}.mp4`);
    // videoEl.play();

    const onPlaying = () => {
      // Call this function only once when video starts playing
      // Start the AFFDEX detector
      console.log("Detector started");
      affdex.Detector.prototype.start.apply(detector);
    }

    videoEl.addEventListener('playing', onPlaying);

    videoEl.addEventListener('ended', onStop);  // call onStop() when video ends

    videoEl.addEventListener('canplay', () => {
      // play video when it is available
      const promise = videoEl.play();
      promise.then(() => {
        console.log(`Video playing: ${nextVideo}`);
        videoEl.removeEventListener('playing', onPlaying);
      }).catch(console.error)
    });
  }
}


//Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();
detector.detectAllExpressions();
detector.detectAllEmojis();
detector.detectAllAppearance();

//Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", () => console.log("The detector reports initialized"));

// //Add a callback to notify when camera access is allowed
// detector.addEventListener("onWebcamConnectSuccess", () => console.log("Webcam access allowed"));
//
// // Add a callback to notify when camera access is denied
// detector.addEventListener("onWebcamConnectFailure", () => console.log("Webcam access denied"));

// Add a callback to notify when detector is stopped
detector.addEventListener("onStopSuccess", () => console.log("The detector reports stopped"));

// Add a callback to receive the results from processing an image.
// The faces object contains the list of the faces detected in an image.
// Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
  // console.log(`Timestamp: ${timestamp}`);
  // console.log(`Number of faces found: ${faces.length}`);

  if (faces.length > 0) {
    const {
      appearance,
      expressions,
      emotions,
      emojis,
    } = faces[0];

    const result = {
      appearance,
      expressions,
      emotions,
      emojis,
    };

    timestamps.push(timestamp);
    results.push(result);
  }
});

// // https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript
// let textFile = null;
// const makeTextFile = function (res) {
//   const data = new Blob([res], {type: 'text/plain'});
//
//   // If we are replacing a previously generated file we need to
//   // manually revoke the object URL to avoid memory leaks.
//   if (textFile !== null) {
//     window.URL.revokeObjectURL(textFile);
//   }
//
//   textFile = window.URL.createObjectURL(data);
//
//   // returns a URL you can use as a href
//   return textFile;
// };

function toggleLoading() {
  const loadingEl = document.querySelector('.loading');
  loadingEl.style.display = loadingEl.style.display === 'flex' ? 'none': 'flex';
}

//function executes when the Stop button is pushed.
function onStop() {
  if (detector && detector.isRunning) {
    detector.removeEventListener();
    detector.stop();
    // Post results to server and show loading state
    toggleLoading();

    fetch('/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timestamps, results }),
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
      } else {
        return Promise.reject(new Error(response.statusText))
      }
    })
    .then(res => res.json())
    .then(json => {
      results = [];
      timestamps = [];
      videoNames.shift();  // process next video

      console.log(`Results from AFFDEX parsed successfully, saved in ${json.hash}.txt`);
      setTimeout(() => {
        toggleLoading();
        runNextVideo();
      }, 4000);
    })
    .catch(error => {
      toggleLoading();
      console.error(error);
    });

    // // 4 March 2020 - Valentin
    // // Write expression values to a text file
    // const link = document.createElement('a');
    // link.setAttribute('download', 'info.txt');
    // link.href = makeTextFile(json);
    // document.body.appendChild(link);
    //
    // // wait for the link to be added to the document
    // window.requestAnimationFrame(function () {
    //   const event = new MouseEvent('click');
    //   link.dispatchEvent(event);
    //   document.body.removeChild(link);
    // });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  // Run first video only when user has clicked the window
  // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
  window.addEventListener('click', runNextVideo);
});
