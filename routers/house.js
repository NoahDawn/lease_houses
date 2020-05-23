const router = require('koa-router') ()
const { getList, getHouseDetail, newHouse, updateHouse } = require('../controller/house.js')
const { isExit, addRecord,updateRecord } = require('../controller/record.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const loginCheck = require('../middleware/loginCheck.js')

const date = require('silly-datetime')

//获取列表路由
router.get('/list', async function (ctx, next) {
    let owner = ctx.query.owner || ''
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
        owner = ctx.session.username
    }

    const listData = await getList(owner, keyword)
    ctx.body = new SuccessModel(listData)
})

//获取详情路由
router.get('/detail', async function (ctx, next) {
    const houseid = ctx.query.houseid || ''
    const myid = ctx.query.myid || ''
    //获取房源详情
    const detailData = await getHouseDetail(houseid)
    //若个人id和房源id都不为空，则生成浏览记录
    if (myid && houseid) {
        const exitData = await isExit(myid, houseid)
        //若曾经进入过该房源，则修改浏览时间
        if (exitData) {
            const updatetime = date.format(new Date(),'YYYY-MM-DD HH:mm:ss');
            const id = exitData.id
            updateRecord(id, updatetime)
        } else {
            //若从未浏览过，则生成浏览记录
            const createtime = date.format(new Date(),'YYYY-MM-DD HH:mm:ss');
            const recordData = { myId: myid, houseId: houseid, createtime: createtime}
            addRecord(recordData)
        }
    }
    ctx.body = new SuccessModel(detailData)
})

//添加房源路由
router.post('/new', loginCheck, async function (ctx, next) {
// router.post('/new', async function (ctx, next) {
    const body = ctx.request.body
    // body.owner = ctx.session.realname
    body.owner = ctx.query.owner
    body.ownerId = ctx.query.ownerId
    const newData = await newHouse(body)
    ctx.body = new SuccessModel(newData)
})

//更新房屋租赁状态路由
// router.post('/update', loginCheck, async function (ctx, next) {
router.post('/update', async function (ctx, next) {
    const updateValue = await updateHouse(ctx.query.id)
    if (updateValue) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新租赁状态失败')
    }
})

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