#!/usr/bin/env node

import { createServer } from 'http'
import { mkdirSync } from 'fs'
import { resolve, join } from 'path'
import log4js from 'koa-log4'
import app from './app'

const appDir = resolve(__dirname, '..')
const logDir = join(appDir, 'logs')

try {
  mkdirSync(logDir)
} catch (e) {
  if (e.code !== 'EEXIST') {
    console.error('Could NOT setup log directory, error was:', e)
    process.exit(1)
  }
}
log4js.configure(join(appDir, 'log4js.json'), { cwd: logDir })
const logger = log4js.getLogger('startup')

var port = normalizePort(process.env.PORT || 3000)

var server = createServer(app.callback())
server.listen(port)
server.on('error', (error) => {
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
})
server.on('listening', () => {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  logger.info('Listening on ' + bind)
})

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
