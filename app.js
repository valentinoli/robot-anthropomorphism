const Vue = require('vue')
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const fs = require('fs')
const { promisify } = require('util')
const [writeFileAsync] = [fs.writeFile].map(mod => promisify(mod))
const path = require('path')

const server = express()
const renderer = require('vue-server-renderer').createRenderer({
  template: fs.readFileSync('./index.template.html', 'utf-8')
})
server.use(bodyParser.json({ limit: '20mb' }))  // Allow 20mb request body size
server.use(express.static(__dirname + '/public'))
server.use(require('serve-favicon')(path.join(__dirname, 'public', 'img', 'favicon.ico')))

// Webcam version
server.get('/webcam', (req, res) => {
  const webcamAppContext = {
    title: 'Webcam Facial Expression Tracker',
    scripts: `
      <script src='js/build/affdex.js'></script>
      <script src='js/build/webcam.js'></script>
    `,
  }

  const exampleVideoSource = 'video/video1.mp4'

  const app = new Vue({
    template: `
      <div class="container-fluid">
        <div id="affdexElements"></div>
        <video id="video" controls src="${exampleVideoSource}"></video>
      </div>`
  })

  renderer.renderToString(app, webcamAppContext, (err, html) => {
    if (err) {
      console.error(err)
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

// Post processing app
server.get('/', (req, res) => {
  const videoProcessingAppContext = {
    title: 'Video Facial Expression Processor',
    scripts: `
      <script src='js/build/affdex-edited-for-processing.js'></script>
      <script src='js/build/post-processing.js'></script>
    `,
  }

  const app = new Vue({
    template: `
      <div class="container-fluid">
        <div id="affdexElements"></div>
      </div>
    `,
  })

  renderer.renderToString(app, videoProcessingAppContext, (err, html) => {
    if (err) {
      console.error(err)
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

/*** RESULT PROCESSING ***/

function processResults(results) {
  // Function for processing results object
  // Returns a nicely formatted object with less redundancy
  if (results && results.length > 0) {
    // Store results in a nice format
    const data = {}

    // Initialization
    for (const [key1, val1] of Object.entries(results[0])) {
      // {key1: val} --> { appearance: {...}, expressions: {...}, ...}
      data[key1] = {}
      for (const key2 of Object.keys(val1)) {
        // [key2] --> glasses, gender, browRaise, etc.
        data[key1][key2] = []
      }
    }

    // Feed results into new data object
    results.forEach(res => {
      for (const [key1, val1] of Object.entries(res)) {
        for (const [key2, val2] of Object.entries(val1)) {
          if (typeof(val2) === 'number') {
            data[key1][key2].push(Number(val2.toFixed(0)))
          } else {
            data[key1][key2].push(val2)
          }
        }
      }
    })

    return data
  }
}

// Post results from AFFDEX SDK and process on the backend
server.post('/', async (req, res) => {
  try {
    const {
      body: {
        timestamps,
        results,
      }
    } = req

    const data = processResults(results)
    const json = JSON.stringify({ timestamps, data })

    const hash = require('crypto').createHash('md5').update(json).digest('hex')
    await writeFileAsync(`./python/data/${hash}.txt`, json)

    // Unless running locally, the Heroku dyno is ephemeral, so consider using AWS S3 or Postgres
    // https://devcenter.heroku.com/articles/s3-upload-node

    console.log(`JSON string hashed to: ${hash}`)
    return res.json({ data, hash, redirectUrl: `?id=${hash}` })

  } catch (err) {
    console.log(err)
    return res.status(500).end("Internal Server Error")
  }
})

const { PORT } = process.env

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
