const router = require('koa-router') ()
const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
// const loginCheck = require('../middleware/loginCheck.js')

//添加路由前缀
// router.prefix('/api/blog')

//获取列表路由
router.get('/list', async function (ctx, next) {
    let author = ctx.query.author || ''
    let keyword = ctx.query.keyword || ''

    if (ctx.query.isadmin) {
        console.log('is admin')
        //管理员界面
        if (ctx.session.username == null) {
            console.log('is admin, but no login')
            //未登录
            ctx.body = new ErrorModel('未登录')
            return
        }
        //强制只能查询自己的博客
        author = ctx.session.username
    }

    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData)
})

//获取详情路由
router.get('/detail', async function (ctx, next) {
    const detailData = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(detailData)
})

//新建博客路由
// router.post('/new', loginCheck, async function (ctx, next) {
router.post('/new', async function (ctx, next) {
    const body = ctx.request.body
    body.author = ctx.session.username
    const newData = await newBlog(body)
    ctx.body = new SuccessModel(newData)
})

//更新博客路由
// router.post('/update', loginCheck, async function (ctx, next) {
router.post('/update', async function (ctx, next) {
    const updateValue = await updateBlog(ctx.query.id, ctx.request.body)
    if (updateValue) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})

//删除博客路由
// router.post('/delete', loginCheck, async function (ctx, next) {
router.post('/delete', async function (ctx, next) {
    const author = ctx.session.username
    const deleteValue = await deleteBlog(ctx.query.id, author)
    if (deleteValue) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('删除博客失败')
    }
})

module.exports = {
    router
}