const router = require('koa-router') ()
const { login } = require('../controller/user.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const { generateToken } = require('../untils/token.js')

const fs = require('fs')

//添加路由前缀
// router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    const { username, password } = ctx.request.body
    // console.log('username is: ', username)
    // console.log('password is: ', password)
    const data = await login(username, password)
    if (data.username) {
        //设置session
        let token = generateToken(data.id, data.username)
        if(token){
            ctx.body={
            ststus:200,
            token,
            test: "test"
            }
        }
        // app.redis.set(loginResult.msg[0]._id, token)
        console.log('token is: ', token)
        console.log('test is: ', ctx.body.test)
        console.log('tokenms is: ', ctx.body.token.username)
        ctx.session.username = data.username
        ctx.session.realname = data.realname
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
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
    const userId = ctx.request.query.id
    file.name = 'picture_user_' + `${userId}`
    console.log('id is: ', userId)
    console.log('filename is: ', file.name)
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, 'picture/user') + `/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    ctx.body = new SuccessModel()
    return
})

module.exports = {
    router
}