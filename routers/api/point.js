import koaRouter from 'koa-router'

const router = koaRouter()

router.get('/', async (ctx, next) => {
  ctx.body = { point: 'index' }
})

export default router