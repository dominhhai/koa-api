import koaRouter from 'koa-router'
import users from './users'
import point from './point'

const router = koaRouter()

router.get('/', async (ctx, next) => {
  ctx.body = { index: 'index' }
})

router.use('/users', users.routes(), users.allowedMethods())
router.use('/point', point.routes(), point.allowedMethods())

export default router
