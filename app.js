const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
//端口号
app.listen(8000)

//处理页面
const views = require('koa-views')
//处理json数据
const json = require('koa-json')
//处理报错
const onerror = require('koa-onerror')
//处理上传数据
const bodyparser = require('koa-bodyparser')
//处理日志
const logger = require('koa-logger')
//session和redis
// const session = require('koa-generic-session')
// const redisStore = require('koa-redis')

//动态引入redis
// const { REDIS_CONF } = require('./conf/db.js')

//引用路由
const blog = require('./routers/blog.js')
const user = require('./routers/user.js')

//error handler
onerror(app)

//注册middlewares(中间件)
app.use(bodyparser({
    //处理postdata不同格式的数据
    enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

//处理静态数据
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

//打印日志
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    //服务耗时
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} ${ms}ms`)
})

//生成密匙
// app.keys = ['DZG_dzg@']
// app.use(session({
//     //配置cookie
//     cookie: {
//         path: '/',
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000
//     },
//     //配置redis
//     store: redisStore ({
//         all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
//     })
// }))

//注册router
router.use('/api/blog', blog)
router.use('/api/user', user)
app.use(router.routes(), router.allowedMethods())

//抛出异常
app.on('error', (err, ctx) => {
    console.error('server error: ', err, ctx)
})

module.exports = {
    app
}