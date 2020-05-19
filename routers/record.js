const router = require('koa-router') ()
const { getList, getDetail, isExit, addRecord } = require('../controller/record.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const loginCheck = require('../middleware/loginCheck.js')

//添加路由前缀
// router.prefix('/api/record')

//获取列表路由
// router.get('/list', async function (ctx, next) {
//     let owner = ctx.query.author || ''
//     let keyword = ctx.query.keyword || ''

//     if (ctx.query.isadmin) {
//         console.log('is admin')
//         //管理员界面
//         if (ctx.session.username == null) {
//             console.log('is admin, but no login')
//             //未登录
//             ctx.body = new ErrorModel('未登录')
//             return
//         }
//         //强制只能查询自己的博客
//         owner = ctx.session.username
//     }

//     const listData = await getList(owner, keyword)
//     ctx.body = new SuccessModel(listData)
// })

//获取详情路由
// router.get('/detail', async function (ctx, next) {
//     const detailData = await getDetail(ctx.query.id)
//     ctx.body = new SuccessModel(detailData)
// })

//删除博客路由
// router.post('/delete', loginCheck, async function (ctx, next) {
// router.post('/delete', async function (ctx, next) {
//     const author = ctx.session.username
//     const deleteValue = await deleteBlog(ctx.query.id, author)
//     if (deleteValue) {
//         ctx.body = new SuccessModel()
//     } else {
//         ctx.body = new ErrorModel('删除博客失败')
//     }
// })

module.exports = {
    router
}