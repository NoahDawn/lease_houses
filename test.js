const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const koaBody = require('koa-body')

const blog = require('./routers/blog')
const user = require('./routers/user')
router.use('/api/blog', blog)
router.use('/api/user', user)

app.use(router.routes()).use(router.allowedMethods())

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}))

// const { genPassword } = require('./untils/cryp.js')
// console.log(genPassword('123'))

app.listen(8000)

module.exports = {
    app
}