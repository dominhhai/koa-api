import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/', async (ctx, next) => {
  ctx.body = { users: 'index' }
})

export default router