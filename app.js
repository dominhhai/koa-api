import Koa from 'koa'
import koaRouter from 'koa-router'
import json from 'koa-json'
import onerror from 'koa-onerror'
import bodyparser from 'koa-bodyparser'
import serve from 'koa-static'
import path from 'path'
import log4js from 'koa-log4'
import api from './routers/api'

const app = new Koa()
const router = koaRouter()
const logger = log4js.getLogger('app')
// middlewares
app.use(bodyparser())
app.use(json())
app.use(log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' }))
app.use(serve(path.join(__dirname, 'public')))

// handle error
onerror(app)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes definition
// router.use('/', index.routes(), index.allowedMethods())
// router.use('/users', users.routes(), users.allowedMethods())
router.use('/api', api.routes(), api.allowedMethods())

// mount root routes
app.use(router.routes())
    .use(router.allowedMethods())


// log error
app.on('error', (err, ctx) => {
  logger.error(err)
  logger.error('server error', err, ctx)
})

export default app