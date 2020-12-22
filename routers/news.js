const router = require('koa-router') ()
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const { getNewsList, getReplyList, newComment,Reply} = require('../controller/news.js')

//获取留言列表路由
router.get('/list-comment', async function (ctx, next) {
    let houseId = ctx.query.houseId || ''//没有数据返回空值

    const newslist = await getNewsList(houseId)
    for(let news of newslist) {
        const replylist = await getReplyList(news.id)
        news.reply = replylist
    }
    
    ctx.body = new SuccessModel(newslist)
})
//留言路由
router.post('/new-comment', async function (ctx, next) {
    const body = ctx.request.body
    body.author = ctx.query.username
    body.myId = ctx.query.myId
    body.houseId = ctx.query.houseId
    const newData = await newComment(body)
    ctx.body = new SuccessModel(newData)
})
//回复路由
router.post('/reply', async function (ctx, next) {
    const body = ctx.request.body
    body.author = ctx.query.username
    body.myId = ctx.query.myId
    body.houseId = ctx.query.houseId
    body.newsId = ctx.query.newsId
    const newData = await Reply(body)
    ctx.body = new SuccessModel(newData)
})

module.exports = {
    router
}