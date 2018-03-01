const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
const socketio = require('socket.io')
const multer = require('multer')
const PORT = process.env.PORT || 8080
const app = express()
module.exports = app

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, __dirname)
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname)
    }
  })

  const upload = multer({ storage: storage })

  // compression middleware
  app.use(compression())

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  app.post('/upload', upload.single('audio-recording'), function(req, res, next) {
    res.send('Upload successful.')
  })

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    res.send('Connected!')
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
  const server = app.listen(PORT, () => console.log(`Echoing it up on port ${PORT}`))

  const io = socketio(server)
  require('./socket')(io)
}

createApp()
if (require.main === module) startListening()
