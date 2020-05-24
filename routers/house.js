const router = require('koa-router') ()
const { getList, getHouseDetail, newHouse, updateHouse, deleteHouse } = require('../controller/house.js')
const { isExit, addRecord,updateRecord } = require('../controller/record.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const loginCheck = require('../middleware/loginCheck.js')

const date = require('silly-datetime')

//获取列表路由
router.get('/list', async function (ctx, next) {
    let ownerId = ctx.query.ownerId || ''
    let keyword = ctx.query.keyword || ''

    const listData = await getList(ownerId, keyword)
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

// //添加房源路由
// router.post('/new', loginCheck, async function (ctx, next) {
//     const body = ctx.request.body
//     body.owner = ctx.query.owner
//     body.ownerId = ctx.query.ownerId
//     const newData = await newHouse(body)
//     ctx.body = new SuccessModel(newData)
// })

//更新房屋租赁状态路由
router.post('/update', async function (ctx, next) {
    const body = ctx.request.body
    body.id = ctx.query.id
    body.ownerId = ctx.query.ownerId
    const updateValue = await updateHouse(body)
    if (updateValue) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新房源信息失败')
    }
})

//删除房源路由
router.post('/delete', async function (ctx, next) {
    const id = ctx.query.id
    const houseData = await getHouseDetail(id)
    console.log(houseData.rentCount)
    if (houseData.rentCount === 0) {
        const deleteValue = await deleteHouse(id, ctx.query.ownerId)
        if (deleteValue) {
            ctx.body = new SuccessModel()
        } else {
            ctx.body = new ErrorModel('删除房源失败')
        }
    } else {
        ctx.body = new ErrorModel('当前房源存在租户,不可删除')
    }
})

module.exports = {
    router
}