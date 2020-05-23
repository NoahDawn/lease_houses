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
//处理上传数据(特别注意后续引用中间件时候body和bodyparser的先后顺序)
const koaBody = require('koa-body')
const bodyparser = require('koa-bodyparser')
//处理日志
const logger = require('koa-logger')
//session和redis
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
//解决跨域
const cors = require('koa2-cors')
//路径获取
const path = require('path')
//文件操作
const fs = require('fs')

//动态引入redis
const { REDIS_CONF } = require('./conf/db.js')

//引用路由
const user = require('./routers/user.js')
const house = require('./routers/house.js')
const record = require('./routers/record.js')
const order = require('./routers/order.js')

//error handler
onerror(app)

//注册middlewares(中间件)
//设置图片的上传大小
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}))
//设置接收数据的格式
app.use(bodyparser({
    //处理postdata不同格式的数据
    enableTypes:['json', 'form', 'text']
}))

app.use(json())
app.use(logger())

//处理静态数据
app.use(require('koa-static')(path.join(__dirname + '/static')))

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

//实现跨域
app.use(cors({
    origin: function(ctx) { //设置允许来自指定域名请求
        return '*';  //直接设为所有域名都可访问
        // if (ctx.url === '/test') {
        //     return '*';// 允许来自所有域名请求
        // }
        // return 'http://localhost:8000'; //只允许http://localhost:8080这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}))

router.post('/register', async function (ctx, next) {
    const body = ctx.request.body
    const newData = await register(body)
    ctx.body = new SuccessModel(newData)
})

const { updateUserMS } = require('./controller/user.js')
//用户个人信息修改，含头像上传部分
router.post('/api/user/update', async function (ctx, next) {
    const body = ctx.request.body

    //头像的上传
    const file = ctx.request.files.user
    const userid = ctx.request.query.userid
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    // 修改文件的名称
    var newFilename = 'user_'+`${userid}`+'.'+file.name.split('.')[1]
    var uploadPath = path.join(__dirname, '/static/picture/user/') + `/${newFilename}`;
    
    //创建可写流
    const upStream = fs.createWriteStream(uploadPath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    //返回保存的路径
    const url = 'http://' + ctx.headers.host + '/static/picture/user/' + newFilename

    //将保存的路径写入body
    body.picture = url
    body.id = userid
    const newData = await updateUserMS(body)
    return ctx.body = {userid:newData.id}
})

//注册router
router.use('/api/user', user)
router.use('/api/house', house)
router.use('/api/record', record)
router.use('/api/order', order)
app.use(router.routes(), router.allowedMethods())

//抛出异常
app.on('error', (err, ctx) => {
    console.error('server error: ', err, ctx)
})

module.exports = {
    app
}