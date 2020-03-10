// SDK Needs to create video and canvas nodes in the DOM in order to function
// Here we are adding those nodes a predefined div.
const divRoot = document.getElementById("affdexElements");
const width = 640;
const height = 480;
const faceMode = affdex.FaceDetectorMode.LARGE_FACES;

// Construct a CameraDetector and specify the image width / height and face detector mode.
const detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

//Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();
detector.detectAllExpressions();
detector.detectAllEmojis();
detector.detectAllAppearance();

//Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", () => console.log("The detector reports initialized"));

//Add a callback to notify when camera access is allowed
detector.addEventListener("onWebcamConnectSuccess", () => console.log("Webcam access allowed"));

// Add a callback to notify when camera access is denied
detector.addEventListener("onWebcamConnectFailure", () => console.log("Webcam access denied"));

// Add a callback to notify when detector is stopped
detector.addEventListener("onStopSuccess", () => console.log("The detector reports stopped"));

const results = [];
const timestamps = [];

const loadingEl = document.querySelector('.loading');

// Add a callback to receive the results from processing an image.
// The faces object contains the list of the faces detected in an image.
// Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Number of faces found: ${faces.length}`);

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
    // log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
    // log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
    //   return val.toFixed ? Number(val.toFixed(0)) : val;
    // }));
    // log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
    //   return val.toFixed ? Number(val.toFixed(0)) : val;
    // }));

    // expressions.push(timestamp.toFixed(2));
    // expressions.push(JSON.stringify(faces[0].expressions, function(key, val) {
    //   return val.toFixed ? Number(val.toFixed(0)) : val;
    // }))
  }
});

const videoEl = document.getElementById('video');
videoEl.addEventListener('play', onStart);
videoEl.addEventListener('ended', onStop);

function onStart() {
  if (detector && !detector.isRunning) {
    // Run start() in affdex.js
    console.log("Detector started");
    detector.start();
  }
}

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
  loadingEl.style.display = loadingEl.style.display === 'none' ? 'flex': 'none';
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
      console.log(json);
      const { redirectUrl } = json;
      setTimeout(() => {
        toggleLoading();
        window.location = redirectUrl;
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

// function log(node_name, msg) {
//   $(node_name).append("<span>" + msg + "</span><br />")
// }

//function executes when the Reset button is pushed.
// function onReset() {
//   console.log("Clicked the reset button");
//   if (detector && detector.isRunning) {
//     detector.reset();
//   }
// };

//Draw the detected facial feature points on the image
// function drawFeaturePoints(img, featurePoints) {
//   var contxt = $('#face_video_canvas')[0].getContext('2d');
//
//   var hRatio = contxt.canvas.width / img.width;
//   var vRatio = contxt.canvas.height / img.height;
//   var ratio = Math.min(hRatio, vRatio);
//
//   contxt.strokeStyle = "#FFFFFF";
//   for (var id in featurePoints) {
//     contxt.beginPath();
//     contxt.arc(featurePoints[id].x,
//       featurePoints[id].y, 2, 0, 2 * Math.PI);
//     contxt.stroke();
//
//   }
// }
