#!/usr/bin/env node

require('babel-register')
const http = require('http')
const fs = require('fs')
const path = require('path')
const app = require('../app').default

const appDir = path.resolve(__dirname, '..')
const logDir = path.join(appDir, 'logs')

try {
  fs.mkdirSync(logDir)
} catch (e) {
  if (e.code !== 'EEXIST') {
    console.error('Could NOT setup log directory, error was:', e)
    process.exit(1)
  }
}
const log4js = require('koa-log4')
log4js.configure(path.join(appDir, 'log4js.json'), { cwd: logDir })
const logger = log4js.getLogger('startup')

var port = normalizePort(process.env.PORT || 3000)

var server = http.createServer(app.callback())
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  logger.info('Listening on ' + bind)
}