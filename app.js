'use strict'
const express = require('express')
const favicon = require('serve-favicon')
const logger = require('morgan')
const passport = require('passport')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { router: usersRouter } = require('./users')
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth')

const tasksAPI = require('./routes/tasks')
require('dotenv').config({ path: 'variables.env' })

const dbURL = process.env.DATABASE_URL
const PORT = process.env.PORT

// const { router: usersRouter } = require('./users')
// const { router: authRouter, localStrategy, jwtStrategy } = require('./auth')

mongoose.Promise = global.Promise
const { Task, User } = require('./models')

const app = express()
app.use(logger('common'))
app.use(bodyParser.json())
//not sure if I need the parser below... 🍪
// app.use(cookieParser('secret'))
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
})

passport.use(localStrategy)
passport.use(jwtStrategy)

app.use('/api/users/', usersRouter)
app.use('/api/auth/', authRouter)

const jwtAuth = passport.authenticate('jwt', { session: false })

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(logger('dev'))

app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  })
})

app.use('/api/tasks', jwtAuth, tasksAPI)

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' })
})

let server

function runServer(dbURL) {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbURL, err => {
      if (err) {
        return reject(err)
      }
      server = app
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`)
          resolve()
        })
        .on('error', err => {
          mongoose.disconnect()
          reject(err)
        })
    })
  })
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server')
      server.close(err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

if (require.main === module) {
  runServer(dbURL).catch(err => console.error(err))
}

module.exports = { runServer, app, closeServer }
