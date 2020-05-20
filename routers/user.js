const router = require('koa-router') ()
const { login, register } = require('../controller/user.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const { generateToken } = require('../untils/token.js')

//添加路由前缀
// router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    const { username, password } = ctx.request.body
    const data = await login(username, password)
    if (data.username) {
        //设置session
        // let token = generateToken(data.id, data.username)
        // if(token){
        //     ctx.body={
        //     ststus:200,
        //     token,
        //     test: "test"
        //     }
        // }
        // app.redis.set(loginResult.msg[0]._id, token)
        // console.log('token is: ', token)
        // console.log('test is: ', ctx.body.test)
        // console.log('tokenms is: ', ctx.body.token.username)
        // ctx.session.userid = data.id
        // ctx.session.username = data.username
        // ctx.session.realname = data.realname
        ctx.body = new SuccessModel()
        return
    }
    ctx.body = new ErrorModel('登录失败')
})

router.get('/session-test', async function (ctx, next) {
    //检测访问次数
    if (ctx.session.viewCount == null) {
        ctx.session.viewCount = 0
    }
    ctx.session.viewCount++

    ctx.body = {
        errno: 0,
        viewCount: ctx.session.viewCount
    }
})

router.post('/register', async function (ctx, next) {
    const body = ctx.request.body
    const newData = await register(body)
    ctx.body = new SuccessModel(newData)
})

module.exports = {
    router
}