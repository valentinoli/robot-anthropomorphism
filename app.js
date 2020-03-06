const Vue = require('vue')
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const server = express()
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})
server.use(bodyParser.json());
server.use(express.static(__dirname + '/public'));


const context = {
  title: 'Webcam Facial Expression Tracker',
}

server.get('/', (req, res) => {
  const source = process.env.NODE_ENV === 'production' ? 'https://www.youtube.com/watch?v=Efx-J8fzlKo' : 'video.mp4';
  const app = new Vue({
    template: `
      <div class="container-fluid">
        <div id="affdexElements"></div>
        <video id="video" width="500px", height="281px" controls src="${source}"></video>
      </div>`
  })

  renderer.renderToString(app, context, (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.post('/', (req, res) => {
  console.log(req.body);
  res.json({ redirect: '/' });
})

// server.get('*', (req, res) => {
//   console.log('get')
//   const app = new Vue({
//     data: {
//       url: req.url
//     },
//     template: `<div>The visited URL is: {{ url }}</div>`
//   })
//
//   renderer.renderToString(app, (err, html) => {
//     if (err) {
//       res.status(500).end('Internal Server Error')
//       return
//     }
//     res.end(`
//       <!DOCTYPE html>
//       <html lang="en">
//         <head><title>Hello</title></head>
//         <body>${html}</body>
//       </html>
//     `)
//   })
// })

const server_port = process.env.PORT
const server_ip_address = process.env.HOST;

server.listen(server_port, server_ip_address, () => {
  console.log(`Listening on ${server_ip_address}, port ${server_port}`);
})
