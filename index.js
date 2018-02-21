const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
const socketio = require('socket.io')
const db = require('./db')
const PORT = process.env.PORT || 8080
const app = express()
module.exports = app

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // compression middleware
  app.use(compression())

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
  const server = app.listen(PORT, () =>
    console.log(`Echoing it up on port ${PORT}`)
  )

  const io = socketio(server)
  require('./socket')(io)
}

if (require.main === module) {
  createApp().then(startListening)
} else {
  createApp()
}
